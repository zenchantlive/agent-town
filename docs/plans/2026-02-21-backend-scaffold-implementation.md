# Backend Scaffold (AI SDK runtime + agent loop) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Initialize backend runtime with AI SDK v6 ToolLoopAgent wrapper and basic agent state machine for Mayor + 6 role agents.

**Architecture:** Node.js backend with AI SDK v6, agent runtime using ToolLoopAgent pattern, WebSocket events for frontend sync, Beads adapter for task intake and status updates.

**Tech Stack:** Node.js, AI SDK v6 (`ai` package), WebSocket (ws or Socket.io), Beads CLI (bd), SQLite (for agent/task state persistence).

---

### Task 1: Initialize Next.js project structure

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.mjs`

**Step 1: Write failing test for project structure**

```bash
test: [ -f "package.json" -a -f "tsconfig.json" -a -f "next.config.mjs" ]
```

**Step 2: Run test to verify it fails**

Run: `ls package.json tsconfig.json next.config.mjs`  
Expected: FAIL with "No such file or directory"

**Step 3: Write minimal implementation**

```bash
mkdir -p src/app api/lib
npm init -y
npm install ai typescript tsx next@latest ws@latest
```

Create `package.json`:
```json
{
  "name": "agent-town-backend",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "ai": "latest",
    "next": "latest",
    "ws": "latest"
  }
}
```

Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "strict": true,
    "outDir": "./dist"
  }
}
```

Create `next.config.mjs`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {}

export default nextConfig
```

**Step 4: Run test to verify it passes**

Run: `ls package.json tsconfig.json next.config.mjs`  
Expected: PASS

**Step 5: Commit**

```bash
git add package.json tsconfig.json next.config.mjs
git commit -m "feat: initialize Next.js project structure with AI SDK"
```

---

### Task 2: Create AI SDK runtime wrapper

**Files:**
- Create: `src/lib/ai-runtime.ts`
- Test: `src/lib/__tests__/ai-runtime.test.ts`

**Step 1: Write failing test for AI runtime**

```typescript
import { generateText } from 'ai'

test('ai-runtime exists', async () => {
  const result = await generateText('test')
  expect(result).toBeDefined()
})
```

**Step 2: Run test to verify it fails**

Run: `npx tsx src/lib/__tests__/ai-runtime.test.ts`  
Expected: FAIL with "Cannot find module 'ai'"

**Step 3: Write minimal implementation**

```typescript
// src/lib/ai-runtime.ts
import { generateText, streamText, ToolLoopAgent } from 'ai'

export interface AgentConfig {
  name: string
  role: string
  personality: string
  modelId?: string
}

export interface AgentState {
  id: string
  status: 'idle' | 'working' | 'blocked' | 'completed'
  currentTask?: string
  location: 'plaza' | 'office' | 'chat'
}

export class AIRuntime {
  async runAgentPrompt(prompt: string, config: AgentConfig): Promise<string> {
    return await generateText(prompt, {
      model: config.modelId,
    })
  }

  async streamAgentPrompt(prompt: string, config: AgentConfig): Promise<AsyncIterable<string>> {
    return streamText(prompt, {
      model: config.modelId,
    })
  }

  createToolLoopAgent(name: string, tools: any[]) {
    return new ToolLoopAgent({
      name,
      tools,
    })
  }
}
```

Create `src/lib/__tests__/ai-runtime.test.ts`:
```typescript
import { AIRuntime } from '../ai-runtime'

describe('AIRuntime', () => {
  it('should generate text', async () => {
    const runtime = new AIRuntime()
    const result = await runtime.runAgentPrompt('test prompt', {
      name: 'test',
      role: 'architect',
      personality: 'witty',
    })
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
  })
})
```

**Step 4: Run test to verify it passes**

Run: `npx tsx src/lib/__tests__/ai-runtime.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/
git commit -m "feat: add AI SDK runtime wrapper"
```

---

### Task 3: Implement agent state machine

**Files:**
- Create: `src/lib/agent-state-machine.ts`
- Test: `src/lib/__tests__/agent-state-machine.test.ts`

**Step 1: Write failing test for state transitions**

```typescript
test('agent state transitions', () => {
  const agent = createAgent('test', 'architect')
  expect(agent.status).toBe('idle')
  agent.setState('working')
  expect(agent.status).toBe('working')
})
```

**Step 2: Run test to verify it fails**

Run: `npx tsx src/lib/__tests__/agent-state-machine.test.ts`  
Expected: FAIL with "createAgent is not defined"

**Step 3: Write minimal implementation**

```typescript
// src/lib/agent-state-machine.ts
import { EventEmitter } from 'events'

