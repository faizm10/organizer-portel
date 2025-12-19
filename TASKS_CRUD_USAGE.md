# Tasks CRUD Operations - Usage Guide

## Quick Reference

### Import Server Actions

```typescript
import { listTasks, getTask, createTask, updateTask, deleteTask } from '@/lib/tasks'
import type { Task, CreateTaskInput, UpdateTaskInput } from '@/lib/tasks'
```

## Server Actions

### 1. List All Tasks

```typescript
const result = await listTasks(orgId)

if (result.success) {
  const tasks: Task[] = result.data
  // Use tasks
} else {
  console.error(result.error)
}
```

**Parameters:**
- `orgId` (optional): Organization ID. If not provided, uses org from cookie.

**Returns:**
- `ActionResult<Task[]>` - Array of tasks for the organization

---

### 2. Get Single Task

```typescript
const result = await getTask(taskId, orgId)

if (result.success) {
  const task: Task = result.data
  // Use task
} else {
  console.error(result.error)
}
```

**Parameters:**
- `taskId` (required): Task UUID
- `orgId` (optional): Organization ID

**Returns:**
- `ActionResult<Task>` - Single task

---

### 3. Create Task

```typescript
const input: CreateTaskInput = {
  title: 'Setup venue',
  description: 'Book and prepare the hackathon venue',
  status: 'todo',
  priority: 'high',
  due_date: '2024-12-31T23:59:59Z',
  assigned_to: 'user-uuid',
}

const result = await createTask(input, orgId)

if (result.success) {
  const newTask: Task = result.data
  console.log('Task created:', newTask.id)
} else {
  console.error(result.error)
}
```

**Parameters:**
- `input` (required): CreateTaskInput object
  - `title` (required): String, 1-500 characters
  - `description` (optional): String, max 5000 characters
  - `status` (optional): 'todo' | 'doing' | 'done', defaults to 'todo'
  - `priority` (optional): 'low' | 'medium' | 'high'
  - `due_date` (optional): ISO date string
  - `assigned_to` (optional): User UUID (must be org member)
- `orgId` (optional): Organization ID

**Returns:**
- `ActionResult<Task>` - Newly created task

**Validation:**
- Title is required and cannot be empty
- Title max 500 characters
- Description max 5000 characters
- Status must be valid enum
- Priority must be valid enum
- Assigned user must be org member

---

### 4. Update Task

```typescript
const input: UpdateTaskInput = {
  title: 'Setup venue (Updated)',
  status: 'doing',
  priority: 'medium',
}

const result = await updateTask(taskId, input, orgId)

if (result.success) {
  const updatedTask: Task = result.data
  console.log('Task updated:', updatedTask.id)
} else {
  console.error(result.error)
}
```

**Parameters:**
- `taskId` (required): Task UUID
- `input` (required): UpdateTaskInput object (all fields optional)
  - `title` (optional): String, 1-500 characters
  - `description` (optional): String, max 5000 characters, or null to clear
  - `status` (optional): 'todo' | 'doing' | 'done'
  - `priority` (optional): 'low' | 'medium' | 'high', or null to clear
  - `due_date` (optional): ISO date string, or null to clear
  - `assigned_to` (optional): User UUID, or null to unassign
- `orgId` (optional): Organization ID

**Returns:**
- `ActionResult<Task>` - Updated task

**Validation:**
- Title cannot be empty if provided
- Title max 500 characters
- Description max 5000 characters
- Status must be valid enum
- Priority must be valid enum
- Assigned user must be org member

---

### 5. Delete Task

```typescript
const result = await deleteTask(taskId, orgId)

if (result.success) {
  console.log('Task deleted successfully')
} else {
  console.error(result.error)
}
```

**Parameters:**
- `taskId` (required): Task UUID
- `orgId` (optional): Organization ID

**Returns:**
- `ActionResult<void>` - Success or error

---

## UI Components

### Using TaskForm (Create/Edit)

```typescript
import { TaskForm } from '@/components/tasks/TaskForm'
import { TaskFormProvider, useTaskForm } from '@/components/tasks/TaskFormProvider'

// Wrap your component tree with TaskFormProvider
function MyPage() {
  return (
    <TaskFormProvider orgId={orgId} members={members}>
      <MyComponent />
      {/* TaskForm is rendered by the provider */}
    </TaskFormProvider>
  )
}

// In your component, use the hook to control the form
function MyComponent() {
  const { openCreateForm, openEditForm, closeForm } = useTaskForm()

  return (
    <>
      <button onClick={openCreateForm}>
        Create Task
      </button>
      
      <button onClick={() => openEditForm(existingTask)}>
        Edit Task
      </button>
    </>
  )
}
```

### Using TasksList

