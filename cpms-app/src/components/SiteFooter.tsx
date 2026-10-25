import { Link } from 'react-router-dom'
import { Briefcase, Globe, Mail, Share2 } from 'lucide-react'

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1e3a5f]">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-bold text-slate-800">Smart CPMS</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-slate-500">
              A modern client and project management platform for teams that value clarity.
            </p>
          </div>

          <FooterCol
            title="Product"
            links={[
              { label: 'Features', to: '/features' },
              { label: 'Pricing', to: '/pricing' },
              { label: 'Console', to: '/app' },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { label: 'About', to: '/about' },
              { label: 'Home', to: '/' },
            ]}
          />

          <div>
            <h4 className="text-sm font-semibold text-slate-700">Connect</h4>
            <div className="mt-3 flex gap-3">
              <a href="#" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" aria-label="Website">
                <Globe className="h-5 w-5" />
              </a>
              <a href="#" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" aria-label="Email">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors" aria-label="Share">
                <Share2 className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Smart CPMS. A BTech CSE OOP college project.
          </p>
          <p className="text-xs text-slate-400">Built with React, Supabase & Tailwind CSS</p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-700">{title}</h4>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-sm text-slate-500 hover:text-[#1e3a5f] transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
