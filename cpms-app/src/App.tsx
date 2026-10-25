import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SiteLayout from './components/SiteLayout'
import Layout from './components/Layout'
import Home from './pages/Home'
import Features from './pages/Features'
import Pricing from './pages/Pricing'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import Projects from './pages/Projects'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public website */}
        <Route path="/" element={<SiteLayout><Home /></SiteLayout>} />
        <Route path="/features" element={<SiteLayout><Features /></SiteLayout>} />
        <Route path="/pricing" element={<SiteLayout><Pricing /></SiteLayout>} />
        <Route path="/about" element={<SiteLayout><About /></SiteLayout>} />

        {/* Management console */}
        <Route path="/app" element={<Layout><Dashboard /></Layout>} />
        <Route path="/app/clients" element={<Layout><Clients /></Layout>} />
        <Route path="/app/projects" element={<Layout><Projects /></Layout>} />
        <Route path="/app/reports" element={<Layout><Reports /></Layout>} />
        <Route path="/app/settings" element={<Layout><Settings /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}
