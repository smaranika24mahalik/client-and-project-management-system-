import { Link } from 'react-router-dom'
import {
  Users, FolderKanban, BarChart3, Shield, CalendarClock, DollarSign, Search, Filter, ArrowRight, CheckCircle2,
} from 'lucide-react'

const groups = [
  {
    title: 'Clients',
    icon: Users,
    items: [
      'Unique client IDs (CLT-0001) generated automatically',
      'Full name, email, phone, company, and notes',
      'Search by name, email, or client ID',
      'View a client\'s assigned projects in one click',
      'Duplicate-email protection',
    ],
  },
  {
    title: 'Projects',
    icon: FolderKanban,
    items: [
      'Auto project codes (PRJ-0001)',
      'Web Project and Software Project types',
      'Budget, deadline, status, and client assignment',
      'Filter by client, type, and status',
      'Inline status changes with confirmation',
    ],
  },
  {
    title: 'Reports & Analytics',
    icon: BarChart3,
    items: [
      'Status breakdown pie chart',
      'Client-wise project counts bar chart',
      'Combined and average budget totals',
      'Client summary table with in-progress / completed counts',
    ],
  },
  {
    title: 'Platform',
    icon: Shield,
    items: [
      'Supabase PostgreSQL with Row Level Security',
      'Loading, error, and empty states everywhere',
      'Confirmation dialogs for destructive actions',
      'Responsive layout for desktop and mobile',
    ],
  },
]

export default function Features() {
  return (
    <div className="animate-fade-in">
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Features</h1>
          <p className="mt-4 text-lg text-slate-600">
            A complete toolkit for managing clients, projects, and the numbers behind them.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {groups.map((g) => (
            <div key={g.title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#1e3a5f]/10 text-[#1e3a5f]">
                  <g.icon className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold text-slate-800">{g.title}</h2>
              </div>
              <ul className="mt-5 space-y-3">
                {g.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Search, label: 'Instant search across clients and projects' },
            { icon: Filter, label: 'Multi-filter views by client, type, and status' },
            { icon: CalendarClock, label: 'Upcoming deadline alerts with day counters' },
            { icon: DollarSign, label: 'Budget tracking with combined totals' },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
              <c.icon className="h-5 w-5 flex-shrink-0 text-[#1e3a5f]" />
              <span className="text-sm font-medium text-slate-700">{c.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            to="/app"
            className="group inline-flex items-center gap-2 rounded-lg bg-[#1e3a5f] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#2b5278]"
          >
            Try it in the console
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
