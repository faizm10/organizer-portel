-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.event_people (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  person_type text NOT NULL CHECK (person_type = ANY (ARRAY['volunteer'::text, 'mentor'::text, 'judge'::text, 'sponsor'::text, 'partner'::text])),
  full_name text NOT NULL,
  email text,
  phone text,
  company text,
  role_title text,
  bio text,
  skills ARRAY,
  notes text,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT event_people_pkey PRIMARY KEY (id),
  CONSTRAINT event_people_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id),
  CONSTRAINT event_people_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);
CREATE TABLE public.org_members (
  org_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT org_members_pkey PRIMARY KEY (org_id, user_id),
  CONSTRAINT org_members_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id),
  CONSTRAINT org_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.organizations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT organizations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  full_name text,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  is_super_admin boolean NOT NULL DEFAULT false,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'todo'::text CHECK (status = ANY (ARRAY['todo'::text, 'doing'::text, 'done'::text])),
  priority text CHECK (priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text])),
  due_date timestamp with time zone,
  created_by uuid NOT NULL,
  assigned_to uuid,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  team text CHECK (team = ANY (ARRAY['tech'::text, 'logistics'::text, 'sponsorship'::text, 'outreach'::text])),
  CONSTRAINT tasks_pkey PRIMARY KEY (id),
  CONSTRAINT tasks_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id),
  CONSTRAINT tasks_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT tasks_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES auth.users(id)
);
CREATE TABLE public.team_resources (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL,
  team text NOT NULL CHECK (team = ANY (ARRAY['tech'::text, 'logistics'::text, 'sponsorship'::text, 'outreach'::text])),
  title text NOT NULL,
  description text,
  resource_type text NOT NULL CHECK (resource_type = ANY (ARRAY['document'::text, 'link'::text, 'guide'::text, 'other'::text])),
  url text NOT NULL,
  storage_path text,
  file_name text,
  file_size bigint,
  file_type text,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT team_resources_pkey PRIMARY KEY (id),
  CONSTRAINT team_resources_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id),
  CONSTRAINT team_resources_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);