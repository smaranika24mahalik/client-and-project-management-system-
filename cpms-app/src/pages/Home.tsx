import { Link } from 'react-router-dom'
import {
  Users, FolderKanban, BarChart3, Shield, Zap, ArrowRight, CheckCircle2, CalendarClock, DollarSign,
} from 'lucide-react'

const heroImg = 'https://images.pexels.com/photos/7691694/pexels-photo-7691694.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'

const features = [
  { icon: Users, title: 'Client Management', desc: 'Keep every client, contact, and note in one organized, searchable place.' },
  { icon: FolderKanban, title: 'Project Tracking', desc: 'Web or software projects with budgets, deadlines, statuses, and client links.' },
  { icon: BarChart3, title: 'Live Reports', desc: 'Status breakdowns, client summaries, and budget analytics at a glance.' },
  { icon: CalendarClock, title: 'Deadline Alerts', desc: 'See upcoming deadlines with day counters so nothing slips through the cracks.' },
  { icon: DollarSign, title: 'Budget Insights', desc: 'Track combined and per-project budgets with automatic totals.' },
  { icon: Shield, title: 'Secure by Default', desc: 'Row Level Security on a managed PostgreSQL database — your data stays yours.' },
]

const stats = [
  { value: '4', label: 'Project statuses' },
  { value: '2', label: 'Project types' },
  { value: '100%', label: 'Real database ops' },
  { value: '0', label: 'Setup required' },
]

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-100/60 blur-3xl" />
          <div className="absolute -left-24 top-40 h-72 w-72 rounded-full bg-emerald-100/50 blur-3xl" />
        </div>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
              <Zap className="h-3.5 w-3.5 text-amber-500" />
              Built for the BTech CSE OOP project
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Manage clients and projects{' '}
              <span className="text-[#1e3a5f]">in one place.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-slate-600">
              Smart CPMS is a clean, modern platform for tracking your clients, projects,
              budgets, and deadlines — with live reports and a secure PostgreSQL backend.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/app"
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[#1e3a5f] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#2b5278]"
              >
                Launch Console
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/features"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Explore Features
              </Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block text-2xl font-bold text-slate-900">{s.value}</span>
                    <span className="block text-[11px] font-medium text-slate-500">{s.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-xl">
              <img
                src={heroImg}
                alt="A team collaborating on projects in a modern office"
                className="h-72 w-full object-cover sm:h-80 lg:h-96"
                loading="eager"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-xl border border-slate-200 bg-white p-4 shadow-lg sm:block">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Real-time sync</p>
                  <p className="text-xs text-slate-500">Powered by Supabase</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Everything you need to stay organized
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            From the first client to the final report, Smart CPMS keeps your workflow clear.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#1e3a5f]/10 text-[#1e3a5f] transition-colors group-hover:bg-[#1e3a5f] group-hover:text-white">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-800">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1e3a5f]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to take control of your projects?
            </h2>
            <p className="max-w-2xl text-base text-white/80">
              Open the console and start managing clients and projects right away. No sign-up required.
            </p>
            <Link
              to="/app"
              className="group inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#1e3a5f] shadow-sm transition-colors hover:bg-slate-100"
            >
              Launch Console
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
