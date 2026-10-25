/*
# Harden helper function search_path

Fixes the `function_search_path_mutable` security advisor warnings on the
five SECURITY DEFINER / trigger helper functions that came with the initial
schema migration. Each function is recreated with an explicit `search_path`
of `public`, which is the only schema these functions touch.

## Changes
1. `update_updated_at()` — trigger function that sets NEW.updated_at = now().
2. `generate_client_code()` — returns next CLT-#### code.
3. `generate_project_code()` — returns next PRJ-#### code.
4. `set_client_code()` — BEFORE INSERT trigger function for clients.
5. `set_project_code()` — BEFORE INSERT trigger function for projects.

All five are replaced in-place. No tables, columns, policies, or grants
change. Triggers are already attached and remain in place.
*/

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
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
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 'CLT-' || lpad((count(*) + 1)::text, 4, '0') FROM public.clients;
$$;

CREATE OR REPLACE FUNCTION public.generate_project_code()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 'PRJ-' || lpad((count(*) + 1)::text, 4, '0') FROM public.projects;
$$;

CREATE OR REPLACE FUNCTION public.set_client_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
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
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.project_code IS NULL OR NEW.project_code = '' THEN
    NEW.project_code := public.generate_project_code();
  END IF;
  RETURN NEW;
END;
$$;
