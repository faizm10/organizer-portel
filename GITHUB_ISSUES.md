# GitHub Issues Summary

Last fetched: 2025-12-16

## Open Issues

### Epic: Org Members + Invites MVP (#22)
**Labels:** epic, frontend, backend, db, auth  
**Status:** Open  
**Sub-issues:** 3 (0 completed)

**Goal:** Allow org leads to manage members and roles.

**MVP Scope:**
- Members list
- Change member role (lead-only)
- Invite flow (simple)

**Sub-issues:**
- #25: Backend: Simple invite flow (email or invite link)
- #24: Auth/Backend: Update member roles (lead-only)
- #23: Frontend: Members list page

---

### Epic: Announcements MVP (draft + publish) (#18)
**Labels:** epic, frontend, backend, db, auth  
**Status:** Open  
**Sub-issues:** 3 (0 completed)

**Goal:** Ship announcements system for hackathon organizers.

**Sub-issues:**
- #21: Frontend: Announcements page (list + composer)
- #20: Backend: Announcements CRUD + publish action
- #19: DB: Announcements table + RLS policies

---

### Epic: Tasks MVP (assignments + status + due dates) (#8)
**Labels:** epic, frontend, backend, db  
**Status:** Open  
**Sub-issues:** 6 (0 completed)

**Goal:** Ship a usable task system that replaces Notion/Trello for hackathon organizing.

**MVP Scope:**
- Task CRUD
- Assign to org member
- Status: todo/doing/done
- Due date + priority
- Filters by team/role + assignee

**Sub-issues:**
- #12: Frontend: Create/Edit Task form
- #11: Frontend: Tasks list UI (table or cards)
- #10: Backend: Task CRUD endpoints/actions
- #9: DB: Tasks table + RLS policies
- #13: Frontend: Task assignment UI
- #14: Frontend: Task filters (team/role/assignee)

---

### Platform: Add subdomain-based organization routing (#7)
**Labels:** backend, infra  
**Status:** Open

**Description:** Introduce subdomain-based routing so each organization can access HackPortal via its own subdomain (e.g., deltahacks.hackportal.com).

**Why later:** Intentionally deferred to keep MVP simpler. DB schema already includes org slugs.

**Planned approach:**
- Wildcard DNS (*.hackportal.com)
- Middleware to extract org slug from host
- Replace org selector with implicit org context from subdomain
- Enforce org access server-side

---

### Epic: Social Login (OAuth providers) (#2)
**Labels:** epic, auth  
**Status:** Open  
**Sub-issues:** 2 (0 completed)

**Sub-issues:**
- #6: DB: User auth accounts table (OAuth providers)
- #5: Auth: Add Slack OAuth

---

### Enhancement: Team Management and Member Editing (draft)
**Labels:** enhancement, frontend, backend, db, people-page  
**Status:** Draft  

**Description:** Add functionality to manage teams (create, edit, rename, delete) and edit organizer member details (role, team assignment) from the People page.

**Key Features:**
- Team CRUD operations (org-scoped, lead-only)
- Migrate from hardcoded teams to dynamic `teams` table
- Edit member role and team assignment from People page
- Proper validation and authorization

**Related Files:**
- `frontend/components/organizers-list.tsx`
- `frontend/lib/org.ts`
- `supabase/migrations/0013_add_team_to_org_members.sql`

**Full Issue:** See `.github/ISSUE_TEAM_MANAGEMENT.md`

---

## Issue Statistics

- **Total Issues:** 26
- **Open Issues:** 26
- **Closed Issues:** 0

### By Label

**Epics (3):**
- #22: Org Members + Invites MVP
- #18: Announcements MVP
- #8: Tasks MVP
- #2: Social Login

**Frontend (8):**
- #25, #24, #23, #21, #12, #11, #13, #14

**Backend (6):**
- #25, #24, #20, #10, #7, #5

**Database (3):**
- #19, #9, #6

**Auth (5):**
- #25, #24, #19, #6, #5

**Infra (1):**
- #7

---

## Next Steps

1. **Org Members MVP (#22)** - Foundation for team management
2. **Tasks MVP (#8)** - Core functionality for hackathon planning
3. **Announcements MVP (#18)** - Communication system
4. **Subdomain routing (#7)** - Multi-tenant architecture (future)

---

*For full issue details, visit: https://github.com/faizm10/organizer-portel/issues*



