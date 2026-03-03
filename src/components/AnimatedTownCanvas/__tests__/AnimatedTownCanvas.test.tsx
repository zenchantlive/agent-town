import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AnimatedTownCanvas } from '../AnimatedTownCanvas'
import { AnimatedAgentData } from '../AnimatedAgent/AnimatedAgent'

describe('AnimatedTownCanvas', () => {
  const mockAgents: AnimatedAgentData[] = [
    { id: 'agent-1', name: 'Builder', role: 'infrastructure', status: 'idle', x: 100, y: 200 },
    { id: 'agent-2', name: 'Tester', role: 'qa', status: 'working', x: 300, y: 400 },
  ]

  const mockTasks = [
    { id: 'task-1', title: 'Implement API', status: 'in_progress' as const },
    { id: 'task-2', title: 'Write Tests', status: 'pending' as const },
  ]

  it('should render the animated canvas', () => {
    render(<AnimatedTownCanvas agents={mockAgents} tasks={mockTasks} />)
    expect(screen.getByTestId('animated-town-canvas')).toBeDefined()
  })

  it('should display agent count', () => {
    render(<AnimatedTownCanvas agents={mockAgents} tasks={mockTasks} />)
    expect(screen.getByText('2 agents')).toBeDefined()
  })

  it('should show empty state when no agents', () => {
    render(<AnimatedTownCanvas agents={[]} tasks={[]} />)
    expect(screen.getByText('No agents yet')).toBeDefined()
  })

  it('should render task markers', () => {
    render(<AnimatedTownCanvas agents={[]} tasks={mockTasks} />)
    expect(screen.getByTestId('task-task-1')).toBeDefined()
    expect(screen.getByTestId('task-task-2')).toBeDefined()
  })

  it('should call onAgentSelect when agent clicked', () => {
    const handleSelect = vi.fn()
    render(<AnimatedTownCanvas agents={mockAgents} tasks={mockTasks} onAgentSelect={handleSelect} />)
    // Agent click is handled by AnimatedAgent component
    fireEvent.click(screen.getByText('🏗️').closest('div')!)
    expect(handleSelect).toHaveBeenCalledWith('agent-1')
  })

  it('should call onTaskClick when task clicked', () => {
    const handleTaskClick = vi.fn()
    render(<AnimatedTownCanvas agents={[]} tasks={mockTasks} onTaskClick={handleTaskClick} />)
    fireEvent.click(screen.getByTestId('task-task-1'))
    expect(handleTaskClick).toHaveBeenCalledWith('task-1')
  })

  it('should show status legend', () => {
    render(<AnimatedTownCanvas agents={mockAgents} tasks={mockTasks} />)
    expect(screen.getByText('Idle')).toBeDefined()
    expect(screen.getByText('Working')).toBeDefined()
    expect(screen.getByText('Thinking')).toBeDefined()
  })

  it('should render title', () => {
    render(<AnimatedTownCanvas agents={mockAgents} tasks={mockTasks} />)
    expect(screen.getByText('Agent Town')).toBeDefined()
  })
})