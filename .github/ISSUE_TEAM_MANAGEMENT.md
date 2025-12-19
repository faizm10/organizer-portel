# Team Management and Member Editing

## Description

Currently, teams (tech, logistics, sponsorship, outreach) are hardcoded in the codebase and cannot be customized per organization. Additionally, there is no functionality to edit member details from the People page. This issue tracks the implementation of:

1. **Team Management**: Ability to create, edit, rename, and delete teams for an organization
2. **Member Editing**: Ability to edit organizer member details (role, team assignment) from the People page

## Team Management Features

### Requirements
- [ ] **Team CRUD Operations**
  - [ ] Create new teams (with custom names)
  - [ ] Edit existing team names
  - [ ] Delete teams (with appropriate validation - cannot delete if members are assigned)
  - [ ] Teams should be scoped to an organization (each org can have their own teams)

- [ ] **UI/UX**
  - [ ] Team management interface/settings page
  - [ ] Team creation form
  - [ ] Team editing form/dialog
  - [ ] Team deletion with confirmation and member reassignment options
  - [ ] Display team list in settings or team management section

- [ ] **Database Changes**
  - [ ] Create `teams` table (replacing hardcoded team values)
  - [ ] Migrate existing team assignments to use team IDs
  - [ ] Update `org_members.team` to reference `teams.id` (foreign key)
  - [ ] Add RLS policies for team management (lead-only for create/update/delete)

### Database Schema Proposal

```sql
-- New teams table
create table public.teams (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  name text not null, -- e.g., "Tech", "Logistics", "Sponsorship", "Outreach"
  slug text not null, -- e.g., "tech", "logistics"
  color text, -- Optional: for UI theming
  description text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (org_id, slug)
);

-- Update org_members to reference teams
alter table public.org_members
  alter column team type uuid using null, -- Migration: convert text to uuid
  add constraint org_members_team_fkey foreign key (team) references public.teams (id) on delete set null;
```

## Member Editing Features

### Requirements
- [ ] **Edit Organizer Details**
  - [ ] Edit member role (lead, member, etc.)
  - [ ] Edit/assign team membership
  - [ ] Edit should be restricted to org leads
  - [ ] Validation: cannot remove last lead from an organization

- [ ] **UI/UX**
  - [ ] Edit button/action on organizer rows in People page
  - [ ] Edit dialog/form with:
    - Role selector (dropdown)
    - Team selector (dropdown with available teams)
  - [ ] Success/error toast notifications
  - [ ] Loading states during update

- [ ] **Backend**
  - [ ] Server action: `updateOrgMember(userId, orgId, updates)`
  - [ ] Authorization check (lead-only)
  - [ ] Validation logic
  - [ ] Update `org_members` table
  - [ ] Revalidate affected pages

## Implementation Notes

### Migration Strategy
1. Create `teams` table
2. For each organization, create default teams (tech, logistics, sponsorship, outreach) with matching slugs
3. Migrate existing `org_members.team` text values to team UUIDs by matching slugs
4. Change `org_members.team` column type from `text` to `uuid`

### Permissions
- Team management: Only org leads can create/edit/delete teams
- Member editing: Only org leads can edit member roles and team assignments
- All users in org can view teams and members

### Related Issues
- Relates to #22 (Org Members + Invites MVP) - team assignment is part of member management
- Current implementation in: `frontend/components/organizers-list.tsx`, `frontend/lib/org.ts`, `supabase/migrations/0013_add_team_to_org_members.sql`

## Acceptance Criteria

- [ ] Org leads can create custom teams with custom names
- [ ] Org leads can rename existing teams
- [ ] Org leads can delete teams (with proper validation for assigned members)
- [ ] Team assignments are reflected in the organizers list
- [ ] Org leads can edit organizer roles and team assignments from People page
- [ ] All changes persist to database correctly
- [ ] UI provides appropriate feedback for all actions
- [ ] Proper authorization checks are in place

## Labels
`enhancement`, `frontend`, `backend`, `db`, `people-page`

## Priority
Medium - Enhances flexibility and management capabilities but not blocking core functionality
