import { useEffect, useState, useCallback } from 'react'
import { FolderPlus, Search, Pencil, Trash2, DollarSign, Calendar, Filter } from 'lucide-react'
import { fetchProjects, fetchClients, createProject, updateProject, deleteProject, updateProjectStatus, assignProject } from '../lib/api'
import type { Client, ProjectWithClient, ProjectType, ProjectStatus } from '../lib/types'
import { PROJECT_TYPES, PROJECT_STATUSES, STATUS_COLORS, STATUS_DOT_COLORS } from '../lib/types'
import { LoadingState, ErrorState, EmptyState, Card, Badge, Modal, ConfirmDialog, Toast, PageHeader, Spinner } from '../components/ui'

export default function Projects() {
  const [projects, setProjects] = useState<ProjectWithClient[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [filterClient, setFilterClient] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<ProjectWithClient | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ProjectWithClient | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [assignTarget, setAssignTarget] = useState<ProjectWithClient | null>(null)
  const [statusTarget, setStatusTarget] = useState<ProjectWithClient | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [p, c] = await Promise.all([fetchProjects(), fetchClients()])
      setProjects(p)
      setClients(c)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase()
    const matchSearch = p.title.toLowerCase().includes(q) || p.project_code.toLowerCase().includes(q)
    const matchClient = filterClient === 'all' || p.client_id === filterClient
    const matchType = filterType === 'all' || p.project_type === filterType
    const matchStatus = filterStatus === 'all' || p.status === filterStatus
    return matchSearch && matchClient && matchType && matchStatus
  })

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteProject(deleteTarget.id)
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id))
      setDeleteTarget(null)
      setToast({ message: 'Project deleted successfully', type: 'success' })
    } catch (e) {
      setToast({ message: e instanceof Error ? e.message : 'Failed to delete project', type: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  async function handleAssign(clientId: string) {
    if (!assignTarget) return
    setActionLoading(true)
    try {
      await assignProject(assignTarget.id, clientId)
      setProjects((prev) => prev.map((p) => p.id === assignTarget.id ? {
        ...p,
        client_id: clientId,
        clients: clients.find(c => c.id === clientId) ? { id: clients.find(c => c.id === clientId)!.id, full_name: clients.find(c => c.id === clientId)!.full_name, email: clients.find(c => c.id === clientId)!.email, client_code: clients.find(c => c.id === clientId)!.client_code } : null
      } : p))
      setAssignTarget(null)
      setToast({ message: 'Project assigned successfully', type: 'success' })
    } catch (e) {
      setToast({ message: e instanceof Error ? e.message : 'Failed to assign project', type: 'error' })
    } finally {
      setActionLoading(false)
    }
  }

  async function handleStatusChange(status: ProjectStatus) {
    if (!statusTarget) return
    setActionLoading(true)
    try {
      await updateProjectStatus(statusTarget.id, status)
      setProjects((prev) => prev.map((p) => p.id === statusTarget.id ? { ...p, status } : p))
      setStatusTarget(null)
      setToast({ message: 'Status updated successfully', type: 'success' })
    } catch (e) {
      setToast({ message: e instanceof Error ? e.message : 'Failed to update status', type: 'error' })
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <LoadingState message="Loading projects..." />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Projects"
        subtitle={`${projects.length} project${projects.length !== 1 ? 's' : ''} in your system`}
        action={
          <button
            onClick={() => { setEditing(null); setShowForm(true) }}
            className="flex items-center gap-2 rounded-lg bg-[#1e3a5f] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#2b5278] transition-colors"
          >
            <FolderPlus className="h-4 w-4" /> Add Project
          </button>
        }
      />

      {/* Search + Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or project ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 shadow-sm focus:border-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm focus:border-[#1e3a5f] focus:outline-none"
          >
            <option value="all">All Clients</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm focus:border-[#1e3a5f] focus:outline-none"
          >
            <option value="all">All Types</option>
            {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm focus:border-[#1e3a5f] focus:outline-none"
          >
            <option value="all">All Statuses</option>
            {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            title={search || filterClient !== 'all' || filterType !== 'all' || filterStatus !== 'all' ? 'No matching projects' : 'No projects yet'}
            message={search || filterClient !== 'all' || filterType !== 'all' || filterStatus !== 'all' ? 'Try adjusting your filters.' : 'Add your first project to get started.'}
            action={!search && filterClient === 'all' && filterType === 'all' && filterStatus === 'all' && (
              <button onClick={() => { setEditing(null); setShowForm(true) }} className="rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#2b5278]">
                Add Project
              </button>
            )}
          />
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-3">Project ID</th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3 hidden sm:table-cell">Type</th>
                  <th className="px-6 py-3 hidden md:table-cell">Client</th>
                  <th className="px-6 py-3 hidden lg:table-cell">Budget</th>
                  <th className="px-6 py-3 hidden lg:table-cell">Deadline</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{p.project_code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-700">{p.title}</div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell text-sm text-slate-500">{p.project_type}</td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      {p.clients ? (
                        <span className="text-sm text-slate-600">{p.clients.full_name}</span>
                      ) : (
                        <button onClick={() => setAssignTarget(p)} className="text-xs font-medium text-blue-600 hover:underline">Assign</button>
                      )}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell text-sm text-slate-500">${p.budget.toLocaleString()}</td>
                    <td className="px-6 py-4 hidden lg:table-cell text-sm text-slate-500">
                      {p.deadline ? new Date(p.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={p.status}
                        onChange={(e) => setStatusTarget({ ...p, status: e.target.value as ProjectStatus })}
                        className={`cursor-pointer rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[p.status]} focus:outline-none`}
                      >
                        {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setAssignTarget(p)} className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors" title="Assign/Reassign">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 11h-6M19 8v6"/></svg>
                        </button>
                        <button onClick={() => { setEditing(p); setShowForm(true) }} className="rounded-lg p-2 text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition-colors" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(p)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <ProjectForm
          project={editing}
          clients={clients}
          onClose={() => setShowForm(false)}
          onSave={async (data) => {
            if (editing) {
              await updateProject(editing.id, data)
              setToast({ message: 'Project updated successfully', type: 'success' })
            } else {
              await createProject(data)
              setToast({ message: 'Project added successfully', type: 'success' })
            }
            setShowForm(false)
            await load()
          }}
          onError={(msg) => setToast({ message: msg, type: 'error' })}
        />
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      {/* Assign dialog */}
      {assignTarget && (
        <Modal open onClose={() => setAssignTarget(null)} title="Assign / Reassign Client">
          <div className="space-y-3">
            <p className="text-sm text-slate-500">Select a client for <span className="font-medium text-slate-700">{assignTarget.title}</span>:</p>
            {clients.length === 0 ? (
              <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">No clients available. Add a client first.</p>
            ) : (
              <select
                id="assign-client"
                defaultValue={assignTarget.client_id ?? ''}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
              >
                <option value="">— No client (unassign) —</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.full_name} ({c.client_code})</option>)}
              </select>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setAssignTarget(null)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
              <button
                onClick={() => {
                  const sel = document.getElementById('assign-client') as HTMLSelectElement
                  handleAssign(sel.value)
                }}
                disabled={actionLoading || clients.length === 0}
                className="flex items-center gap-2 rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#2b5278] disabled:opacity-50"
              >
                {actionLoading && <Spinner className="h-4 w-4" />}
                Confirm
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Status change confirmation */}
      {statusTarget && (
        <Modal open onClose={() => setStatusTarget(null)} title="Confirm Status Change">
          <div className="space-y-3">
            <p className="text-sm text-slate-500">Change <span className="font-medium text-slate-700">{statusTarget.title}</span> status to:</p>
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT_COLORS[statusTarget.status]}`} />
              <Badge className={STATUS_COLORS[statusTarget.status]}>{statusTarget.status}</Badge>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setStatusTarget(null)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
              <button
                onClick={() => handleStatusChange(statusTarget.status)}
                disabled={actionLoading}
                className="flex items-center gap-2 rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#2b5278] disabled:opacity-50"
              >
                {actionLoading && <Spinner className="h-4 w-4" />}
                Confirm
              </button>
            </div>
          </div>
        </Modal>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

function ProjectForm({
  project,
  clients,
  onClose,
  onSave,
  onError,
}: {
  project: ProjectWithClient | null
  clients: Client[]
  onClose: () => void
  onSave: (data: { title: string; project_type: ProjectType; budget: number; deadline: string; status: ProjectStatus; client_id: string; description: string }) => Promise<void>
  onError: (msg: string) => void
}) {
  const [title, setTitle] = useState(project?.title ?? '')
  const [projectType, setProjectType] = useState<ProjectType>(project?.project_type ?? 'Web Project')
  const [budget, setBudget] = useState(project?.budget?.toString() ?? '0')
  const [deadline, setDeadline] = useState(project?.deadline ?? '')
  const [status, setStatus] = useState<ProjectStatus>(project?.status ?? 'Not Started')
  const [clientId, setClientId] = useState(project?.client_id ?? '')
  const [description, setDescription] = useState(project?.description ?? '')
  const [saving, setSaving] = useState(false)
  const [validationError, setValidationError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setValidationError('')
    if (!title.trim()) { setValidationError('Project title is required'); return }
    const budgetNum = parseFloat(budget)
    if (isNaN(budgetNum) || budgetNum < 0) { setValidationError('Budget must be a valid non-negative number'); return }
    setSaving(true)
    try {
      await onSave({
        title: title.trim(),
        project_type: projectType,
        budget: budgetNum,
        deadline: deadline || '',
        status,
        client_id: clientId || '',
        description: description.trim(),
      })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to save project'
      setValidationError(msg)
      onError(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open onClose={onClose} title={project ? 'Edit Project' : 'Add New Project'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {validationError && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{validationError}</div>
        )}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Project Title <span className="text-red-500">*</span></label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
            placeholder="E-commerce Website Redesign" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Project Type <span className="text-red-500">*</span></label>
            <select value={projectType} onChange={(e) => setProjectType(e.target.value as ProjectType)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]">
              {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]">
              {PROJECT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Budget ($)</label>
            <input type="number" min="0" step="0.01" value={budget} onChange={(e) => setBudget(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
              placeholder="5000" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Deadline</label>
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]" />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Assigned Client</label>
          <select value={clientId} onChange={(e) => setClientId(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]">
            <option value="">— No client —</option>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.full_name} ({c.client_code})</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
            placeholder="Brief description of the project..." />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} disabled={saving} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">Cancel</button>
          <button type="submit" disabled={saving} className="rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#2b5278] disabled:opacity-50">
            {saving ? 'Saving...' : project ? 'Update Project' : 'Add Project'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
