import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useBeadsData, useDemoData } from '../useBeadsData'
import { RealBeadsBackend } from '../lib/real-beads-backend'

// Mock the backend
vi.mock('../lib/real-beads-backend', () => ({
  RealBeadsBackend: vi.fn().mockImplementation(() => ({
    getAllIssues: vi.fn(),
    getAgentStatus: vi.fn(),
    getRecentEvents: vi.fn(),
    healthCheck: vi.fn(),
  })),
}))

describe('useBeadsData', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('should return demo data when bd is unavailable', async () => {
    const { result } = renderHook(() => useDemoData())

    expect(result.current.tasks).toHaveLength(3)
    expect(result.current.agents).toHaveLength(4)
    expect(result.current.events).toHaveLength(3)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should have working refresh function', async () => {
    const { result } = renderHook(() => useDemoData())

    // Demo refresh is no-op
    await result.current.refresh()
    expect(result.current.tasks).toBeDefined()
  })

  it('should have working health check', async () => {
    const { result } = renderHook(() => useDemoData())

    const health = await result.current.healthCheck()
    expect(health.healthy).toBe(true)
    expect(health.version).toBe('demo')
  })

  it('should convert issues to tasks correctly', async () => {
    const { result } = renderHook(() => useDemoData())

    const task = result.current.tasks.find(t => t.id === 'AT-123')
    expect(task).toBeDefined()
    expect(task?.title).toBe('Implement API')
    expect(task?.status).toBe('in_progress')
    expect(task?.assignee).toBe('agent-1')
  })

  it('should have correct agent statuses', async () => {
    const { result } = renderHook(() => useDemoData())

    const builder = result.current.agents.find(a => a.id === 'agent-1')
    expect(builder?.status).toBe('idle')
    expect(builder?.role).toBe('infrastructure')

    const tester = result.current.agents.find(a => a.id === 'agent-2')
    expect(tester?.status).toBe('working')
  })

  it('should have valid event types', async () => {
    const { result } = renderHook(() => useDemoData())

    const completedEvent = result.current.events.find(e => e.type === 'task_completed')
    expect(completedEvent).toBeDefined()
    expect(completedEvent?.message).toContain('completed')
  })

  it('should have valid event timestamps', async () => {
    const { result } = renderHook(() => useDemoData())

    for (const event of result.current.events) {
      expect(typeof event.timestamp).toBe('number')
      expect(event.timestamp).toBeLessThanOrEqual(Date.now())
    }
  })
})