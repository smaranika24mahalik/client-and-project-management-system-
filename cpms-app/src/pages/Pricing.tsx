import { Link } from 'react-router-dom'
import { CheckCircle2, ArrowRight } from 'lucide-react'

const plans = [
  {
    name: 'Student',
    price: 'Free',
    tagline: 'For the BTech CSE OOP project',
    featured: false,
    features: [
      'Unlimited clients & projects',
      'Dashboard with live stats',
      'Reports & charts',
      'Supabase PostgreSQL backend',
      'Row Level Security',
    ],
    cta: 'Launch Console',
  },
  {
    name: 'Team',
    price: '$9',
    period: '/mo',
    tagline: 'For small teams tracking projects together',
    featured: true,
    features: [
      'Everything in Student',
      'Multiple team members',
      'Per-user project ownership',
      'Email notifications',
      'Priority support',
    ],
    cta: 'Contact Us',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    tagline: 'For larger organizations',
    featured: false,
    features: [
      'Everything in Team',
      'SSO & audit logs',
      'Custom integrations',
      'Dedicated hosting',
      'SLA & onboarding',
    ],
    cta: 'Contact Us',
  },
]

export default function Pricing() {
  return (
    <div className="animate-fade-in">
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Pricing</h1>
          <p className="mt-4 text-lg text-slate-600">
            Simple, transparent plans. The Student plan is all this project needs.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-2xl border bg-white p-7 shadow-sm ${
                p.featured ? 'border-[#1e3a5f] ring-1 ring-[#1e3a5f]' : 'border-slate-200'
              }`}
            >
              {p.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#1e3a5f] px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  Most popular
                </span>
              )}
              <h2 className="text-lg font-semibold text-slate-800">{p.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{p.tagline}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900">{p.price}</span>
                {p.period && <span className="text-sm text-slate-500">{p.period}</span>}
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/app"
                className={`mt-7 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors ${
                  p.featured
                    ? 'bg-[#1e3a5f] text-white hover:bg-[#2b5278]'
                    : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {p.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
