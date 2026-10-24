export type ProjectType = 'Web Project' | 'Software Project'

export type ProjectStatus = 'Not Started' | 'In Progress' | 'On Hold' | 'Completed'

export interface Client {
  id: string
  client_code: string
  full_name: string
  email: string
  phone: string | null
  company: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  project_code: string
  title: string
  project_type: ProjectType
  budget: number
  deadline: string | null
  status: ProjectStatus
  client_id: string | null
  description: string | null
  created_at: string
  updated_at: string
}

export interface ProjectWithClient extends Project {
  clients: Pick<Client, 'id' | 'full_name' | 'email' | 'client_code'> | null
}

export const PROJECT_TYPES: ProjectType[] = ['Web Project', 'Software Project']
export const PROJECT_STATUSES: ProjectStatus[] = ['Not Started', 'In Progress', 'On Hold', 'Completed']

export const STATUS_COLORS: Record<ProjectStatus, string> = {
  'Not Started': 'bg-slate-100 text-slate-700 border-slate-300',
  'In Progress': 'bg-blue-100 text-blue-700 border-blue-300',
  'On Hold': 'bg-amber-100 text-amber-700 border-amber-300',
  'Completed': 'bg-emerald-100 text-emerald-700 border-emerald-300',
}

export const STATUS_DOT_COLORS: Record<ProjectStatus, string> = {
  'Not Started': 'bg-slate-400',
  'In Progress': 'bg-blue-500',
  'On Hold': 'bg-amber-500',
  'Completed': 'bg-emerald-500',
}
