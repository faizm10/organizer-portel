import { describe, it, expect, vi, beforeEach } from 'vitest'
import { listTasks, getTask, updateTask, deleteTask } from '@/lib/tasks'
import type { Task, UpdateTaskInput } from '@/lib/tasks'

// Mock dependencies
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

vi.mock('@/lib/org', () => ({
  getSelectedOrgIdFromCookie: vi.fn(),
  getUserOrganizations: vi.fn(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// Mock data
const mockUserId = 'user-123'
const mockOrgId = 'org-123'
const mockTaskId = 'task-123'

const mockTask: Task = {
  id: mockTaskId,
  org_id: mockOrgId,
  title: 'Test Task',
  description: 'Test Description',
  status: 'todo',
  priority: 'medium',
  due_date: null,
  created_by: mockUserId,
  assigned_to: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

describe('Tasks CRUD Operations', () => {
  let mockSupabaseClient: any

  beforeEach(async () => {
    vi.clearAllMocks()
    
    // Create a proper mock query builder chain
    const createQueryBuilder = (returnData: any, returnError: any = null) => {
      const builder = {
        select: vi.fn(() => builder),
        insert: vi.fn(() => builder),
        update: vi.fn(() => builder),
        delete: vi.fn(() => builder),
        eq: vi.fn(() => builder),
        order: vi.fn(() => ({
          data: Array.isArray(returnData) ? returnData : [returnData],
          error: returnError,
        })),
        single: vi.fn(() => ({
          data: returnData,
          error: returnError,
        })),
        limit: vi.fn(() => ({
          data: Array.isArray(returnData) ? returnData : [returnData],
          error: returnError,
        })),
      }
      return builder
    }
    
    // Setup default mocks
    const { createClient } = await import('@/lib/supabase/server')
    
    mockSupabaseClient = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: mockUserId, email: 'test@example.com' } },
          error: null,
        }),
      },
      from: vi.fn((table: string) => {
        if (table === 'tasks') {
          // For tasks, return a query builder that can handle different operations
          return createQueryBuilder(mockTask, null)
        }
        if (table === 'org_members') {
          // For org_members, return data indicating membership
          return createQueryBuilder([{ org_id: mockOrgId }], null)
        }
        return createQueryBuilder(null, null)
      }),
    }
    
    vi.mocked(createClient).mockResolvedValue(mockSupabaseClient as any)

    const { getSelectedOrgIdFromCookie, getUserOrganizations } = await import('@/lib/org')
    vi.mocked(getSelectedOrgIdFromCookie).mockResolvedValue(mockOrgId)
    vi.mocked(getUserOrganizations).mockResolvedValue([
      {
        org_id: mockOrgId,
        role: 'lead',
        organization: { id: mockOrgId, name: 'Test Org', slug: 'test-org' },
      },
    ])
  })

  // Note: createTask tests removed as create functionality has been disabled

  describe('listTasks', () => {
    it('should list tasks successfully', async () => {
      // Mock the query chain for listTasks
      const tasksQueryBuilder = {
        select: vi.fn(() => tasksQueryBuilder),
        eq: vi.fn(() => tasksQueryBuilder),
        order: vi.fn(() => ({
          data: [mockTask],
          error: null,
        })),
      }
      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'tasks') return tasksQueryBuilder
        if (table === 'org_members') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                eq: vi.fn(() => ({
                  limit: vi.fn(() => ({
                    data: [{ org_id: mockOrgId }],
                    error: null,
                  })),
                })),
              })),
            })),
          }
        }
        return tasksQueryBuilder
      })

      const result = await listTasks(mockOrgId)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(Array.isArray(result.data)).toBe(true)
      }
    })

    it('should fail when not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const result = await listTasks(mockOrgId)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toContain('Authentication required')
      }
    })
  })

  describe('getTask', () => {
    it('should get a task successfully', async () => {
      // Mock the query chain for getTask
      const taskQueryBuilder = {
        select: vi.fn(() => taskQueryBuilder),
        eq: vi.fn(() => taskQueryBuilder),
        single: vi.fn(() => ({
          data: mockTask,
          error: null,
        })),
      }
      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'tasks') return taskQueryBuilder
        if (table === 'org_members') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                eq: vi.fn(() => ({
                  limit: vi.fn(() => ({
                    data: [{ org_id: mockOrgId }],
                    error: null,
                  })),
                })),
              })),
            })),
          }
        }
        return taskQueryBuilder
      })

      const result = await getTask(mockTaskId, mockOrgId)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.id).toBe(mockTaskId)
        expect(result.data.title).toBe('Test Task')
      }
    })

    it('should fail when task is not found', async () => {
      // Mock the query chain to return not found
      const taskQueryBuilder = {
        select: vi.fn(() => taskQueryBuilder),
        eq: vi.fn(() => taskQueryBuilder),
        single: vi.fn(() => ({
          data: null,
          error: { code: 'PGRST116', message: 'Not found' },
        })),
      }
      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'tasks') return taskQueryBuilder
        if (table === 'org_members') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                eq: vi.fn(() => ({
                  limit: vi.fn(() => ({
                    data: [{ org_id: mockOrgId }],
                    error: null,
                  })),
                })),
              })),
            })),
          }
        }
        return taskQueryBuilder
      })

      const result = await getTask('non-existent', mockOrgId)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toContain('Task not found')
      }
    })
  })

  describe('updateTask', () => {
    it('should update a task successfully', async () => {
      // Mock the query chain for updateTask
      const updateQueryBuilder = {
        update: vi.fn(() => updateQueryBuilder),
        eq: vi.fn(() => updateQueryBuilder),
        select: vi.fn(() => ({
          single: vi.fn(() => ({
            data: { ...mockTask, title: 'Updated Task' },
            error: null,
          })),
        })),
      }
      const getTaskQueryBuilder = {
        select: vi.fn(() => getTaskQueryBuilder),
        eq: vi.fn(() => getTaskQueryBuilder),
        single: vi.fn(() => ({
          data: mockTask,
          error: null,
        })),
      }
      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'tasks') {
          // First call is for getTask, second is for update
          let callCount = 0
          return {
            select: vi.fn(() => {
              callCount++
              if (callCount === 1) return getTaskQueryBuilder
              return updateQueryBuilder
            }),
            update: vi.fn(() => updateQueryBuilder),
            eq: vi.fn(() => getTaskQueryBuilder),
          }
        }
        if (table === 'org_members') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                eq: vi.fn(() => ({
                  limit: vi.fn(() => ({
                    data: [{ org_id: mockOrgId }],
                    error: null,
                  })),
                })),
              })),
            })),
          }
        }
        return updateQueryBuilder
      })

      const input: UpdateTaskInput = {
        title: 'Updated Task',
        status: 'doing',
      }

      const result = await updateTask(mockTaskId, input, mockOrgId)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBeDefined()
      }
    })

    it('should fail when title is empty', async () => {
      // Mock getTask to succeed first
      const getTaskQueryBuilder = {
        select: vi.fn(() => getTaskQueryBuilder),
        eq: vi.fn(() => getTaskQueryBuilder),
        single: vi.fn(() => ({
          data: mockTask,
          error: null,
        })),
      }
      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'tasks') return getTaskQueryBuilder
        if (table === 'org_members') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                eq: vi.fn(() => ({
                  limit: vi.fn(() => ({
                    data: [{ org_id: mockOrgId }],
                    error: null,
                  })),
                })),
              })),
            })),
          }
        }
        return getTaskQueryBuilder
      })

      const input: UpdateTaskInput = {
        title: '',
      }

      const result = await updateTask(mockTaskId, input, mockOrgId)

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error).toContain('Title cannot be empty')
      }
    })
  })

  describe('deleteTask', () => {
    it('should delete a task successfully', async () => {
      // Mock the query chain for deleteTask
      const getTaskQueryBuilder = {
        select: vi.fn(() => getTaskQueryBuilder),
        eq: vi.fn(() => getTaskQueryBuilder),
        single: vi.fn(() => ({
          data: mockTask,
          error: null,
        })),
      }
      
      // Create a proper delete chain that returns error: null
      const deleteChain = {
        eq: vi.fn((field: string, value: any) => ({
          eq: vi.fn(() => ({
            error: null,
          })),
        })),
      }
      const deleteQueryBuilder = {
        delete: vi.fn(() => deleteChain),
      }
      
      mockSupabaseClient.from = vi.fn((table: string) => {
        if (table === 'tasks') {
          let callCount = 0
          return {
            select: vi.fn(() => {
              callCount++
              if (callCount === 1) return getTaskQueryBuilder
              return deleteQueryBuilder
            }),
            delete: vi.fn(() => deleteChain),
            eq: vi.fn(() => {
              if (callCount === 1) return getTaskQueryBuilder
              return deleteQueryBuilder
            }),
          }
        }
        if (table === 'org_members') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                eq: vi.fn(() => ({
                  limit: vi.fn(() => ({
                    data: [{ org_id: mockOrgId }],
                    error: null,
                  })),
                })),
              })),
            })),
          }
        }
        return deleteQueryBuilder
      })

      const result = await deleteTask(mockTaskId, mockOrgId)

      expect(result.success).toBe(true)
    })
  })
})
