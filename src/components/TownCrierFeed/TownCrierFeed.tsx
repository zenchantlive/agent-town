'use client'

import React from 'react'

export interface TownCrierEvent {
  id: string
  type: 'task_completed' | 'task_started' | 'approval_requested' | 'approval_completed' | 'agent_status_changed' | 'agent_error' | 'system'
  message: string
  timestamp: number
  isNew?: boolean
  metadata?: Record<string, any>
}

interface TownCrierFeedProps {
  events: TownCrierEvent[]
  onEventClick?: (eventId: string) => void
  filter?: 'all' | 'task_completed' | 'approval_requested' | 'agent_status_changed' | 'agent_error' | 'system'
  realTime?: boolean
  maxHeight?: string
}

export function TownCrierFeed({
  events,
  onEventClick,
  filter = 'all',
  realTime = false,
  maxHeight = '300px'
}: TownCrierFeedProps) {
  const filteredEvents = filter === 'all'
    ? events
    : events.filter(e => e.type === filter)

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)

    if (seconds < 60) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return new Date(timestamp).toLocaleDateString()
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'task_completed': return '✅'
      case 'task_started': return '🚀'
      case 'approval_requested': return '📋'
      case 'approval_completed': return '✅'
      case 'agent_status_changed': return '🔄'
      case 'agent_error': return '❌'
      case 'system': return '⚙️'
      default: return '📢'
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'task_completed': return 'border-l-green-500'
      case 'task_started': return 'border-l-blue-500'
      case 'approval_requested': return 'border-l-yellow-500'
      case 'approval_completed': return 'border-l-green-500'
      case 'agent_status_changed': return 'border-l-purple-500'
      case 'agent_error': return 'border-l-red-500'
      case 'system': return 'border-l-gray-500'
      default: return 'border-l-gray-500'
    }
  }

  if (events.length === 0) {
    return (
      <div data-testid="town-crier-empty" className="p-4 text-center text-gray-500">
        No events
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">📢</span>
          <h3 className="font-semibold text-white">Town Crier</h3>
        </div>
        <div className="flex items-center gap-2">
          {realTime && (
            <span data-testid="realtime-indicator" className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Live
            </span>
          )}
          <span className="text-xs text-gray-400">{events.length} events</span>
        </div>
      </div>

      {/* Event list */}
      <div
        data-testid="event-list"
        className="overflow-y-auto"
        style={{ maxHeight }}
      >
        {filteredEvents.map((event) => (
          <div
            key={event.id}
            data-testid={`evt-${event.id}`}
            className={`
              p-3 border-l-4 cursor-pointer hover:bg-gray-700 transition-colors
              ${getEventColor(event.type)}
              ${event.isNew ? 'bg-blue-500/10' : ''}
            `}
            onClick={() => onEventClick?.(event.id)}
          >
            <div className="flex items-start gap-3">
              <span data-testid={`icon-${event.type}`} className="text-lg">
                {getEventIcon(event.type)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{event.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatTimestamp(event.timestamp)}
                </p>
              </div>
              {event.isNew && (
                <span className="text-xs text-blue-400">NEW</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}