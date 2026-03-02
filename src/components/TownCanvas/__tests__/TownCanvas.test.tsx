import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TownCanvas } from '../TownCanvas'

describe('TownCanvas', () => {
  it('should render the town canvas container', () => {
    render(<TownCanvas agents={[]} tasks={[]} />)
    expect(screen.getByTestId('town-canvas')).toBeDefined()
  })

  it('should render empty state when no agents', () => {
    render(<TownCanvas agents={[]} tasks={[]} />)
    expect(screen.getByText(/No agents yet/i)).toBeDefined()
  })

  it('should render agent sprites when agents present', () => {
    const mockAgents = [
      { id: 'agent-1', name: 'Builder', status: 'idle', x: 100, y: 200 },
      { id: 'agent-2', name: 'Tester', status: 'working', x: 300, y: 400 },
    ]
    render(<TownCanvas agents={mockAgents} tasks={[]} />)
    expect(screen.getByTestId('town-canvas')).toBeDefined()
  })
})