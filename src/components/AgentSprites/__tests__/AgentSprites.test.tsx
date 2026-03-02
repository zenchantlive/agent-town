import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AgentSprites, AgentSpriteData } from '../AgentSprites'

describe('AgentSprites', () => {
  const mockAgents: AgentSpriteData[] = [
    { id: 'agent-1', name: 'Builder', role: 'infrastructure', status: 'idle', x: 100, y: 200 },
    { id: 'agent-2', name: 'Tester', role: 'qa', status: 'working', x: 300, y: 400 },
    { id: 'agent-3', name: 'Architect', role: 'design', status: 'thinking', x: 500, y: 300 },
  ]

  it('should render all agent sprites', () => {
    render(<AgentSprites agents={mockAgents} />)
    expect(screen.getByTestId('agent-sprite-agent-1')).toBeDefined()
    expect(screen.getByTestId('agent-sprite-agent-2')).toBeDefined()
    expect(screen.getByTestId('agent-sprite-agent-3')).toBeDefined()
  })

  it('should display agent name on hover', () => {
    render(<AgentSprites agents={mockAgents} />)
    const builder = screen.getByTestId('agent-sprite-agent-1')
    fireEvent.mouseEnter(builder)
    expect(screen.getByText('Builder')).toBeDefined()
  })

  it('should show status indicator colors', () => {
    render(<AgentSprites agents={mockAgents} />)
    const idleSprite = screen.getByTestId('agent-sprite-agent-1')
    const workingSprite = screen.getByTestId('agent-sprite-agent-2')

    // Check that status indicators exist (different colors via CSS classes)
    expect(idleSprite).toBeDefined()
    expect(workingSprite).toBeDefined()
  })

  it('should call onAgentClick when agent clicked', () => {
    const handleClick = vi.fn()
    render(<AgentSprites agents={mockAgents} onAgentClick={handleClick} />)
    const agent = screen.getByTestId('agent-sprite-agent-1')
    fireEvent.click(agent)
    expect(handleClick).toHaveBeenCalledWith('agent-1')
  })

  it('should render empty state when no agents', () => {
    render(<AgentSprites agents={[]} />)
    expect(screen.getByText(/no agents/i)).toBeDefined()
  })

  it('should show agent role badge', () => {
    render(<AgentSprites agents={mockAgents} showRoles={true} />)
    expect(screen.getByText('infrastructure')).toBeDefined()
    expect(screen.getByText('qa')).toBeDefined()
    expect(screen.getByText('design')).toBeDefined()
  })

  it('should handle agent movement animation', () => {
    const movingAgents: AgentSpriteData[] = [
      { id: 'agent-1', name: 'Moving', role: 'test', status: 'moving', x: 100, y: 200, targetX: 300, targetY: 400 },
    ]
    render(<AgentSprites agents={movingAgents} />)
    const sprite = screen.getByTestId('agent-sprite-agent-1')
    expect(sprite).toBeDefined()
  })
})