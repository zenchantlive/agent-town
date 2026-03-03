'use client'

import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AnimatedAgent, AnimatedAgentData } from '../AnimatedAgent/AnimatedAgent'
import { PixelTownCanvas } from '../PixelTown/PixelTownCanvas'

export interface TaskItem {
  id: string
  title: string
  assignee?: string
  status: 'pending' | 'in_progress' | 'done'
}

interface AnimatedTownCanvasProps {
  agents: AnimatedAgentData[]
  tasks: TaskItem[]
  selectedAgentId?: string | null
  onAgentSelect?: (agentId: string) => void
  onTaskClick?: (taskId: string) => void
  usePixelTown?: boolean  // New prop to enable Pixel Town mode
  showGrid?: boolean
}

export function AnimatedTownCanvas({
  agents,
  tasks,
  selectedAgentId,
  onAgentSelect,
  onTaskClick,
  usePixelTown = true,  // Default to Pixel Town mode
  showGrid = true,
}: AnimatedTownCanvasProps) {
  // If using Pixel Town mode, render the new component
  if (usePixelTown) {
    return (
      <div data-testid="pixel-town-canvas" className="relative">
        <PixelTownCanvas
          agents={agents}
          tasks={tasks}
          selectedAgentId={selectedAgentId}
          onAgentSelect={onAgentSelect}
          onTaskClick={onTaskClick}
        />

        {/* Pixel Town mode indicator */}
        <div className="absolute top-4 left-4 z-20">
          <span className="px-2 py-1 bg-purple-900/80 text-purple-200 text-xs rounded border border-purple-700">
            ✨ Pixel Town Mode
          </span>
        </div>
      </div>
    )
  }

  // Original grid-based rendering for backward compatibility
  return (
    <div
      data-testid="animated-town-canvas"
      className="relative w-full h-[600px] bg-gray-900 rounded-lg overflow-hidden border border-gray-700"
    >
      {/* Grid background */}
      {showGrid && (
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="#4ade80" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      )}

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

      {/* Status legend */}
      <div className="absolute top-4 right-24 z-10 flex items-center gap-3 text-xs">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500" /> Idle
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-500" /> Working
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-yellow-500" /> Thinking
        </span>
      </div>

      {/* Empty state */}
      <AnimatePresence>
        {agents.length === 0 && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-gray-500">No agents yet</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated agent sprites */}
      <AnimatePresence>
        {agents.map((agent) => (
          <AnimatedAgent
            key={agent.id}
            agent={agent}
            onClick={onAgentSelect}
            isSelected={selectedAgentId === agent.id}
          />
        ))}
      </AnimatePresence>

      {/* Task markers */}
      <AnimatePresence>
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            data-testid={`task-${task.id}`}
            className="absolute w-4 h-4 bg-purple-500 rounded cursor-pointer"
            style={{
              left: 50 + (index * 30),
              top: 50,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.3 }}
            onClick={() => onTaskClick?.(task.id)}
          >
            {/* Task status indicator */}
            <motion.div
              className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
              animate={{
                scale: task.status === 'done' ? [1, 1.2, 1] : [1],
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              style={{
                backgroundColor: task.status === 'done' ? '#22c55e' : '#a855f7',
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Movement trails for moving agents */}
      <AnimatePresence>
        {agents
          .filter((a) => a.status === 'moving')
          .map((agent) => (
            <motion.div
              key={`trail-${agent.id}`}
              className="absolute w-3 h-3 bg-purple-500/30 rounded-full pointer-events-none"
              style={{
                left: agent.x,
                top: agent.y,
              }}
              animate={{
                x: [0, -10, -20],
                y: [0, 5, 10],
                opacity: [0.5, 0.2, 0],
                scale: [1, 0.5, 0],
              }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          ))}
      </AnimatePresence>
    </div>
  )
}