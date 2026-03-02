# AI SDK Runtime Wrapper (AT-6j9) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a TypeScript wrapper for AI SDK v6 `ToolLoopAgent` to manage agent coordination and tool calling.

**Architecture:** A singleton-capable class `AIRuntime` that abstracts AI SDK calls and agent creation. Includes interfaces for agent configuration and state.

**Tech Stack:** AI SDK v6, TypeScript, Vitest (for TDD).

---

### Task 1: Setup Vitest for TDD

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

**Step 1: Write failing test**

Run: `npm test`
Expected: FAIL with "Missing script: 'test'"

**Step 2: Install Vitest**

Run: `npm install -D vitest @vitejs/plugin-react jsdom --legacy-peer-deps`
Expected: Build dependencies installed successfully.

**Step 3: Update package.json**

Add `"test": "vitest run"` to scripts.

**Step 4: Create vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
})
```

**Step 5: Run test to verify it passes**

Run: `npm test`
Expected: PASS (with "No test files found" message)

**Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.ts
git commit -m "chore: setup vitest for TDD"
```

---

### Task 2: Implement AIRuntime core

**Files:**
- Create: `src/lib/ai-runtime.ts`
- Test: `src/lib/__tests__/ai-runtime.test.ts`

**Step 1: Write the failing test**

Create `src/lib/__tests__/ai-runtime.test.ts`:
```typescript
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
    expect(agent.name).toBe('test-agent')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL (AIRuntime not defined)

**Step 3: Write minimal implementation**

Create `src/lib/ai-runtime.ts`:
```typescript
import { ToolLoopAgent } from 'ai'

export interface AgentConfig {
  name: string
  role: string
  personality: string
  modelId?: string
}

export class AIRuntime {
  createToolLoopAgent(name: string, tools: any[] = []) {
    return new ToolLoopAgent({
      name,
      tools,
    })
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/ai-runtime.ts src/lib/__tests__/ai-runtime.test.ts
git commit -m "feat: implement AIRuntime core"
```
