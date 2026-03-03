/**
 * RealBeadsBackend Integration Test
 * Tests actual bd CLI connectivity
 */

import { describe, it, expect } from 'vitest'
import { RealBeadsBackend } from '../real-beads-backend'

describe('RealBeadsBackend Integration', () => {
  // Use actual bd path for integration testing
  const backend = new RealBeadsBackend({
    bdPath: '/home/linuxbrew/.linuxbrew/bin/bd',
    repoPath: '.',
  })

  it('should pass health check', async () => {
    const health = await backend.healthCheck()
    expect(health.healthy).toBe(true)
    expect(health.version).toBeDefined()
    console.log('bd version:', health.version)
  })

  it('should connect to agent-town repository', async () => {
    // Run in agent-town directory which has .beads configured
    const repoBackend = new RealBeadsBackend({
      bdPath: '/home/linuxbrew/.linuxbrew/bin/bd',
      repoPath: '/home/clawdbot/clawd/repos/agent-town',
    })

    const health = await repoBackend.healthCheck()
    expect(health.healthy).toBe(true)
  })

  it('should get ready tasks from agent-town', async () => {
    const repoBackend = new RealBeadsBackend({
      bdPath: '/home/linuxbrew/.linuxbrew/bin/bd',
      repoPath: '/home/clawdbot/clawd/repos/agent-town',
    })

    const tasks = await repoBackend.getReadyTasks()
    console.log('Ready tasks:', tasks.length, tasks.map(t => t.id))
    // Should find AT-lgl or other ready issues
    expect(Array.isArray(tasks)).toBe(true)
  })

  it('should get all issues from agent-town', async () => {
    const repoBackend = new RealBeadsBackend({
      bdPath: '/home/linuxbrew/.linuxbrew/bin/bd',
      repoPath: '/home/clawdbot/clawd/repos/agent-town',
    })

    const issues = await repoBackend.getAllIssues()
    console.log('All issues:', issues.length, issues.map(i => i.id))
    expect(Array.isArray(issues)).toBe(true)
  })

  it('should parse issue IDs correctly', async () => {
    const repoBackend = new RealBeadsBackend({
      bdPath: '/home/linuxbrew/.linuxbrew/bin/bd',
      repoPath: '/home/clawdbot/clawd/repos/agent-town',
    })

    const issues = await repoBackend.getAllIssues()
    for (const issue of issues) {
      expect(issue.id).toMatch(/^[A-Z]{2}-\d+$/)
    }
  })

  it('should get agent status', async () => {
    const agents = await backend.getAgentStatus()
    expect(Array.isArray(agents)).toBe(true)
    expect(agents.length).toBeGreaterThan(0)
  })
})