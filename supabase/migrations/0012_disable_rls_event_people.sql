-- Disable RLS on event_people table for debugging
-- WARNING: This removes security restrictions. Only use for development/debugging.

alter table public.event_people disable row level security;

comment on table public.event_people is 'RLS temporarily disabled for debugging';
