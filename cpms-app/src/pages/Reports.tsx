import { useEffect, useState, useCallback } from 'react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Legend
} from 'recharts'
import { Users, FolderKanban, DollarSign, TrendingUp } from 'lucide-react'
import { fetchClients, fetchProjects, fetchReportData } from '../lib/api'
import type { ReportData } from '../lib/api'
import { STATUS_COLORS } from '../lib/types'
import { LoadingState, ErrorState, Card, Badge, EmptyState } from '../components/ui'

const PIE_COLORS: Record<string, string> = {
  'Not Started': '#94a3b8',
  'In Progress': '#3b82f6',
  'On Hold': '#f59e0b',
  'Completed': '#10b981',
}

export default function Reports() {
  const [report, setReport] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const [c, p] = await Promise.all([fetchClients(), fetchProjects()])
      setReport(await fetchReportData(c, p))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load reports')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  if (loading) return <LoadingState message="Loading reports..." />
  if (error) return <ErrorState message={error} onRetry={load} />

  const summaryStats = [
    { label: 'Total Clients', value: report?.totalClients ?? 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Projects', value: report?.totalProjects ?? 0, icon: FolderKanban, color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Combined Budget', value: `$${(report?.totalBudget ?? 0).toLocaleString()}`, icon: DollarSign, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Avg Budget / Project', value: `$${report && report.totalProjects > 0 ? Math.round(report.totalBudget / report.totalProjects).toLocaleString() : 0}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ]

  const chartData = report?.statusBreakdown ?? []

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
        <p className="mt-1 text-sm text-slate-500">Comprehensive project and client analytics</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {summaryStats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-sm font-bold text-slate-700">Project Status Distribution</h3>
          {chartData.every((d: { status: string; count: number }) => d.count === 0) ? (
            <EmptyState title="No data" message="Add projects to see status distribution." />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={chartData} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={90} label>
                  {chartData.map((entry: { status: string; count: number }) => (
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
          <h3 className="mb-4 text-sm font-bold text-slate-700">Client-wise Project Count</h3>
          {report && report.clientSummaries.every((cs: ReportData['clientSummaries'][number]) => cs.projectCount === 0) ? (
            <EmptyState title="No data" message="Assign projects to clients to see this chart." />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={report?.clientSummaries.map((cs: ReportData['clientSummaries'][number]) => ({ name: cs.client.full_name, projects: cs.projectCount, budget: cs.totalBudget })) ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="projects" fill="#1e3a5f" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* Client-wise summary table */}
      <Card className="mt-6 overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4">
          <h3 className="text-sm font-bold text-slate-700">Client-wise Project Summaries</h3>
        </div>
        {report && report.clientSummaries.length === 0 ? (
          <div className="p-6">
            <EmptyState title="No clients" message="Add clients to see summaries here." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3 text-center">Projects</th>
                  <th className="px-6 py-3 text-center">In Progress</th>
                  <th className="px-6 py-3 text-center">Completed</th>
                  <th className="px-6 py-3 text-right">Total Budget</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report?.clientSummaries.map((cs) => (
                  <tr key={cs.client.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-700">{cs.client.full_name}</div>
                      <div className="text-xs text-slate-400">{cs.client.client_code}</div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-slate-600">{cs.projectCount}</td>
                    <td className="px-6 py-4 text-center">
                      {cs.inProgress > 0 ? <Badge className={STATUS_COLORS['In Progress']}>{cs.inProgress}</Badge> : <span className="text-slate-400">0</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {cs.completed > 0 ? <Badge className={STATUS_COLORS['Completed']}>{cs.completed}</Badge> : <span className="text-slate-400">0</span>}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium text-slate-700">${cs.totalBudget.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-200 bg-slate-50 font-bold">
                  <td className="px-6 py-3 text-slate-700">Total</td>
                  <td className="px-6 py-3 text-center text-slate-700">{report?.totalProjects ?? 0}</td>
                  <td className="px-6 py-3 text-center text-slate-700">{report?.clientSummaries.reduce((s: number, c: ReportData['clientSummaries'][number]) => s + c.inProgress, 0) ?? 0}</td>
                  <td className="px-6 py-3 text-center text-slate-700">{report?.clientSummaries.reduce((s: number, c: ReportData['clientSummaries'][number]) => s + c.completed, 0) ?? 0}</td>
                  <td className="px-6 py-3 text-right text-slate-700">${report?.totalBudget.toLocaleString() ?? 0}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
