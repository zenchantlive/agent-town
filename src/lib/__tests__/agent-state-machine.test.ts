import { describe, it, expect, vi } from 'vitest'

describe('StateMachine', async () => {
  it('should be defined', async () => {
    const { StateMachine } = await import('../agent-state-machine')
    const sm = new StateMachine('agent-1')
    expect(sm).toBeDefined()
    expect(sm.state).toBe('idle')
  })

  it('should enforce valid transitions', async () => {
    const { StateMachine } = await import('../agent-state-machine')
    const sm = new StateMachine('agent-1')
    // Invalid transition: blocked -> idle (can't go from blocked to idle directly)
    expect(() => sm.transition('idle')).toThrow()
  })

  it('should emit state change events', async () => {
    const { StateMachine } = await import('../agent-state-machine')
    const sm = new StateMachine('agent-1')
    const listener = vi.fn()
    sm.on('state-change', listener)
    
    sm.transition('working')
    expect(listener).toHaveBeenCalledWith({
      from: 'idle',
      to: 'working',
      agentId: 'agent-1'
    })
  })
})

describe('StateMachine Recovery', async () => {
  it('should allow recovery from blocked to idle', async () => {
    const { StateMachine } = await import('../agent-state-machine')
    const sm = new StateMachine('agent-1')
    sm.transition('blocked')
    sm.recover()
    expect(sm.state).toBe('idle')
  })
})
