import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { UserPlus, Search, Pencil, Trash2, Eye, Phone, Mail, Building2 } from 'lucide-react'
import { fetchClients, createClient, updateClient, deleteClient, fetchClientProjects } from '../lib/api'
import type { Client, Project } from '../lib/types'
import { STATUS_COLORS } from '../lib/types'
import { LoadingState, ErrorState, EmptyState, Card, Badge, Modal, ConfirmDialog, Toast, PageHeader } from '../components/ui'

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null)
  const [deleteError, setDeleteError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [viewClient, setViewClient] = useState<{ client: Client; projects: Project[] } | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setClients(await fetchClients())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load clients')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase()
    return (
      c.full_name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.client_code.toLowerCase().includes(q) ||
      (c.company ?? '').toLowerCase().includes(q)
    )
  })

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    setDeleteError('')
    try {
      await deleteClient(deleteTarget.id)
      setClients((prev) => prev.filter((c) => c.id !== deleteTarget.id))
      setDeleteTarget(null)
      setToast({ message: 'Client deleted successfully', type: 'success' })
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : 'Failed to delete client')
    } finally {
      setDeleting(false)
    }
  }

  async function handleViewClient(client: Client) {
    try {
      const projects = await fetchClientProjects(client.id)
      setViewClient({ client, projects })
    } catch (e) {
      setToast({ message: e instanceof Error ? e.message : 'Failed to load client details', type: 'error' })
    }
  }

  if (loading) return <LoadingState message="Loading clients..." />
  if (error) return <ErrorState message={error} onRetry={load} />

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Clients"
        subtitle={`${clients.length} client${clients.length !== 1 ? 's' : ''} in your system`}
        action={
          <button
            onClick={() => { setEditing(null); setShowForm(true) }}
            className="flex items-center gap-2 rounded-lg bg-[#1e3a5f] px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-[#2b5278] transition-colors"
          >
            <UserPlus className="h-4 w-4" /> Add Client
          </button>
        }
      />

      {/* Search */}
      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, email, or client ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 shadow-sm focus:border-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#1e3a5f] transition-colors"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            title={search ? 'No matching clients' : 'No clients yet'}
            message={search ? 'Try a different search term.' : 'Add your first client to get started.'}
            action={!search && (
              <button
                onClick={() => { setEditing(null); setShowForm(true) }}
                className="rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#2b5278] transition-colors"
              >
                Add Client
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
                  <th className="px-6 py-3">Client ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3 hidden sm:table-cell">Email</th>
                  <th className="px-6 py-3 hidden md:table-cell">Phone</th>
                  <th className="px-6 py-3 hidden lg:table-cell">Company</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">{client.client_code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-700">{client.full_name}</div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell text-sm text-slate-500">{client.email}</td>
                    <td className="px-6 py-4 hidden md:table-cell text-sm text-slate-500">{client.phone ?? '—'}</td>
                    <td className="px-6 py-4 hidden lg:table-cell text-sm text-slate-500">{client.company ?? '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => handleViewClient(client)} className="rounded-lg p-2 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-colors" title="View">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => { setEditing(client); setShowForm(true) }} className="rounded-lg p-2 text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition-colors" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => { setDeleteTarget(client); setDeleteError('') }} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors" title="Delete">
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
        <ClientForm
          client={editing}
          onClose={() => setShowForm(false)}
          onSave={async (data) => {
            if (editing) {
              await updateClient(editing.id, data)
              setToast({ message: 'Client updated successfully', type: 'success' })
            } else {
              await createClient(data)
              setToast({ message: 'Client added successfully', type: 'success' })
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
        title="Delete Client"
        message={deleteError || `Are you sure you want to delete ${deleteTarget?.full_name}? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />

      {/* View client detail */}
      {viewClient && (
        <Modal open={!!viewClient} onClose={() => setViewClient(null)} title="Client Details" size="lg">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1e3a5f] text-lg font-bold text-white">
                {viewClient.client.full_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">{viewClient.client.full_name}</h3>
                <span className="text-xs font-medium text-slate-500">{viewClient.client.client_code}</span>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
                <Mail className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-600">{viewClient.client.email}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
                <Phone className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-600">{viewClient.client.phone ?? 'Not provided'}</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3">
                <Building2 className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-600">{viewClient.client.company ?? 'Not provided'}</span>
              </div>
            </div>
            {viewClient.client.notes && (
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs font-medium text-slate-400">Notes</p>
                <p className="mt-1 text-sm text-slate-600">{viewClient.client.notes}</p>
              </div>
            )}
            <div>
              <h4 className="mb-2 text-sm font-bold text-slate-700">Assigned Projects ({viewClient.projects.length})</h4>
              {viewClient.projects.length === 0 ? (
                <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-400">No projects assigned to this client.</p>
              ) : (
                <div className="space-y-2">
                  {viewClient.projects.map((p) => (
                    <Link
                      key={p.id}
                      to="/projects"
                      onClick={() => setViewClient(null)}
                      className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-700">{p.title}</p>
                        <p className="text-xs text-slate-400">{p.project_code} · ${p.budget.toLocaleString()}</p>
                      </div>
                      <Badge className={STATUS_COLORS[p.status]}>{p.status}</Badge>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

function ClientForm({
  client,
  onClose,
  onSave,
  onError,
}: {
  client: Client | null
  onClose: () => void
  onSave: (data: { full_name: string; email: string; phone: string; company: string; notes: string }) => Promise<void>
  onError: (msg: string) => void
}) {
  const [fullName, setFullName] = useState(client?.full_name ?? '')
  const [email, setEmail] = useState(client?.email ?? '')
  const [phone, setPhone] = useState(client?.phone ?? '')
  const [company, setCompany] = useState(client?.company ?? '')
  const [notes, setNotes] = useState(client?.notes ?? '')
  const [saving, setSaving] = useState(false)
  const [validationError, setValidationError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setValidationError('')
    if (!fullName.trim()) { setValidationError('Full name is required'); return }
    if (!email.trim()) { setValidationError('Email is required'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setValidationError('Please enter a valid email address'); return }
    setSaving(true)
    try {
      await onSave({ full_name: fullName.trim(), email: email.trim(), phone: phone.trim(), company: company.trim(), notes: notes.trim() })
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to save client'
      setValidationError(msg)
      onError(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open onClose={onClose} title={client ? 'Edit Client' : 'Add New Client'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {validationError && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{validationError}</div>
        )}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Full Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Email <span className="text-red-500">*</span></label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
            placeholder="john@example.com"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
            placeholder="+1 234 567 890"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Company</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
            placeholder="Acme Inc."
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#1e3a5f] focus:outline-none focus:ring-1 focus:ring-[#1e3a5f]"
            placeholder="Optional notes about this client..."
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} disabled={saving} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#2b5278] disabled:opacity-50">
            {saving ? 'Saving...' : client ? 'Update Client' : 'Add Client'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
