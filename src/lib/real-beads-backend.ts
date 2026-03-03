/**
 * RealBeadsBackend - Connects Agent Town to the actual bd CLI
 *
 * This service bridges the UI components to the local Beads installation
 * for real task management, agent status, and event monitoring.
 */

import { exec, ExecOptions } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const BD_PATH = '/home/linuxbrew/.linuxbrew/bin/bd'

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

export class RealBeadsBackend {
  private config: BeadsConfig

  constructor(config?: Partial<BeadsConfig>) {
    this.config = {
      bdPath: config?.bdPath || BD_PATH,
      repoPath: config?.repoPath || '.',
      remote: config?.remote,
    }
  }

  /**
   * Execute a bd command and return the output
   */
  private async runBdCommand(args: string[], options?: ExecOptions): Promise<{ stdout: string; stderr: string }> {
    const fullArgs = this.config.remote
      ? ['--remote', this.config.remote, ...args]
      : args

    const command = `${this.config.bdPath} ${fullArgs.join(' ')}`

    try {
      const result = await execAsync(command, {
        cwd: this.config.repoPath,
        maxBuffer: 10 * 1024 * 1024, // 10MB
        ...options,
      })
      return result
    } catch (error: any) {
      // bd returns non-zero for "no results" which is often expected
      if (error.code === 1 || error.code === 2) {
        return { stdout: error.stdout || '', stderr: error.stderr || '' }
      }
      throw error
    }
  }

  /**
   * Get all ready tasks
   */
  async getReadyTasks(): Promise<BeadsIssue[]> {
    try {
      const { stdout } = await this.runBdCommand(['ready', '--format', 'json'])

      if (!stdout.trim()) {
        return []
      }

      const lines = stdout.trim().split('\n')
      return lines
        .filter(line => line.trim())
        .map((line) => this.parseIssueLine(line))
        .filter((issue): issue is BeadsIssue => issue !== null)
    } catch (error) {
      console.error('Failed to get ready tasks:', error)
      return []
    }
  }

  /**
   * Get all issues (tasks)
   */
  async getAllIssues(): Promise<BeadsIssue[]> {
    try {
      const { stdout } = await this.runBdCommand(['list', '--format', 'json'])

      if (!stdout.trim()) {
        return []
      }

      const lines = stdout.trim().split('\n')
      return lines
        .filter(line => line.trim())
        .map((line) => this.parseIssueLine(line))
        .filter((issue): issue is BeadsIssue => issue !== null)
    } catch (error) {
      console.error('Failed to get all issues:', error)
      return []
    }
  }

  /**
   * Get a specific issue by ID
   */
  async getIssue(id: string): Promise<BeadsIssue | null> {
    try {
      const { stdout } = await this.runBdCommand(['get', id, '--format', 'json'])

      if (!stdout.trim()) {
        return null
      }

      return this.parseIssueLine(stdout.trim())
    } catch (error) {
      console.error(`Failed to get issue ${id}:`, error)
      return null
    }
  }

  /**
   * Get the current agent status (from beadboard config or metadata)
   */
  async getAgentStatus(): Promise<BeadsAgent[]> {
    // For now, return demo agents that can be replaced with real data
    // In production, this would read from beadboard state
    return [
      {
        id: 'agent-local',
        name: 'Local Agent',
        role: 'automation',
        status: 'idle',
        lastActive: new Date().toISOString(),
      },
    ]
  }

  /**
   * Get recent events from the beads activity log
   */
  async getRecentEvents(limit: number = 20): Promise<BeadsEvent[]> {
    try {
      const { stdout } = await this.runBdCommand(['log', '--limit', String(limit)])

      if (!stdout.trim()) {
        return []
      }

      return this.parseEventLog(stdout)
    } catch (error) {
      console.error('Failed to get recent events:', error)
      return []
    }
  }

