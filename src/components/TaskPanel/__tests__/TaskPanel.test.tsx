import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskPanel, Task, ApprovalRequest } from '../TaskPanel'

describe('TaskPanel', () => {
  const mockTasks: Task[] = [
    { id: 'task-1', title: 'Implement API', assignee: 'agent-1', status: 'in_progress', priority: 'P0' },
    { id: 'task-2', title: 'Write Tests', assignee: 'agent-2', status: 'pending', priority: 'P1' },
    { id: 'task-3', title: 'Design UI', assignee: 'agent-3', status: 'done', priority: 'P2' },
  ]

  const mockApprovals: ApprovalRequest[] = [
    { id: 'apr-1', taskId: 'task-1', agentId: 'agent-1', request: 'Deploy to production', status: 'pending' },
  ]

  it('should render task list', () => {
    render(<TaskPanel tasks={mockTasks} approvals={[]} onTaskClick={vi.fn()} onApprove={vi.fn()} onReject={vi.fn()} />)
    expect(screen.getByText('Implement API')).toBeDefined()
    expect(screen.getByText('Write Tests')).toBeDefined()
    expect(screen.getByText('Design UI')).toBeDefined()
  })

  it('should filter tasks by status', () => {
    render(<TaskPanel tasks={mockTasks} approvals={[]} onTaskClick={vi.fn()} onApprove={vi.fn()} onReject={vi.fn()} filter="in_progress" />)
    expect(screen.getByText('Implement API')).toBeDefined()
    expect(screen.queryByText('Write Tests')).toBeNull()
  })

  it('should show approval requests', () => {
    render(<TaskPanel tasks={mockTasks} approvals={mockApprovals} onTaskClick={vi.fn()} onApprove={vi.fn()} onReject={vi.fn()} />)
    // Click on approvals tab first
    fireEvent.click(screen.getByTestId('tab-approvals'))
    expect(screen.getByText('Deploy to production')).toBeDefined()
    expect(screen.getByText('Approve')).toBeDefined()
    expect(screen.getByText('Reject')).toBeDefined()
  })

  it('should call onApprove when approve button clicked', () => {
    const handleApprove = vi.fn()
    render(<TaskPanel tasks={mockTasks} approvals={mockApprovals} onTaskClick={vi.fn()} onApprove={handleApprove} onReject={vi.fn()} />)
    // Click on approvals tab first
    fireEvent.click(screen.getByTestId('tab-approvals'))
    fireEvent.click(screen.getByText('Approve'))
    expect(handleApprove).toHaveBeenCalledWith('apr-1')
  })

  it('should call onReject when reject button clicked', () => {
    const handleReject = vi.fn()
    render(<TaskPanel tasks={mockTasks} approvals={mockApprovals} onTaskClick={vi.fn()} onApprove={vi.fn()} onReject={handleReject} />)
    // Click on approvals tab first
    fireEvent.click(screen.getByTestId('tab-approvals'))
    fireEvent.click(screen.getByText('Reject'))
    expect(handleReject).toHaveBeenCalledWith('apr-1')
  })

  it('should call onTaskClick when task clicked', () => {
    const handleTaskClick = vi.fn()
    render(<TaskPanel tasks={mockTasks} approvals={[]} onTaskClick={handleTaskClick} onApprove={vi.fn()} onReject={vi.fn()} />)
    fireEvent.click(screen.getByText('Implement API'))
    expect(handleTaskClick).toHaveBeenCalledWith('task-1')
  })

  it('should display empty state when no tasks', () => {
    render(<TaskPanel tasks={[]} approvals={[]} onTaskClick={vi.fn()} onApprove={vi.fn()} onReject={vi.fn()} />)
    expect(screen.getByText(/no tasks/i)).toBeDefined()
  })

  it('should show task count by status', () => {
    render(<TaskPanel tasks={mockTasks} approvals={[]} onTaskClick={vi.fn()} onApprove={vi.fn()} onReject={vi.fn()} />)
    expect(screen.getByText('3 total')).toBeDefined()
    expect(screen.getByText('1 in progress')).toBeDefined()
  })
})