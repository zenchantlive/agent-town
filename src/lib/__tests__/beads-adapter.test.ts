import { describe, it, expect, vi } from 'vitest'
import { BeadsAdapter } from '../beads-adapter'

describe('BeadsAdapter', () => {
  it('should list ready issues', async () => {
    const adapter = new BeadsAdapter('/mock/path')
    expect(adapter.listReady).toBeDefined()
  })

  it('should parse bd ready output', async () => {
    // Inject mock exec with ANSI escape codes (actual bd output format)
    const mockExec = vi.fn().mockResolvedValue({ stdout: '\x1b[7m0\x1b[27m AT-123 ● P0 Test Issue\n' })
    const adapter = new BeadsAdapter('.', mockExec)

    const issues = await adapter.listReady()

    expect(mockExec).toHaveBeenCalledWith('bd ready', { cwd: '.' })
    expect(issues).toHaveLength(1)
    expect(issues[0].id).toBe('AT-123')
    expect(issues[0].title).toBe('Test Issue')
  })
})
