'use client'

import React, { useState } from 'react'

export interface AgentSpriteData {
  id: string
  name: string
  role: string
  status: 'idle' | 'working' | 'thinking' | 'moving' | 'error'
  x: number
  y: number
  targetX?: number
  targetY?: number
}

interface AgentSpritesProps {
  agents: AgentSpriteData[]
  onAgentClick?: (agentId: string) => void
  showRoles?: boolean
  className?: string
}

export function AgentSprites({ agents, onAgentClick, showRoles = true, className = '' }: AgentSpritesProps) {
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle': return 'bg-green-500'
      case 'working': return 'bg-blue-500'
      case 'thinking': return 'bg-yellow-500'
      case 'moving': return 'bg-purple-500 animate-pulse'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getRoleEmoji = (role: string) => {
    const emojis: Record<string, string> = {
      infrastructure: '🏗️',
      qa: '🧪',
      design: '🎨',
      frontend: '💻',
      backend: '⚙️',
      devops: '🚀',
      management: '👔',
    }
    return emojis[role] || '🤖'
  }

  if (agents.length === 0) {
    return (
      <div data-testid="agent-sprites-empty" className="p-4 text-center text-gray-500">
        No agents
      </div>
    )
  }

  return (
    <div data-testid="agent-sprites" className={`relative ${className}`}>
      {agents.map((agent) => (
        <div
          key={agent.id}
          data-testid={`agent-sprite-${agent.id}`}
          className="absolute cursor-pointer transition-all duration-300"
          style={{
            left: agent.x,
            top: agent.y,
            transform: 'translate(-50%, -50%)',
          }}
          onMouseEnter={() => setHoveredAgent(agent.id)}
          onMouseLeave={() => setHoveredAgent(null)}
          onClick={() => onAgentClick?.(agent.id)}
        >
          {/* Main sprite */}
          <div className={`
            w-14 h-14 rounded-full flex items-center justify-center
            shadow-lg border-2 border-white/20
            ${getStatusColor(agent.status)}
            ${agent.status === 'moving' ? 'animate-bounce' : ''}
            ${agent.status === 'thinking' ? 'animate-spin' : ''}
          `}>
            <span className="text-2xl">
              {getRoleEmoji(agent.role)}
            </span>
          </div>

          {/* Name tooltip */}
          {hoveredAgent === agent.id && (
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <div className="bg-gray-800 text-white text-sm px-3 py-1 rounded shadow-lg">
                {agent.name}
              </div>
            </div>
          )}

          {/* Role badge */}
          {showRoles && (
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <span className="text-xs text-gray-400 bg-gray-800/80 px-2 py-0.5 rounded">
                {agent.role}
              </span>
            </div>
          )}

          {/* Status indicator dot */}
          <div className={`
            absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900
            ${agent.status === 'idle' ? 'bg-green-400' : ''}
            ${agent.status === 'working' ? 'bg-blue-400' : ''}
            ${agent.status === 'thinking' ? 'bg-yellow-400 animate-pulse' : ''}
            ${agent.status === 'moving' ? 'bg-purple-400' : ''}
            ${agent.status === 'error' ? 'bg-red-400 animate-ping' : ''}
          `} />

          {/* Task indicator if assigned */}
          {agent.status === 'working' && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}