import { Link } from 'react-router-dom'
import { Briefcase, GraduationCap, Code2, Database, ArrowRight } from 'lucide-react'

export default function About() {
  return (
    <div className="animate-fade-in">
      <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1e3a5f]">
            <Briefcase className="h-7 w-7 text-white" />
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900">About Smart CPMS</h1>
          <p className="mt-4 text-lg text-slate-600">
            A second-year BTech Computer Science OOP project demonstrating full-stack web development,
            object-oriented principles, and secure database integration.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          <Card icon={GraduationCap} title="Academic Project">
            Built as part of the Object-Oriented Programming coursework, Smart CPMS demonstrates
            real CRUD operations, relational data modeling, and a clean responsive UI.
          </Card>
          <Card icon={Code2} title="Full-Stack Build">
            The frontend is React + TypeScript + Vite with Tailwind CSS and Recharts. The C++17
            console companion shares the same database through the Supabase REST API.
          </Card>
          <Card icon={Database} title="Supabase Backend">
            Data persists in a managed PostgreSQL database with Row Level Security, foreign-key
            constraints, and auto-generated client and project codes.
          </Card>
          <Card icon={Briefcase} title="Practical Focus">
            Designed to feel like a real SaaS product — with dashboards, filters, charts, and the
            loading, error, and empty states users expect.
          </Card>
        </div>

        <div className="mt-14 rounded-2xl bg-slate-50 p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">See it in action</h2>
          <p className="mt-3 text-slate-600">Open the console and explore the full management system.</p>
          <Link
            to="/app"
            className="group mt-6 inline-flex items-center gap-2 rounded-lg bg-[#1e3a5f] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#2b5278]"
          >
            Launch Console
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

function Card({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#1e3a5f]/10 text-[#1e3a5f]">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-800">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{children}</p>
    </div>
  )
}
