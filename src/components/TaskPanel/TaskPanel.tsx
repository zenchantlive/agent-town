'use client'

import React, { useState } from 'react'

export interface Task {
  id: string
  title: string
  assignee?: string
  status: 'pending' | 'in_progress' | 'done'
  priority?: string
}

export interface ApprovalRequest {
  id: string
  taskId: string
  agentId: string
  request: string
  status: 'pending' | 'approved' | 'rejected'
}

interface TaskPanelProps {
  tasks: Task[]
  approvals: ApprovalRequest[]
  onTaskClick?: (taskId: string) => void
  onApprove?: (approvalId: string) => void
  onReject?: (approvalId: string) => void
  filter?: 'all' | 'pending' | 'in_progress' | 'done'
}

export function TaskPanel({
  tasks,
  approvals,
  onTaskClick,
  onApprove,
  onReject,
  filter = 'all'
}: TaskPanelProps) {
  const [activeTab, setActiveTab] = useState<'tasks' | 'approvals'>('tasks')

  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter(t => t.status === filter)

  const pendingApprovals = approvals.filter(a => a.status === 'pending')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-500/20 text-green-400'
      case 'in_progress': return 'bg-blue-500/20 text-blue-400'
      case 'pending': return 'bg-gray-500/20 text-gray-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'P0': return 'text-red-400'
      case 'P1': return 'text-orange-400'
      case 'P2': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      {/* Header with tabs */}
      <div className="flex border-b border-gray-700">
        <button
          data-testid="tab-tasks"
          className={`flex-1 p-3 text-center ${activeTab === 'tasks' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks ({tasks.length})
        </button>
        <button
          data-testid="tab-approvals"
          className={`flex-1 p-3 text-center ${activeTab === 'approvals' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setActiveTab('approvals')}
        >
          Approvals ({pendingApprovals.length})
        </button>
      </div>

      {/* Task count summary */}
      {activeTab === 'tasks' && (
        <div className="p-3 border-b border-gray-700 flex gap-4 text-sm text-gray-400">
          <span data-testid="task-count-total">{tasks.length} total</span>
          <span data-testid="task-count-in-progress">{inProgressCount} in progress</span>
        </div>
      )}

      {/* Tasks tab */}
      {activeTab === 'tasks' && (
        <div className="p-3">
          {filteredTasks.length === 0 ? (
            <p data-testid="empty-tasks" className="text-center text-gray-500 py-4">No tasks</p>
          ) : (
            <div className="space-y-2">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  data-testid={`task-${task.id}`}
                  className="p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                  onClick={() => onTaskClick?.(task.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {task.priority && (
                        <span className={`text-xs font-bold ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      )}
                      <span className="text-white">{task.title}</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                  {task.assignee && (
                    <p className="text-xs text-gray-400 mt-1">Assigned to: {task.assignee}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Approvals tab */}
      {activeTab === 'approvals' && (
        <div className="p-3">
          {pendingApprovals.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No pending approvals</p>
          ) : (
            <div className="space-y-3">
              {pendingApprovals.map((approval) => (
                <div
                  key={approval.id}
                  data-testid={`approval-${approval.id}`}
                  className="p-3 bg-gray-700 rounded-lg"
                >
                  <p className="text-white mb-2">{approval.request}</p>
                  <p className="text-xs text-gray-400 mb-3">From: {approval.agentId}</p>
                  <div className="flex gap-2">
                    <button
                      data-testid="approve-btn"
                      className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white rounded text-sm"
                      onClick={() => onApprove?.(approval.id)}
                    >
                      Approve
                    </button>
                    <button
                      data-testid="reject-btn"
                      className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-sm"
                      onClick={() => onReject?.(approval.id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}