# Show Assignee Names Instead of "Assigned" in Tasks List

## Description

Currently, in the tasks list table, the "Assigned To" column displays "Assigned" for any task that has an assignee, instead of showing the actual name of the person assigned to the task. This makes it difficult to quickly identify who is responsible for each task.

## Problem

- Tasks list shows generic "Assigned" text instead of assignee names
- Users cannot quickly identify who is responsible for each task
- Inconsistent with filter buttons which correctly show member names

## Solution

Display the actual assignee's full name in the "Assigned To" column by:
1. Looking up the assigned member from `orgMembers` using `task.assigned_to`
2. Displaying `member.profile.full_name` or a fallback like "Unknown User"
3. Keeping "Unassigned" text for tasks without an assignee

## Implementation

### Files Updated
- `frontend/components/tasks-list.tsx` - Updated the "Assigned To" TableCell to display names

### Code Changes

```tsx
// Before:
<TableCell>
  <span className="text-sm text-muted-foreground">
    {task.assigned_to ? "Assigned" : "Unassigned"}
  </span>
</TableCell>

// After:
<TableCell>
  {task.assigned_to ? (
    (() => {
      const assignedMember = orgMembers.find(
        (m) => m.user_id === task.assigned_to
      );
      return (
        <span className="text-sm">
          {assignedMember?.profile.full_name || "Unknown User"}
        </span>
      );
    })()
  ) : (
    <span className="text-sm text-muted-foreground">Unassigned</span>
  )}
</TableCell>
```

## Status
✅ Fixed

## Acceptance Criteria

- [x] Tasks list displays actual assignee names instead of "Assigned"
- [x] Unassigned tasks still show "Unassigned"
- [x] If assignee is not found in orgMembers, show "Unknown User"
- [x] Works correctly on all task pages (main tasks page and team-specific pages)

## Labels
`bug`, `frontend`, `ui/ux`, `tasks`

## Priority
Medium - Improves usability but doesn't break functionality