export type AgentStatus = 'idle' | 'working' | 'blocked' | 'completed'

export interface AgentEvents {
  'status-change': { agentId: string, oldStatus: AgentStatus, newStatus: AgentStatus }
  'location-change': { agentId: string, from: string, to: string }
  'task-assigned': { agentId: string, taskId: string }
}

export class AgentStateMachine extends EventEmitter {
  private agents: Map<string, Agent> = new Map()

  createAgent(id: string, config: { name: string, role: string, personality: string }): Agent {
    const agent: Agent = {
      id,
      name: config.name,
      role: config.role,
      personality: config.personality,
      status: 'idle',
      location: 'plaza',
      currentTask: undefined,
    }
    this.agents.set(id, agent)
    return agent
  }

  getAgent(id: string): Agent | undefined {
    return this.agents.get(id)
  }

  setState(agentId: string, newStatus: AgentStatus): void {
    const agent = this.agents.get(agentId)
    if (!agent) throw new Error(`Agent ${agentId} not found`)
    
    const oldStatus = agent.status
    agent.status = newStatus
    this.emit('status-change', { agentId, oldStatus, newStatus })
  }

  setLocation(agentId: string, location: 'plaza' | 'office' | 'chat'): void {
    const agent = this.agents.get(agentId)
    if (!agent) throw new Error(`Agent ${agentId} not found`)
    
    const from = agent.location
    agent.location = location
    this.emit('location-change', { agentId, from, to: location })
  }

  assignTask(agentId: string, taskId: string): void {
    const agent = this.agents.get(agentId)
    if (!agent) throw new Error(`Agent ${agentId} not found`)
    
    agent.currentTask = taskId
    this.setState(agentId, 'working')
    this.emit('task-assigned', { agentId, taskId })
  }

  getAllAgents(): Agent[] {
    return Array.from(this.agents.values())
  }
}

export interface Agent {
  id: string
  name: string
  role: string
  personality: string
  status: AgentStatus
  location: 'plaza' | 'office' | 'chat'
  currentTask?: string
}
```

Create `src/lib/__tests__/agent-state-machine.test.ts`:
```typescript
import { AgentStateMachine } from '../agent-state-machine'

describe('AgentStateMachine', () => {
  let sm: AgentStateMachine

  beforeEach(() => {
    sm = new AgentStateMachine()
  })

  it('should create agent with idle status', () => {
    const agent = sm.createAgent('test-1', {
      name: 'Alice',
      role: 'architect',
      personality: 'witty and precise',
    })
    expect(agent.status).toBe('idle')
    expect(agent.name).toBe('Alice')
  })

  it('should transition status', () => {
    const agent = sm.createAgent('test-2', {
      name: 'Bob',
      role: 'builder',
      personality: 'friendly and diligent',
    })
    
    sm.setState('test-2', 'working')
    expect(agent.status).toBe('working')
  })

  it('should change location', () => {
    const agent = sm.createAgent('test-3', {
      name: 'Charlie',
      role: 'critic',
      personality: 'sharp and honest',
    })
    
    sm.setLocation('test-3', 'office')
    expect(agent.location).toBe('office')
  })

  it('should assign task', () => {
    const agent = sm.createAgent('test-4', {
      name: 'Diana',
      role: 'builder',
      personality: 'calm and methodical',
    })
    
    sm.assignTask('test-4', 'task-123')
    expect(agent.status).toBe('working')
    expect(agent.currentTask).toBe('task-123')
  })
})
```

**Step 4: Run tests to verify they pass**

Run: `npx tsx src/lib/__tests__/agent-state-machine.test.ts`  
Expected: All PASS

**Step 5: Commit**

```bash
git add src/lib/
git commit -m "feat: implement agent state machine with events"
```

---

### Task 4: Create WebSocket server for frontend sync

**Files:**
- Create: `src/app/api/ws/route.ts`
- Test: `src/app/api/ws/__tests__/route.test.ts`

**Step 1: Write failing test for WebSocket server**

```typescript
test('websocket server starts', async () => {
  const wsServer = createWebSocketServer(3001)
  expect(wsServer.listening).toBe(true)
  wsServer.close()
})
```

**Step 2: Run test to verify it fails**

Run: `npx tsx src/app/api/ws/__tests__/route.test.ts`  
Expected: FAIL with "createWebSocketServer is not defined"

**Step 3: Write minimal implementation**

```typescript
// src/app/api/ws/route.ts
import { WebSocketServer, WebSocket } from 'ws'
import { AgentStateMachine, AgentEvents } from '../../../lib/agent-state-machine'

