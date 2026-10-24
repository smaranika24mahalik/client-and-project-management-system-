import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend
} from 'recharts'
import { Users, FolderKanban, Clock, CheckCircle, CalendarClock, DollarSign, ArrowRight } from 'lucide-react'
import { fetchClients, fetchProjects, fetchReportData } from '../lib/api'
import type { Client, ProjectWithClient, ReportData } from '../lib/types'
import { STATUS_COLORS, STATUS_DOT_COLORS } from '../lib/types'
import { LoadingState, ErrorState, Card, Badge, EmptyState } from '../components/ui'

const PIE_COLORS: Record<string, string> = {
  'Not Started': '#94a3b8',
  'In Progress': '#3b82f6',
  'On Hold': '#f59e0b',
  'Completed': '#10b981',
}

export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<ProjectWithClient[]>([])
  const [report, setReport] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [c, p] = await Promise.all([fetchClients(), fetchProjects()])
      setClients(c)
      setProjects(p)
      setReport(await fetchReportData(c, p))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return <LoadingState message="Loading dashboard..." />
  if (error) return <ErrorState message={error} onRetry={load} />

  const upcomingDeadlines = projects
    .filter((p) => p.deadline && p.status !== 'Completed')
    .sort((a, b) => (a.deadline! > b.deadline! ? 1 : -1))
    .slice(0, 5)

  const recentProjects = projects.slice(0, 5)

  const stats = [
    { label: 'Total Clients', value: report?.totalClients ?? 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Projects', value: report?.totalProjects ?? 0, icon: FolderKanban, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'In Progress', value: projects.filter(p => p.status === 'In Progress').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Completed', value: projects.filter(p => p.status === 'Completed').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Upcoming Deadlines', value: upcomingDeadlines.length, icon: CalendarClock, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Total Budget', value: `$${(report?.totalBudget ?? 0).toLocaleString()}`, icon: DollarSign, color: 'text-teal-600', bg: 'bg-teal-50' },
  ]

  const chartData = report?.statusBreakdown ?? []
  const typeData = [
    { type: 'Web', count: projects.filter(p => p.project_type === 'Web Project').length },
    { type: 'Software', count: projects.filter(p => p.project_type === 'Software Project').length },
  ]

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Overview of your clients and projects</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-sm font-bold text-slate-700">Project Status Breakdown</h3>
          {chartData.every(d => d.count === 0) ? (
            <EmptyState title="No projects yet" message="Project status will appear here once you add projects." />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={chartData} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                  {chartData.map((entry) => (
                    <Cell key={entry.status} fill={PIE_COLORS[entry.status] ?? '#cbd5e1'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-sm font-bold text-slate-700">Projects by Type</h3>
          {typeData.every(d => d.count === 0) ? (
            <EmptyState title="No projects yet" message="Project type data will appear here." />
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={typeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="type" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#1e3a5f" radius={[6, 6, 0, 0]} barSize={60} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Recent activity & deadlines */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700">Recent Projects</h3>
            <Link to="/projects" className="flex items-center gap-1 text-xs font-medium text-[#1e3a5f] hover:underline">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {recentProjects.length === 0 ? (
            <EmptyState title="No projects" message="Add your first project to see it here." />
          ) : (
            <div className="space-y-3">
              {recentProjects.map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-slate-50 transition-colors">
                  <span className={`h-2.5 w-2.5 rounded-full ${STATUS_DOT_COLORS[p.status]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-slate-700">{p.title}</p>
                    <p className="text-xs text-slate-400">{p.clients?.full_name ?? 'Unassigned'} · {p.project_type}</p>
                  </div>
                  <Badge className={STATUS_COLORS[p.status]}>{p.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700">Upcoming Deadlines</h3>
            <Link to="/projects" className="flex items-center gap-1 text-xs font-medium text-[#1e3a5f] hover:underline">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {upcomingDeadlines.length === 0 ? (
            <EmptyState title="No upcoming deadlines" message="Active projects with deadlines will appear here." />
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map((p) => {
                const days = p.deadline ? Math.ceil((new Date(p.deadline).getTime() - Date.now()) / 86400000) : 0
                return (
                  <div key={p.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-slate-50 transition-colors">
                    <div className={`flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-lg ${days < 7 ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-600'}`}>
                      <span className="text-xs font-bold leading-none">{days > 0 ? days : '!'}</span>
                      <span className="text-[8px] leading-none">days</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-slate-700">{p.title}</p>
                      <p className="text-xs text-slate-400">
                        {p.deadline ? new Date(p.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No deadline'}
                      </p>
                    </div>
                    <Badge className={STATUS_COLORS[p.status]}>{p.status}</Badge>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
