/*
# Switch helper functions to SECURITY INVOKER

Removes the `anon_security_definer_function_executable` advisor warnings.
None of these functions need elevated privileges — they only read/modify
the table the calling user is already operating on (clients/projects), so
the calling user's own RLS and table grants are sufficient.

## Changes
- `update_updated_at()` — SECURITY INVOKER (was DEFINER). Trigger functions
  run with the table owner's privileges anyway; the DEFINER flag is unused.
- `set_client_code()` / `set_project_code()` — SECURITY INVOKER. They read
  the table the insert is on, which the inserting role already can.
- `generate_client_code()` / `generate_project_code()` — SECURITY INVOKER.
  They count rows on clients/projects, which the calling role can SELECT.

No tables, columns, policies, or grants change. Triggers stay attached.
*/

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_client_code()
RETURNS text
LANGUAGE sql
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT 'CLT-' || lpad((count(*) + 1)::text, 4, '0') FROM public.clients;
$$;

CREATE OR REPLACE FUNCTION public.generate_project_code()
RETURNS text
LANGUAGE sql
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT 'PRJ-' || lpad((count(*) + 1)::text, 4, '0') FROM public.projects;
$$;

CREATE OR REPLACE FUNCTION public.set_client_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NEW.client_code IS NULL OR NEW.client_code = '' THEN
    NEW.client_code := public.generate_client_code();
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_project_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NEW.project_code IS NULL OR NEW.project_code = '' THEN
    NEW.project_code := public.generate_project_code();
  END IF;
  RETURN NEW;
END;
$$;
