import { NavLink, Link } from 'react-router-dom'
import { LayoutDashboard, Users, FolderKanban, BarChart3, Settings, Briefcase, ArrowLeft } from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/clients', label: 'Clients', icon: Users },
  { to: '/app/projects', label: 'Projects', icon: FolderKanban },
  { to: '/app/reports', label: 'Reports', icon: BarChart3 },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`fixed lg:relative z-40 h-full w-64 flex-shrink-0 transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex h-full flex-col bg-[#1e3a5f] text-white">
          <Link to="/" className="flex h-16 items-center gap-3 px-6 border-b border-white/10 hover:bg-white/5 transition-colors">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">Smart CPMS</h1>
              <p className="text-[10px] text-white/60">Management Console</p>
            </div>
          </Link>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white/15 text-white shadow-sm'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <item.icon className="h-4.5 w-4.5" strokeWidth={2} />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="px-3 py-4 border-t border-white/10">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-medium text-white/60 hover:bg-white/10 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to website
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex h-16 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="font-bold text-slate-800">Smart CPMS</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
