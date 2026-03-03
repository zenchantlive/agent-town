'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface AnimatedAgentData {
  id: string
  name: string
  role: string
  status: 'idle' | 'working' | 'thinking' | 'moving' | 'error'
  x: number
  y: number
  targetX?: number
  targetY?: number
  isNew?: boolean
}

interface AnimatedAgentProps {
  agent: AnimatedAgentData
  onClick?: (agentId: string) => void
  isSelected?: boolean
}

export function AnimatedAgent({ agent, onClick, isSelected = false }: AnimatedAgentProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'idle':
        return { color: 'bg-green-500', pulse: false, icon: '💤' }
      case 'working':
        return { color: 'bg-blue-500', pulse: true, icon: '⚡' }
      case 'thinking':
        return { color: 'bg-yellow-500', pulse: false, icon: '💭', spin: true }
      case 'moving':
        return { color: 'bg-purple-500', pulse: true, icon: '🏃' }
      case 'error':
        return { color: 'bg-red-500', pulse: true, icon: '❌' }
      default:
        return { color: 'bg-gray-500', pulse: false, icon: '❓' }
    }
  }

  const config = getStatusConfig(agent.status)

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

  // Movement animation config
  const hasMovement = agent.targetX !== undefined && agent.targetY !== undefined
  const xDistance = agent.targetX ? agent.targetX - agent.x : 0
  const yDistance = agent.targetY ? agent.targetY - agent.y : 0

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: agent.x,
        top: agent.y,
        transform: 'translate(-50%, -50%)',
        zIndex: isSelected ? 50 : 10,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        x: hasMovement ? xDistance : 0,
        y: hasMovement ? yDistance : 0,
      }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        type: hasMovement ? 'spring' : 'spring',
        stiffness: hasMovement ? 120 : 300,
        damping: hasMovement ? 20 : 25,
      }}
      onClick={() => onClick?.(agent.id)}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Main sprite */}
      <motion.div
        className={`
          w-14 h-14 rounded-full flex items-center justify-center
          shadow-lg border-2 border-white/20 ${config.color}
          ${agent.status === 'moving' ? 'animate-bounce' : ''}
        `}
        animate={
          config.pulse
            ? { scale: [1, 1.05, 1] }
            : config.spin
            ? { rotate: [0, 360] }
            : {}
        }
        transition={
          config.pulse
            ? { repeat: Infinity, duration: 1.5 }
            : config.spin
            ? { repeat: Infinity, duration: 3, ease: 'linear' }
            : {}
        }
      >
        <span className="text-2xl">{getRoleEmoji(agent.role)}</span>
      </motion.div>

      {/* Status ring when selected */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white"
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1.4, opacity: 0 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        )}
      </AnimatePresence>

      {/* Status indicator */}
      <motion.div
        className={`
          absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900
          ${config.color.replace('bg-', 'bg-')}-400
        `}
        animate={
          config.pulse
            ? { scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }
            : {}
        }
        transition={{ repeat: Infinity, duration: 1 }}
      />

      {/* Status icon */}
      <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs">
        {config.icon}
      </div>

      {/* Name label */}
      <motion.div
        className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
        initial={{ opacity: 0, y: 5 }}
        whileHover={{ opacity: 1, y: 0 }}
      >
        <span className="text-xs text-white bg-gray-800 px-2 py-0.5 rounded shadow">
          {agent.name}
        </span>
      </motion.div>

      {/* Role badge */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <span className="text-xs text-gray-400 bg-gray-800/80 px-2 py-0.5 rounded">
          {agent.role}
        </span>
      </div>

      {/* Working indicator */}
      <AnimatePresence>
        {agent.status === 'working' && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <motion.div
              className="w-2 h-2 bg-blue-400 rounded-full"
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}