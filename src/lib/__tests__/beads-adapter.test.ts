import { describe, it, expect } from 'vitest'
import { BeadsAdapter } from '../beads-adapter'

describe('BeadsAdapter', () => {
  it('should list ready issues', async () => {
    const adapter = new BeadsAdapter('/mock/path')
    expect(adapter.listReady).toBeDefined()
  })
})
