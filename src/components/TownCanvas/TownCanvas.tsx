'use client'

import React from 'react'

export interface AgentSprite {
  id: string
  name: string
  status: 'idle' | 'working' | 'thinking' | 'moving' | 'error'
  x: number
  y: number
}

export interface TaskItem {
  id: string
  title: string
  assignee?: string
  status: 'pending' | 'in_progress' | 'done'
}

interface TownCanvasProps {
  agents: AgentSprite[]
  tasks: TaskItem[]
  onAgentSelect?: (agentId: string) => void
  onTaskClick?: (taskId: string) => void
}

export function TownCanvas({ agents, tasks, onAgentSelect, onTaskClick }: TownCanvasProps) {
  return (
    <div
      data-testid="town-canvas"
      className="relative w-full h-[600px] bg-gray-900 rounded-lg overflow-hidden border border-gray-700"
    >
      {/* Grid background */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle, #4ade80 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }} />

      {/* Title */}
      <div className="absolute top-4 left-4 z-10">
        <h2 className="text-lg font-semibold text-white">Agent Town</h2>
      </div>

      {/* Agent count indicator */}
      <div className="absolute top-4 right-4 z-10">
        <span className="text-sm text-gray-400">
          {agents.length} agent{agents.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Empty state */}
      {agents.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500">No agents yet</p>
        </div>
      )}

      {/* Agent sprites */}
      {agents.map((agent) => (
        <div
          key={agent.id}
          data-testid={`agent-${agent.id}`}
          className="absolute cursor-pointer transition-all duration-300"
          style={{
            left: agent.x,
            top: agent.y,
            transform: 'translate(-50%, -50%)'
          }}
          onClick={() => onAgentSelect?.(agent.id)}
        >
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center
            ${agent.status === 'idle' ? 'bg-green-500' : ''}
            ${agent.status === 'working' ? 'bg-blue-500 animate-pulse' : ''}
            ${agent.status === 'thinking' ? 'bg-yellow-500 animate-spin' : ''}
            ${agent.status === 'error' ? 'bg-red-500' : ''}
          `}>
            <span className="text-white text-xs font-bold">
              {agent.name.charAt(0)}
            </span>
          </div>
          <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap">
            {agent.name}
          </span>
        </div>
      ))}

      {/* Task markers */}
      {tasks.map((task) => (
        <div
          key={task.id}
          data-testid={`task-${task.id}`}
          className="absolute w-4 h-4 bg-purple-500 rounded cursor-pointer"
          style={{
            left: 50 + (parseInt(task.id.slice(-1)) * 30),
            top: 50
          }}
          onClick={() => onTaskClick?.(task.id)}
        />
      ))}
    </div>
  )
}