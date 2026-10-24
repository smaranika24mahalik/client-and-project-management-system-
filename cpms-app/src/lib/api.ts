import { supabase } from './supabase'
import type { Client, Project, ProjectType, ProjectStatus, ProjectWithClient } from './types'

// ---- Clients ----

export async function fetchClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function fetchClientById(id: string): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data
}

export async function createClient(input: {
  full_name: string
  email: string
  phone?: string
  company?: string
  notes?: string
}): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .insert(input)
    .select()
    .single()
  if (error) {
    if (error.code === '23505') throw new Error('A client with this email already exists.')
    throw new Error(error.message)
  }
  return data
}

export async function updateClient(
  id: string,
  input: Partial<Pick<Client, 'full_name' | 'email' | 'phone' | 'company' | 'notes'>>
): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) {
    if (error.code === '23505') throw new Error('A client with this email already exists.')
    throw new Error(error.message)
  }
  return data
}

export async function deleteClient(id: string): Promise<void> {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)
  if (error) {
    if (error.code === '23503') throw new Error('Cannot delete a client with projects assigned. Remove or reassign their projects first.')
    throw new Error(error.message)
  }
}

export async function fetchClientProjects(clientId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

// ---- Projects ----

export async function fetchProjects(): Promise<ProjectWithClient[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*, clients(id, full_name, email, client_code)')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function fetchProjectById(id: string): Promise<ProjectWithClient | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*, clients(id, full_name, email, client_code)')
    .eq('id', id)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data
}

export async function createProject(input: {
  title: string
  project_type: ProjectType
  budget?: number
  deadline?: string
  status?: ProjectStatus
  client_id?: string
  description?: string
}): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert(input)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function updateProject(
  id: string,
  input: Partial<Pick<Project, 'title' | 'project_type' | 'budget' | 'deadline' | 'status' | 'client_id' | 'description'>>
): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
  if (error) throw new Error(error.message)
}

export async function assignProject(projectId: string, clientId: string): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .update({ client_id: clientId })
    .eq('id', projectId)
  if (error) throw new Error(error.message)
}

export async function updateProjectStatus(projectId: string, status: ProjectStatus): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .update({ status })
    .eq('id', projectId)
  if (error) throw new Error(error.message)
}

// ---- Reports ----

export interface ReportData {
  totalClients: number
  totalProjects: number
  statusBreakdown: { status: string; count: number }[]
  totalBudget: number
  clientSummaries: {
    client: Client
    projectCount: number
    totalBudget: number
    inProgress: number
    completed: number
  }[]
}

export async function fetchReportData(clients: Client[], projects: ProjectWithClient[]): Promise<ReportData> {
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0)
  const statusBreakdown = ['Not Started', 'In Progress', 'On Hold', 'Completed'].map((status) => ({
    status,
    count: projects.filter((p) => p.status === status).length,
  }))
  const clientSummaries = clients.map((client) => {
    const clientProjects = projects.filter((p) => p.client_id === client.id)
    return {
      client,
      projectCount: clientProjects.length,
      totalBudget: clientProjects.reduce((sum, p) => sum + (p.budget || 0), 0),
      inProgress: clientProjects.filter((p) => p.status === 'In Progress').length,
      completed: clientProjects.filter((p) => p.status === 'Completed').length,
    }
  })

  return {
    totalClients: clients.length,
    totalProjects: projects.length,
    statusBreakdown,
    totalBudget,
    clientSummaries,
  }
}
