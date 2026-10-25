import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'

export default function SiteLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main className={`flex-1 ${isHome ? '' : 'pt-6'}`}>{children}</main>
      <SiteFooter />
    </div>
  )
}
