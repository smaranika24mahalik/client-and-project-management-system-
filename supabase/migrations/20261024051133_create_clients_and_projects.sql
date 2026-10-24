/*
# Create clients and projects tables

Creates the core schema for the Smart Client & Project Management System.

## Tables

### clients
- id (uuid, PK): unique client identifier
- client_code (text, unique): human-readable client ID like "CLT-0001"
- full_name (text, not null): client's full name
- email (text, unique, not null): client email address
- phone (text): client phone number
- company (text): optional company name
- notes (text): optional notes
- created_at (timestamptz): record creation time
- updated_at (timestamptz): record last update time

### projects
- id (uuid, PK): unique project identifier
- project_code (text, unique): human-readable project ID like "PRJ-0001"
- title (text, not null): project title
- project_type (text, not null): 'Web Project' or 'Software Project'
- budget (numeric(12,2)): project budget
- deadline (date): project deadline
- status (text, not null): 'Not Started', 'In Progress', 'On Hold', or 'Completed'
- client_id (uuid, FK -> clients.id): assigned client
- description (text): optional project description
- created_at (timestamptz): record creation time
- updated_at (timestamptz): record last update time

## Constraints
- clients.email is UNIQUE (prevents duplicate clients by email)
- projects.project_type is CHECK-constrained to Web Project / Software Project
- projects.status is CHECK-constrained to the 4 allowed values
- projects.client_id has ON DELETE RESTRICT to prevent deleting a client with projects

## Security
- RLS enabled on both tables.
- This is a single-tenant demo app with no sign-in screen, so CRUD is granted
  to both anon and authenticated roles with USING (true) policies (intentionally
  public/shared data for the college project prototype).

## Notes
1. A trigger updates updated_at automatically on row update.
2. A sequence-like function generates client_code / project_code on insert.
*/

CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_code text UNIQUE NOT NULL,
  full_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  company text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_code text UNIQUE NOT NULL,
  title text NOT NULL,
  project_type text NOT NULL CHECK (project_type IN ('Web Project', 'Software Project')),
  budget numeric(12,2) NOT NULL DEFAULT 0,
  deadline date,
  status text NOT NULL DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'In Progress', 'On Hold', 'Completed')),
  client_id uuid REFERENCES clients(id) ON DELETE RESTRICT,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_project_type ON projects(project_type);

-- Auto-update updated_at on row update
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_clients_updated_at ON clients;
CREATE TRIGGER trg_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trg_projects_updated_at ON projects;
CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Generate sequential client_code like CLT-0001
CREATE OR REPLACE FUNCTION generate_client_code()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 'CLT-' || lpad((count(*) + 1)::text, 4, '0') FROM clients;
$$;

-- Generate sequential project_code like PRJ-0001
CREATE OR REPLACE FUNCTION generate_project_code()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 'PRJ-' || lpad((count(*) + 1)::text, 4, '0') FROM projects;
$$;

-- Set default codes on insert
CREATE OR REPLACE FUNCTION set_client_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.client_code IS NULL OR NEW.client_code = '' THEN
    NEW.client_code := generate_client_code();
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION set_project_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NEW.project_code IS NULL OR NEW.project_code = '' THEN
    NEW.project_code := generate_project_code();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_client_code ON clients;
CREATE TRIGGER trg_set_client_code
  BEFORE INSERT ON clients
  FOR EACH ROW EXECUTE FUNCTION set_client_code();

DROP TRIGGER IF EXISTS trg_set_project_code ON projects;
CREATE TRIGGER trg_set_project_code
  BEFORE INSERT ON projects
  FOR EACH ROW EXECUTE FUNCTION set_project_code();

-- Enable Row Level Security
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Grants: single-tenant app, no sign-in; grant CRUD to anon + authenticated
GRANT SELECT, INSERT, UPDATE, DELETE ON clients TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON projects TO anon, authenticated;

-- Clients policies (intentionally public/shared for this no-auth prototype)
DROP POLICY IF EXISTS "anon_select_clients" ON clients;
CREATE POLICY "anon_select_clients" ON clients FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_clients" ON clients;
CREATE POLICY "anon_insert_clients" ON clients FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_clients" ON clients;
CREATE POLICY "anon_update_clients" ON clients FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_clients" ON clients;
CREATE POLICY "anon_delete_clients" ON clients FOR DELETE
  TO anon, authenticated USING (true);

-- Projects policies
DROP POLICY IF EXISTS "anon_select_projects" ON projects;
CREATE POLICY "anon_select_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_projects" ON projects;
CREATE POLICY "anon_insert_projects" ON projects FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_projects" ON projects;
CREATE POLICY "anon_update_projects" ON projects FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_projects" ON projects;
CREATE POLICY "anon_delete_projects" ON projects FOR DELETE
  TO anon, authenticated USING (true);