```typescript
import { TasksList } from '@/components/tasks/TasksList'

function MyPage({ tasks, orgId }: { tasks: Task[], orgId: string }) {
  return (
    <TasksList tasks={tasks} orgId={orgId} />
  )
}
```

### Using CreateTaskButton

```typescript
import { CreateTaskButton } from '@/components/tasks/CreateTaskButton'

function MyComponent() {
  return <CreateTaskButton />
}
```

---

## Complete Example

```typescript
// app/(app)/tasks/page.tsx
import { listTasks } from '@/lib/tasks'
import { requireUser } from '@/lib/auth'
import { requireSelectedOrg } from '@/lib/org'
import { TasksList } from '@/components/tasks/TasksList'
import { TaskFormProvider } from '@/components/tasks/TaskFormProvider'
import { CreateTaskButton } from '@/components/tasks/CreateTaskButton'
import { getOrgMembers } from '@/lib/org'

export default async function TasksPage() {
  // Ensure user is authenticated
  const user = await requireUser()
  
  // Ensure org is selected
  const { org, membership } = await requireSelectedOrg(user.id)
  
  // Fetch tasks
  const tasksResult = await listTasks(org.id)
  const tasks = tasksResult.success ? tasksResult.data : []
  
  // Fetch org members for assignment
  const members = await getOrgMembers(org.id)
  
  return (
    <TaskFormProvider orgId={org.id} members={members}>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Tasks</h1>
          <CreateTaskButton />
        </div>
        
        <TasksList tasks={tasks} orgId={org.id} />
      </div>
    </TaskFormProvider>
  )
}
```

---

## Error Handling

All server actions return an `ActionResult<T>` type:

```typescript
type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string }
```

**Always check the `success` field before accessing `data`:**

```typescript
const result = await createTask(input)

if (result.success) {
  // TypeScript knows result.data exists
  console.log('Created task:', result.data.id)
} else {
  // TypeScript knows result.error exists
  console.error('Error:', result.error)
}
```

**Common Errors:**
- `"Authentication required"` - User not logged in
- `"No organization selected"` - No org in cookie or parameter
- `"Not a member of the selected organization"` - User not in org
- `"Title is required"` - Empty title
- `"Title must be 500 characters or less"` - Title too long
- `"Description must be 5000 characters or less"` - Description too long
- `"Invalid status"` - Status not in enum
- `"Invalid priority"` - Priority not in enum
- `"Task not found"` - Task doesn't exist or wrong org
- `"Assigned user must be a member of the organization"` - Invalid assignee

---

## Type Definitions

```typescript
type TaskStatus = "todo" | "doing" | "done"
type TaskPriority = "low" | "medium" | "high"

type Task = {
  id: string
  org_id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: TaskPriority | null
  due_date: string | null  // ISO date string
  created_by: string
  assigned_to: string | null
  created_at: string  // ISO date string
  updated_at: string  // ISO date string
}

type CreateTaskInput = {
  title: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  due_date?: string  // ISO date string
  assigned_to?: string  // User UUID
}

type UpdateTaskInput = {
  title?: string
  description?: string | null
  status?: TaskStatus
  priority?: TaskPriority | null
  due_date?: string | null
  assigned_to?: string | null
}
```

---

## Security Notes

1. **Authentication**: All operations require authenticated user
2. **Authorization**: All operations verify org membership
3. **RLS**: Database enforces row-level security
4. **Input Validation**: Server validates all inputs
5. **Scoping**: All queries scoped to user's organization
6. **created_by**: Automatically set to current user on create

---

## Performance Tips

1. **Batch Operations**: Use `listTasks()` instead of multiple `getTask()` calls
2. **Caching**: Next.js caches server component data automatically
3. **Revalidation**: Paths are revalidated after mutations
4. **Optimistic Updates**: Use `router.refresh()` for immediate UI updates

---

## Testing

Run tests with:

```bash
npm run test        # Watch mode
npm run test:run    # Single run
npm run test:ui     # Interactive UI
```

**Test files:**
- `__tests__/lib/tasks.test.ts` - Unit tests (12 tests)
- `__tests__/lib/tasks-integration.test.ts` - Integration tests (17 tests)

---

## Troubleshooting

### "An unexpected response was received from the server"
- Check browser console for detailed error
- Verify Supabase connection
- Check RLS policies
- Ensure user is org member

### Task not appearing after creation
- Check if `revalidatePath()` is working
- Try `router.refresh()` manually
- Verify task was created in database

### Cannot assign task to user
- Verify user is member of organization
- Check user UUID is correct
- Verify `org_members` table has the membership

### Form validation errors
- Check field lengths (title max 500, description max 5000)
- Verify status/priority are valid enums
- Check due_date is valid ISO string

---

## Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)


