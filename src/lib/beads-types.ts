/**
 * RealBeadsBackend - Server-side only
 *
 * This module should only be imported in server-side contexts.
 * For client-side use, go through the API routes.
 */

export interface BeadsConfig {
  bdPath?: string
  repoPath?: string
  remote?: string
}

export interface BeadsIssue {
  id: string
  title: string
  status: 'ready' | 'in_progress' | 'done' | 'blocked'
  priority: 'P0' | 'P1' | 'P2' | 'P3' | 'P4'
  assignee?: string
  createdAt: string
  updatedAt: string
}

export interface BeadsAgent {
  id: string
  name: string
  role: string
  status: 'idle' | 'working' | 'thinking' | 'error'
  currentTask?: string
  lastActive: string
}

export interface BeadsEvent {
  id: string
  type: 'task_created' | 'task_started' | 'task_completed' | 'status_changed' | 'approval_requested' | 'approval_completed' | 'error'
  message: string
  timestamp: number
  agentId?: string
  taskId?: string
}

// Simple demo agents (no backend needed)
export function getDemoAgents(): BeadsAgent[] {
  return [
    {
      id: 'agent-1',
      name: 'Builder',
      role: 'infrastructure',
      status: 'idle',
      lastActive: new Date().toISOString(),
    },
    {
      id: 'agent-2',
      name: 'Tester',
      role: 'qa',
      status: 'working',
      currentTask: 'AT-123',
      lastActive: new Date().toISOString(),
    },
    {
      id: 'agent-3',
      name: 'Architect',
      role: 'design',
      status: 'thinking',
      lastActive: new Date().toISOString(),
    },
    {
      id: 'agent-4',
      name: 'DevOps',
      role: 'devops',
      status: 'idle',
      lastActive: new Date().toISOString(),
    },
  ]
}

// Demo issues (when bd is unavailable)
export function getDemoIssues(): BeadsIssue[] {
  return [
    {
      id: 'AT-123',
      title: 'Implement API',
      status: 'in_progress',
      priority: 'P0',
      assignee: 'agent-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'AT-124',
      title: 'Write Tests',
      status: 'ready',
      priority: 'P1',
      assignee: 'agent-2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'AT-125',
      title: 'Design UI',
      status: 'done',
      priority: 'P2',
      assignee: 'agent-3',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]
}

// Demo events
export function getDemoEvents(): BeadsEvent[] {
  const now = Date.now()
  return [
    {
      id: 'evt-1',
      type: 'task_completed',
      message: 'Builder completed Implement API',
      timestamp: now - 1000,
      agentId: 'agent-1',
    },
    {
      id: 'evt-2',
      type: 'approval_requested',
      message: 'Tester requested approval for Deploy to prod',
      timestamp: now - 5000,
      agentId: 'agent-2',
    },
    {
      id: 'evt-3',
      type: 'status_changed',
      message: 'Architect is now thinking',
      timestamp: now - 10000,
      agentId: 'agent-3',
    },
  ]
}