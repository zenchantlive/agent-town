# Agent State Machine (AT-bp1) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. See: docs/plans/2026-02-21-agent-state-machine-implementation.md

**Goal:** Create a strict state machine for Agent Town agents using Node.js EventEmitter for state change events.

**Goal:** Create a strict state machine for Agent Town agents using Node.js EventEmitter for state change events.

**Architecture:** A `StateMachine` class that enforces valid transitions and emits events on state changes.

**Valid States:** `idle`, `working`, `moving`, `blocked`.
**Valid Transitions:** Pre-defined transitions between states with validation.

**Tech Stack:** TypeScript, Vitest, Node.js EventEmitter.

---

### Task 1: Setup Vitest test for StateMachine

**Files:**
- Modify: `src/lib/__tests__/agent-state-machine.test.ts`

**Step 1: Write failing test**

Create `src/lib/__tests__/agent-state-machine.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { StateMachine } from '../agent-state-machine'

describe('StateMachine', () => {
  it('should be defined', () => {
    const sm = new StateMachine('agent-1')
    expect(sm).toBeDefined()
    expect(sm.state).toBe('idle')
  })

  it('should enforce valid transitions', () => {
    const sm = new StateMachine('agent-1')
    // Invalid transition: blocked -> idle (can't go from blocked to idle directly)
    expect(() => sm.transition('idle')).toThrow()
  })

  it('should emit state change events', () => {
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
```

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL (StateMachine not defined)

**Step 3: Commit test stub**

```bash
git add src/lib/__tests__/agent-state-machine.test.ts
git commit -m "test: add failing test for StateMachine"
```

---

### Task 2: Implement StateMachine core

**Files:**
- Create: `src/lib/agent-state-machine.ts`

**Step 1: Write failing test**

Run: `npm test`
Expected: FAIL (StateMachine not defined)

**Step 2: Implement minimal StateMachine**

Create `src/lib/agent-state-machine.ts`:
```typescript
import { EventEmitter } from 'events'

export type State = 'idle' | 'working' | 'moving' | 'blocked'
export const VALID_STATES: State[] = ['idle', 'working', 'moving', 'blocked']

export interface StateTransition {
  from: State
  to: State
  agentId?: string
}

export class StateMachine extends EventEmitter {
  private _state: State = 'idle'
  readonly agentId: string

  constructor(agentId: string) {
    super()
    this.agentId = agentId
  }

  get state(): State {
    return this._state
  }

  set state(newState: State) {
    throw new Error('Use transition() method')
  }

  transition(newState: State): boolean {
    // Validate transition
    const valid = this.isValidTransition(newState)
    if (!valid) {
      throw new Error(`Invalid transition: ${this._state} -> ${newState}`)
    }

    const oldState = this._state
    this._state = newState
    
    this.emit('state-change', {
      agentId: this.agentId,
      from: oldState,
      to: newState
    })
    
    return true
  }

  private isValidTransition(newState: State): boolean {
    // Blocker can only transition to idle (unblocked)
    if (this._state === 'blocked' && newState !== 'idle') {
      return false
    }
    
    // Any state can transition to blocked
    if (newState === 'blocked') {
      return true
    }
    
    // Idle can transition to any state
    return true
  }
}
```

**Step 3: Run test to verify it passes**

Run: `npm test`
Expected: PASS

**Step 4: Commit implementation**

```bash
git add src/lib/agent-state-machine.ts
git commit -m "feat: implement StateMachine core with strict transitions"
```

---

### Task 3: Add state recovery method

**Files:**
- Modify: `src/lib/agent-state-machine.ts`
- Modify: `src/lib/__tests__/agent-state-machine.test.ts`

**Step 1: Write failing test**

Update `src/lib/__tests__/agent-state-machine.test.ts`:
```typescript
  it('should allow recovery from blocked to idle', () => {
    const sm = new StateMachine('agent-1')
    sm.transition('blocked')
    sm.transition('idle')
    expect(sm.state).toBe('idle')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL

**Step 3: Implement recovery method**

Update `src/lib/agent-state-machine.ts`:
```typescript
  // Inside StateMachine class:

  recover(): void {
    // Unblock agent from blocked state
    if (this._state === 'blocked') {
      this._state = 'idle'
      this.emit('state-change', {
        agentId: this.agentId,
        from: 'blocked',
        to: 'idle'
      })
    }
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

**Step 5: Commit implementation**

```bash
git add src/lib/agent-state-machine.ts src/lib/__tests__/agent-state-machine.test.ts
git commit -m "feat: add recover() method for blocked agents"
```