  /**
   * Start working on a task
   */
  async startTask(issueId: string): Promise<boolean> {
    try {
      await this.runBdCommand(['start', issueId])
      return true
    } catch (error) {
      console.error(`Failed to start task ${issueId}:`, error)
      return false
    }
  }

  /**
   * Complete a task
   */
  async completeTask(issueId: string): Promise<boolean> {
    try {
      await this.runBdCommand(['done', issueId])
      return true
    } catch (error) {
      console.error(`Failed to complete task ${issueId}:`, error)
      return false
    }
  }

  /**
   * Create a new issue
   */
  async createIssue(title: string, priority: string = 'P2'): Promise<BeadsIssue | null> {
    try {
      const { stdout } = await this.runBdCommand(['create', title, '--priority', priority])

      // Parse the created issue ID from output
      const match = stdout.match(/([A-Z]{2}-\d+)/)
      if (match) {
        return this.getIssue(match[1])
      }
      return null
    } catch (error) {
      console.error('Failed to create issue:', error)
      return null
    }
  }

  /**
   * Parse a bd list line into an Issue object
   * Format: ○ AT-123 ● P0 Some title here
   */
  private parseIssueLine(line: string): BeadsIssue | null {
    // Strip ANSI codes
    const cleanLine = line.replace(/\x1b\[[0-9;]*m/g, '')

    // Match pattern: [status] [id] ● [priority] [title]
    // Status can be ○ (ready), ● (in_progress), ◎ (blocked)
    const match = cleanLine.match(/([○●◎])\s*([A-Z]{2}-\w+)\s*[●]\s*(P[0-4])\s*(.+)/)

    if (!match) {
      // Try simpler format
      const simpleMatch = cleanLine.match(/([A-Z]{2}-\w+)\s*[●]\s*(P[0-4])\s*(.+)/)
      if (simpleMatch) {
        return {
          id: simpleMatch[1],
          title: simpleMatch[3].trim(),
          status: 'ready',
          priority: simpleMatch[2] as BeadsIssue['priority'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      }
      return null
    }

    const statusMap: Record<string, BeadsIssue['status']> = {
      '○': 'ready',
      '●': 'in_progress',
      '◎': 'blocked',
    }

    return {
      id: match[2],
      title: match[4].trim(),
      status: statusMap[match[1]] || 'ready',
      priority: match[3] as BeadsIssue['priority'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

  /**
   * Parse bd log output into events
   */
  private parseEventLog(logOutput: string): BeadsEvent[] {
    const lines = logOutput.trim().split('\n')
    const events: BeadsEvent[] = []

    for (const line of lines) {
      // Parse common log formats
      // Format: "2026-03-01 22:30:45 agent-1 completed AT-123"
      const match = line.match(/(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s+(\S+)\s+(\S+)\s+(.+)/)

      if (match) {
        const typeMap: Record<string, BeadsEvent['type']> = {
          'completed': 'task_completed',
          'started': 'task_started',
          'created': 'task_created',
          'status': 'status_changed',
          'approved': 'approval_completed',
          'error': 'error',
        }

        const eventType = typeMap[match[3].toLowerCase()] || 'task_created'

        events.push({
          id: `evt-${Date.now()}-${events.length}`,
          type: eventType,
          message: `${match[4]} (${match[3]})`,
          timestamp: new Date(match[1]).getTime(),
          agentId: match[2],
        })
      }
    }

    return events
  }

  /**
   * Check if the backend is healthy and can connect to bd
   */
  async healthCheck(): Promise<{ healthy: boolean; version?: string; error?: string }> {
    try {
      const { stdout } = await this.runBdCommand(['--version'])
      const versionMatch = stdout.match(/bd version (\d+\.\d+\.\d+)/)
      return {
        healthy: true,
        version: versionMatch ? versionMatch[1] : 'unknown',
      }
    } catch (error: any) {
      return {
        healthy: false,
        error: error.message,
      }
    }
  }
}

// Export singleton instance
export const beadsBackend = new RealBeadsBackend()