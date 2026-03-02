import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TownCrierFeed, TownCrierEvent } from '../TownCrierFeed'

describe('TownCrierFeed', () => {
  const mockEvents: TownCrierEvent[] = [
    { id: 'evt-1', type: 'task_completed', message: 'Builder completed Implement API', timestamp: Date.now() - 1000 },
    { id: 'evt-2', type: 'approval_requested', message: 'Tester requested approval for Deploy to prod', timestamp: Date.now() - 5000 },
    { id: 'evt-3', type: 'agent_status_changed', message: 'Architect is now thinking', timestamp: Date.now() - 10000 },
  ]

  it('should render event feed', () => {
    render(<TownCrierFeed events={mockEvents} onEventClick={vi.fn()} />)
    expect(screen.getByText('Builder completed Implement API')).toBeDefined()
    expect(screen.getByText('Tester requested approval for Deploy to prod')).toBeDefined()
    expect(screen.getByText('Architect is now thinking')).toBeDefined()
  })

  it('should show event type icons', () => {
    render(<TownCrierFeed events={mockEvents} onEventClick={vi.fn()} />)
    expect(screen.getByTestId('icon-task_completed')).toBeDefined()
    expect(screen.getByTestId('icon-approval_requested')).toBeDefined()
    expect(screen.getByTestId('icon-agent_status_changed')).toBeDefined()
  })

  it('should display timestamp', () => {
    render(<TownCrierFeed events={mockEvents} onEventClick={vi.fn()} />)
    expect(screen.getAllByText('just now')).toHaveLength(3)
  })

  it('should call onEventClick when event clicked', () => {
    const handleClick = vi.fn()
    render(<TownCrierFeed events={mockEvents} onEventClick={handleClick} />)
    fireEvent.click(screen.getByText('Builder completed Implement API'))
    expect(handleClick).toHaveBeenCalledWith('evt-1')
  })

  it('should show empty state when no events', () => {
    render(<TownCrierFeed events={[]} onEventClick={vi.fn()} />)
    expect(screen.getByText(/no events/i)).toBeDefined()
  })

  it('should filter events by type', () => {
    render(<TownCrierFeed events={mockEvents} onEventClick={vi.fn()} filter="task_completed" />)
    expect(screen.getByText('Builder completed Implement API')).toBeDefined()
    expect(screen.queryByText('Tester requested approval for Deploy to prod')).toBeNull()
  })

  it('should show event count', () => {
    render(<TownCrierFeed events={mockEvents} onEventClick={vi.fn()} />)
    expect(screen.getByText('3 events')).toBeDefined()
  })

  it('should auto-scroll to new events', () => {
    const { container } = render(<TownCrierFeed events={mockEvents} onEventClick={vi.fn()} />)
    expect(container.querySelector('.overflow-y-auto')).toBeDefined()
  })

  it('should mark new events', () => {
    const newEvents = [
      { ...mockEvents[0], isNew: true },
      mockEvents[1],
    ]
    const { container } = render(<TownCrierFeed events={newEvents} onEventClick={vi.fn()} />)
    const eventElement = container.querySelector('[data-testid="evt-evt-1"]')
    expect(eventElement?.className).toContain('bg-blue-500/10')
  })

  it('should show real-time indicator', () => {
    render(<TownCrierFeed events={mockEvents} onEventClick={vi.fn()} realTime={true} />)
    expect(screen.getByText('Live')).toBeDefined()
  })
})