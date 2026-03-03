/**
 * useBeadsData Hook
 *
 * React hook that connects Agent Town to the real bd backend via API.
 * Handles fetching, caching, and refreshing tasks, agents, and events.
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { getDemoAgents, getDemoIssues, getDemoEvents, BeadsIssue, BeadsAgent, BeadsEvent } from '../lib/beads-types'
import { TaskItem } from '../components/TownCanvas/TownCanvas'
import { TownCrierEvent } from '../components/TownCrierFeed/TownCrierFeed'
import { AnimatedAgentData } from '../components/AnimatedAgent/AnimatedAgent'

interface UseBeadsDataOptions {
  refreshInterval?: number // ms
  autoRefresh?: boolean
  useRealBackend?: boolean
}

interface UseBeadsDataReturn {
  tasks: TaskItem[]
  agents: AnimatedAgentData[]
  events: TownCrierEvent[]
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
  healthCheck: () => Promise<{ healthy: boolean; version?: string }>
  lastUpdated: Date | null
}

const STATUS_MAP: Record<string, TaskItem['status']> = {
  ready: 'pending',
  in_progress: 'in_progress',
  done: 'done',
  blocked: 'pending',
}

export function useBeadsData(options: UseBeadsDataOptions = {}): UseBeadsDataReturn {
  const {
    refreshInterval = 30000,
    autoRefresh = false,
    useRealBackend = false,
  } = options

  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [agents, setAgents] = useState<AnimatedAgentData[]>([])
  const [events, setEvents] = useState<TownCrierEvent[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Convert issue to task
  const convertIssueToTask = useCallback((issue: any): TaskItem => {
    return {
      id: issue.id,
      title: issue.title,
      assignee: issue.assignee,
      status: STATUS_MAP[issue.status] || 'pending',
    }
  }, [])

  // Convert agent to animated
  const convertAgentToAnimated = useCallback((agent: any): AnimatedAgentData => {
    return {
      id: agent.id,
      name: agent.name,
      role: agent.role,
      status: agent.status || 'idle',
      x: 100 + Math.random() * 400,
      y: 100 + Math.random() * 400,
    }
  }, [])

  // Convert event
  const convertEventToCrier = useCallback((event: any): TownCrierEvent => {
    const typeMap: Record<string, TownCrierEvent['type']> = {
      task_completed: 'task_completed',
      task_started: 'task_started',
      approval_requested: 'approval_requested',
      approval_completed: 'approval_completed',
      status_changed: 'agent_status_changed',
      error: 'agent_error',
    }
    return {
      id: event.id || `evt-${Date.now()}`,
      type: typeMap[event.type] || 'system',
      message: event.message,
      timestamp: event.timestamp,
    }
  }, [])

  // Fetch from API
  const fetchFromAPI = useCallback(async () => {
    try {
      const response = await fetch('/api/beads?action=list')
      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setTasks(data.issues?.map(convertIssueToTask) || [])
      setError(null)
    } catch (err: any) {
      console.error('API fetch failed:', err)
      setError(err.message)
    }
  }, [convertIssueToTask])

  // Main refresh function
  const refresh = useCallback(async () => {
    setIsLoading(true)

    if (useRealBackend) {
      // Fetch from API
      await Promise.all([
        fetchFromAPI(),
      ])
      // Use demo agents/events for now (can be extended)
      const demoAgents = getDemoAgents()
      const demoEvents = getDemoEvents()
      setAgents(demoAgents.map(convertAgentToAnimated))
      setEvents(demoEvents.map(convertEventToCrier))
    } else {
      // Use demo data
      const demoIssues = getDemoIssues()
      const demoAgents = getDemoAgents()
      const demoEvents = getDemoEvents()

      setTasks(demoIssues.map(convertIssueToTask))
      setAgents(demoAgents.map(convertAgentToAnimated))
      setEvents(demoEvents.map(convertEventToCrier))
    }

    setLastUpdated(new Date())
    setIsLoading(false)
  }, [useRealBackend, fetchFromAPI, convertIssueToTask, convertAgentToAnimated, convertEventToCrier])

  // Initial fetch
  useEffect(() => {
    refresh()
  }, [refresh])

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh || !useRealBackend) return

    intervalRef.current = setInterval(refresh, refreshInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [refresh, autoRefresh, useRealBackend, refreshInterval])

  // Health check
  const healthCheck = useCallback(async () => {
    if (!useRealBackend) {
      return { healthy: true, version: 'demo' }
    }

    try {
      const response = await fetch('/api/beads?action=health')
      const data = await response.json()
      return data
    } catch {
      return { healthy: false }
    }
  }, [useRealBackend])

  return {
    tasks,
    agents,
    events,
    isLoading,
    error,
    refresh,
    healthCheck,
    lastUpdated,
  }
}

// Demo hook (always available)
export function useDemoData(): UseBeadsDataReturn {
  const demoIssues = getDemoIssues()
  const demoAgents = getDemoAgents()
  const demoEvents = getDemoEvents()

  const convertIssueToTask = (issue: any): TaskItem => ({
    id: issue.id,
    title: issue.title,
    assignee: issue.assignee,
    status: STATUS_MAP[issue.status] || 'pending',
  })

  const convertAgentToAnimated = (agent: any): AnimatedAgentData => ({
    id: agent.id,
    name: agent.name,
    role: agent.role,
    status: agent.status || 'idle',
    x: 100 + Math.random() * 400,
    y: 100 + Math.random() * 400,
  })

  const convertEventToCrier = (event: any): TownCrierEvent => ({
    id: event.id,
    type: 'task_completed' as const,
    message: event.message,
    timestamp: event.timestamp,
  })

  return {
    tasks: demoIssues.map(convertIssueToTask),
    agents: demoAgents.map(convertAgentToAnimated),
    events: demoEvents.map(convertEventToCrier),
    isLoading: false,
    error: null,
    refresh: async () => {},
    healthCheck: async () => ({ healthy: true, version: 'demo' }),
    lastUpdated: new Date(),
  }
}