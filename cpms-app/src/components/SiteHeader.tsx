import { Link, NavLink } from 'react-router-dom'
import { Briefcase, Menu, X } from 'lucide-react'
import { useState } from 'react'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/features', label: 'Features' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
]

export default function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1e3a5f]">
            <Briefcase className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <span className="block text-sm font-bold text-slate-800">Smart CPMS</span>
            <span className="block text-[10px] text-slate-400">Client & Project Management</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-[#1e3a5f]' : 'text-slate-600 hover:text-slate-900'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/app"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/app"
            className="rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#2b5278]"
          >
            Launch Console
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-slate-100 text-[#1e3a5f]' : 'text-slate-600 hover:bg-slate-50'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/app"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-[#1e3a5f] px-3 py-2.5 text-center text-sm font-semibold text-white"
            >
              Launch Console
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
