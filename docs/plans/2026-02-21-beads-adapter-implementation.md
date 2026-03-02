# Beads Adapter (AT-dy9) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a TypeScript class `BeadsAdapter` that wraps the `bd` CLI to fetch, create, and update beads.

**Architecture:** A stateless utility class that uses `execSync` (or `promisify(exec)`) to communicate with the `bd` CLI and parse its output.

**Tech Stack:** Node.js `child_process`, TypeScript, Vitest.

---

### Task 1: Create BeadsAdapter base and listReady

**Files:**
- Create: `src/lib/beads-adapter.ts`
- Test: `src/lib/__tests__/beads-adapter.test.ts`

**Step 1: Write the failing test**

Create `src/lib/__tests__/beads-adapter.test.ts`:
```typescript
import { describe, it, expect, vi } from 'vitest'
import { BeadsAdapter } from '../beads-adapter'

describe('BeadsAdapter', () => {
  it('should list ready issues', async () => {
    const adapter = new BeadsAdapter('/mock/path')
    // Mocking the CLI output is Task 2, Task 1 is just the interface
    expect(adapter.listReady).toBeDefined()
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL (BeadsAdapter not defined)

**Step 3: Write minimal implementation**

Create `src/lib/beads-adapter.ts`:
```typescript
export class BeadsAdapter {
  constructor(private repoPath: string) {}

  async listReady(): Promise<any[]> {
    return []
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/beads-adapter.ts src/lib/__tests__/beads-adapter.test.ts
git commit -m "feat: add BeadsAdapter base and listReady stub"
```

---

### Task 2: Implement CLI execution and parsing

**Files:**
- Modify: `src/lib/beads-adapter.ts`
- Modify: `src/lib/__tests__/beads-adapter.test.ts`

**Step 1: Write the failing test (with mock)**

Update `src/lib/__tests__/beads-adapter.test.ts`:
```typescript
import { exec } from 'child_process'

vi.mock('util', async () => {
  return {
    promisify: () => vi.fn().mockResolvedValue({ stdout: '○ AT-123 ● P0 Test Issue\n' })
  }
})

describe('BeadsAdapter parsing', () => {
  it('should parse bd ready output', async () => {
    const adapter = new BeadsAdapter('.')
    const issues = await adapter.listReady()
    expect(issues).toHaveLength(1)
    expect(issues[0].id).toBe('AT-123')
  })
})
```

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL (issues length 0)

**Step 3: Write implementation**

```typescript
import { exec as execCallback } from 'child_process'
import { promisify } from 'util'

const exec = promisify(execCallback)

export class BeadsAdapter {
  constructor(private repoPath: string) {}

  async listReady(): Promise<any[]> {
    try {
      const { stdout } = await exec('bd ready', { cwd: this.repoPath })
      return this.parseIssuesOutput(stdout)
    } catch (error) {
      return []
    }
  }

  private parseIssuesOutput(output: string): any[] {
    const lines = output.split('\n')
    const issues: any[] = []
    for (const line of lines) {
      const match = line.match(/([A-Z]{2}-\w+)\s*[●○]\s*[P0-4]\s*(.+)/)
      if (match) {
        issues.push({ id: match[1], title: match[2].trim() })
      }
    }
    return issues
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS

**Step 5: Commit**

```bash
git add src/lib/beads-adapter.ts src/lib/__tests__/beads-adapter.test.ts
git commit -m "feat: implement bd ready parsing in BeadsAdapter"
```
