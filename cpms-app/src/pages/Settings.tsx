import { useState } from 'react'
import { Database, Shield, Info, Server, Code2 } from 'lucide-react'
import { Card } from '../components/ui'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('about')

  const tabs = [
    { id: 'about', label: 'About', icon: Info },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'api', label: 'API & Security', icon: Server },
    { id: 'cpp', label: 'C++ Integration', icon: Code2 },
  ]

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">System configuration and information</p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Tabs */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="flex gap-1 overflow-x-auto lg:flex-col">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#1e3a5f] text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'about' && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-800">About This System</h3>
              <p className="mt-2 text-sm text-slate-500">
                The Smart Client & Project Management System is a second-year BTech CSE OOP college project
                that demonstrates object-oriented programming principles, database integration, and full-stack web development.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InfoItem label="Project Type" value="BTech CSE OOP Project" />
                <InfoItem label="Frontend" value="React + TypeScript + Vite" />
                <InfoItem label="Styling" value="Tailwind CSS" />
                <InfoItem label="Charts" value="Recharts" />
                <InfoItem label="Database" value="Supabase (PostgreSQL)" />
                <InfoItem label="Icons" value="Lucide React" />
              </div>
            </Card>
          )}

          {activeTab === 'database' && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-800">Database Schema</h3>
              <p className="mt-2 text-sm text-slate-500">
                Data is persisted in a Supabase PostgreSQL database with Row Level Security enabled.
              </p>
              <div className="mt-4 space-y-4">
                <div className="rounded-lg border border-slate-200 p-4">
                  <h4 className="text-sm font-bold text-slate-700">clients</h4>
                  <div className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
                    <Field name="id" type="uuid (PK)" />
                    <Field name="client_code" type="text (unique)" />
                    <Field name="full_name" type="text (required)" />
                    <Field name="email" type="text (unique, required)" />
                    <Field name="phone" type="text" />
                    <Field name="company" type="text" />
                    <Field name="notes" type="text" />
                    <Field name="created_at / updated_at" type="timestamptz" />
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 p-4">
                  <h4 className="text-sm font-bold text-slate-700">projects</h4>
                  <div className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
                    <Field name="id" type="uuid (PK)" />
                    <Field name="project_code" type="text (unique)" />
                    <Field name="title" type="text (required)" />
                    <Field name="project_type" type="text (Web/Software)" />
                    <Field name="budget" type="numeric(12,2)" />
                    <Field name="deadline" type="date" />
                    <Field name="status" type="text (4 values)" />
                    <Field name="client_id" type="uuid FK -> clients" />
                    <Field name="description" type="text" />
                    <Field name="created_at / updated_at" type="timestamptz" />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'api' && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-800">API & Security</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 flex-shrink-0 text-emerald-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Row Level Security (RLS) Enabled</p>
                    <p className="text-xs text-slate-500">Both tables have RLS enabled with policies allowing anonymous and authenticated access for this single-tenant demo application.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Server className="h-5 w-5 flex-shrink-0 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Secure Client Architecture</p>
                    <p className="text-xs text-slate-500">The browser uses only the public anon key. The service-role key is kept server-side and never exposed in frontend code.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Database className="h-5 w-5 flex-shrink-0 text-violet-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Foreign Key Constraint</p>
                    <p className="text-xs text-slate-500">Projects reference clients with ON DELETE RESTRICT, preventing deletion of a client that still has projects assigned.</p>
                  </div>
                </div>
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-600">Shared Field Names (Website + C++)</p>
                  <div className="mt-2 font-mono text-xs text-slate-500">
                    <p>Clients: client_code, full_name, email, phone, company</p>
                    <p>Projects: project_code, title, project_type, budget, deadline, status, client_id</p>
                    <p>Statuses: "Not Started", "In Progress", "On Hold", "Completed"</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'cpp' && (
            <Card className="p-6">
              <h3 className="text-lg font-bold text-slate-800">C++17 Console Application Integration</h3>
              <p className="mt-2 text-sm text-slate-500">
                The C++17 console application can connect to the same Supabase database through the REST API,
                using the same field names and status values as this web application.
              </p>
              <div className="mt-4 rounded-lg bg-slate-900 p-4 font-mono text-xs text-slate-300 overflow-x-auto">
                <p>// API endpoints the C++ app should use:</p>
                <p>// GET    /rest/v1/clients?select=*</p>
                <p>// POST   /rest/v1/clients</p>
                <p>// PATCH   /rest/v1/clients?id=eq.&lt;uuid&gt;</p>
                <p>// DELETE /rest/v1/clients?id=eq.&lt;uuid&gt;</p>
                <p>// GET    /rest/v1/projects?select=*,clients(*)</p>
                <p>// POST   /rest/v1/projects</p>
                <p>// PATCH   /rest/v1/projects?id=eq.&lt;uuid&gt;</p>
                <p>// DELETE /rest/v1/projects?id=eq.&lt;uuid&gt;</p>
                <p className="mt-2">// Required headers:</p>
                <p>// apikey: &lt;anon_key&gt;</p>
                <p>// Authorization: Bearer &lt;anon_key&gt;</p>
                <p>// Content-Type: application/json</p>
              </div>
              <div className="mt-4 flex items-start gap-3">
                <Code2 className="h-5 w-5 flex-shrink-0 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Shared Database</p>
                  <p className="text-xs text-slate-500">Both the website and the C++ console app read and write to the same Supabase PostgreSQL tables, ensuring data consistency across platforms.</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm text-slate-700">{value}</p>
    </div>
  )
}

function Field({ name, type }: { name: string; type: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono font-medium text-slate-700">{name}</span>
      <span className="font-mono text-slate-400">: {type}</span>
    </div>
  )
}