export function createWebSocketServer(port: number): WebSocketServer {
  const wss = new WebSocketServer({ port })
  const agentSM = new AgentStateMachine()

  wss.on('connection', (ws: WebSocket) => {
    console.log('Frontend connected')

    // Send initial state
    ws.send(JSON.stringify({
      type: 'init',
      agents: agentSM.getAllAgents(),
    }))

    // Listen for agent events
    agentSM.on('status-change', (data) => {
      ws.send(JSON.stringify({
        type: 'agent-status-change',
        data,
      }))
    })

    agentSM.on('location-change', (data) => {
      ws.send(JSON.stringify({
        type: 'agent-location-change',
        data,
      }))
    })

    agentSM.on('task-assigned', (data) => {
      ws.send(JSON.stringify({
        type: 'task-assigned',
        data,
      }))
    })

    // Handle frontend commands
    ws.on('message', (message: string) => {
      try {
        const command = JSON.parse(message)
        handleFrontendCommand(command, agentSM, ws)
      } catch (error) {
        ws.send(JSON.stringify({
          type: 'error',
          message: 'Invalid JSON',
        }))
      }
    })
  })

  return wss
}

function handleFrontendCommand(
  command: any,
  agentSM: AgentStateMachine,
  ws: WebSocket,
): void {
  switch (command.type) {
    case 'agent-click':
      const agent = agentSM.getAgent(command.agentId)
      if (agent) {
        ws.send(JSON.stringify({
          type: 'agent-details',
          data: agent,
        }))
      }
      break

    case 'toggle-panel':
      // Handle panel toggle logic
      ws.send(JSON.stringify({
        type: 'panel-state',
        panel: command.panel,
        visible: !command.visible,
      }))
      break

    default:
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Unknown command',
      }))
  }
}
```

Create `src/app/api/ws/__tests__/route.test.ts`:
```typescript
import { createWebSocketServer } from '../route'

describe('WebSocket server', () => {
  it('should start and accept connections', (done) => {
    const wss = createWebSocketServer(3001)
    expect(wss.listening).toBe(true)
    
    // Cleanup
    wss.close(() => {
      done()
    })
  })
})
```

**Step 4: Run test to verify it passes**

Run: `npx tsx src/app/api/ws/__tests__/route.test.ts`  
Expected: PASS

**Step 5: Commit**

```bash
git add src/app/api/ws/
git commit -m "feat: add WebSocket server for frontend sync"
```

---

### Task 5: Add AI Gateway provider configuration

**Files:**
- Modify: `.env.local` or environment variables

**Step 1: Verify AI Gateway provider is configured**

Run: `cat .env.local | grep AI_GATEWAY`  
Expected: Found or set placeholder

**Step 2: Create environment configuration file**

Create `.env.local`:
```
AI_GATEWAY_PROVIDER=ai-gateway
AI_GATEWAY_API_KEY=your-api-key-here
WS_PORT=3001
```

**Step 3: Commit (do not commit actual API key)**

```bash
git add .env.local.example
git commit -m "feat: add environment configuration template"
```

---

## Summary

This plan initializes the backend scaffold with AI SDK v6 integration, agent state machine, and WebSocket server. Following TDD ensures each component is tested before moving forward. Frequent commits keep changes atomic.

---

## Execution Handoff

**Plan complete and saved to `docs/plans/2026-02-21-backend-scaffold-implementation.md`.**

Two execution options:

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

Which approach?
