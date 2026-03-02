import { describe, it, expect } from 'vitest'
import { AIRuntime } from '../ai-runtime'

describe('AIRuntime', () => {
  it('should be defined', () => {
    const runtime = new AIRuntime()
    expect(runtime).toBeDefined()
  })

  it('should create a tool loop agent', () => {
    const runtime = new AIRuntime()
    const agent = runtime.createToolLoopAgent('test-agent', [])
    expect(agent).toBeDefined()
    expect(agent.version).toBe('agent-v1')
    expect(agent.tools).toEqual([])
  })
})
