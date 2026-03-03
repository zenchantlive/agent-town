import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AnimatedAgent, AnimatedAgentData } from '../AnimatedAgent'

describe('AnimatedAgent', () => {
  const mockAgent: AnimatedAgentData = {
    id: 'agent-1',
    name: 'Builder',
    role: 'infrastructure',
    status: 'idle',
    x: 100,
    y: 200,
  }

  it('should render agent with correct emoji', () => {
    render(<AnimatedAgent agent={mockAgent} />)
    expect(screen.getByText('🏗️')).toBeDefined()
  })

  it('should display agent name on hover', () => {
    render(<AnimatedAgent agent={mockAgent} />)
    const agent = screen.getByText('🏗️').parentElement?.parentElement as HTMLElement
    fireEvent.mouseEnter(agent)
    expect(screen.getByText('Builder')).toBeDefined()
  })

  it('should call onClick when agent clicked', () => {
    const handleClick = vi.fn()
    render(<AnimatedAgent agent={mockAgent} onClick={handleClick} />)
    const agent = screen.getByText('🏗️').parentElement?.parentElement as HTMLElement
    fireEvent.click(agent)
    expect(handleClick).toHaveBeenCalledWith('agent-1')
  })

  it('should show different emojis for different roles', () => {
    const qaAgent = { ...mockAgent, role: 'qa' }
    render(<AnimatedAgent agent={qaAgent} />)
    expect(screen.getByText('🧪')).toBeDefined()
  })

  it('should handle different status states', () => {
    const workingAgent = { ...mockAgent, status: 'working' as const }
    render(<AnimatedAgent agent={workingAgent} />)
    expect(screen.getByText('⚡')).toBeDefined()
  })

  it('should handle thinking status', () => {
    const thinkingAgent = { ...mockAgent, status: 'thinking' as const }
    render(<AnimatedAgent agent={thinkingAgent} />)
    expect(screen.getByText('💭')).toBeDefined()
  })

  it('should handle error status', () => {
    const errorAgent = { ...mockAgent, status: 'error' as const }
    render(<AnimatedAgent agent={errorAgent} />)
    expect(screen.getByText('❌')).toBeDefined()
  })

  it('should render role badge', () => {
    render(<AnimatedAgent agent={mockAgent} />)
    expect(screen.getByText('infrastructure')).toBeDefined()
  })
})