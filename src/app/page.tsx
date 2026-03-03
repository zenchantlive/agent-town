// Agent Town - Main Page with Real Beads Backend
'use client'

import { useState } from 'react'
import { TaskPanel } from '../components/TaskPanel/TaskPanel'
import { TownCrierFeed, TownCrierEvent } from '../components/TownCrierFeed/TownCrierFeed'
import { AnimatedTownCanvas } from '../components/AnimatedTownCanvas/AnimatedTownCanvas'
import { AnimatedAgentData } from '../components/AnimatedAgent/AnimatedAgent'
import { TaskItem } from '../components/TownCanvas/TownCanvas'
import { useBeadsData, useDemoData } from '../hooks/useBeadsData'

export default function AgentTown() {
  const [useRealBackend, setUseRealBackend] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [useAnimated, setUseAnimated] = useState(true)

  // Use demo or real backend based on toggle
  const demoData = useDemoData()
  const realData = useBeadsData({
    refreshInterval: 30000,
    autoRefresh: useRealBackend,
    useRealBackend,
  })

  const data = useRealBackend ? realData : demoData
  const { tasks, agents, events, isLoading, error, refresh } = data

  const handleAgentSelect = (agentId: string) => {
    setSelectedAgent(agentId === selectedAgent ? null : agentId)
  }

  const handleTaskClick = (taskId: string) => {
    console.log('Task clicked:', taskId)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Agent Town</h1>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={useRealBackend}
                  onChange={(e) => setUseRealBackend(e.target.checked)}
                  className="rounded"
                />
                Real Backend
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={useAnimated}
                  onChange={(e) => setUseAnimated(e.target.checked)}
                  className="rounded"
                />
                Animated
              </label>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {useRealBackend && (
              <button
                onClick={() => refresh()}
                disabled={isLoading}
                className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-500 rounded disabled:opacity-50"
              >
                {isLoading ? 'Refreshing...' : 'Refresh'}
              </button>
            )}
            <span className="text-sm text-gray-400">
              {agents.length} agents
            </span>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500" title="Idle" />
              <span className="w-3 h-3 rounded-full bg-blue-500" title="Working" />
              <span className="w-3 h-3 rounded-full bg-yellow-500" title="Thinking" />
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-red-500/20 border-b border-red-500 p-2 text-center text-red-400">
          {error}
        </div>
      )}

      {useRealBackend && isLoading && agents.length === 0 && (
        <div className="bg-blue-500/20 border-b border-blue-500 p-2 text-center text-blue-400">
          Connecting to bd...
        </div>
      )}

      <main className="p-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left column: Town Canvas */}
          <div className="lg:col-span-2">
            <AnimatedTownCanvas
              agents={agents}
              tasks={tasks}
              selectedAgentId={selectedAgent}
              onAgentSelect={handleAgentSelect}
              onTaskClick={handleTaskClick}
            />

            {/* Selected Agent Info */}
            {selectedAgent && (
              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <h3 className="font-semibold">Selected Agent</h3>
                <p className="text-gray-400">
                  {agents.find(a => a.id === selectedAgent)?.name} ({agents.find(a => a.id === selectedAgent)?.role})
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Status: {agents.find(a => a.id === selectedAgent)?.status}
                </p>
              </div>
            )}

            {/* Task Summary */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="p-3 bg-gray-800 rounded-lg text-center">
                <div className="text-2xl font-bold">{tasks.filter(t => t.status === 'done').length}</div>
                <div className="text-xs text-gray-400">Done</div>
              </div>
              <div className="p-3 bg-gray-800 rounded-lg text-center">
                <div className="text-2xl font-bold">{tasks.filter(t => t.status === 'in_progress').length}</div>
                <div className="text-xs text-gray-400">In Progress</div>
              </div>
              <div className="p-3 bg-gray-800 rounded-lg text-center">
                <div className="text-2xl font-bold">{tasks.filter(t => t.status === 'pending').length}</div>
                <div className="text-xs text-gray-400">Pending</div>
              </div>
            </div>
          </div>

          {/* Right column: Task Panel & Town Crier */}
          <div className="space-y-4">
            <TaskPanel
              tasks={tasks}
              approvals={[]}
              onTaskClick={handleTaskClick}
              onApprove={(id) => console.log('Approved:', id)}
              onReject={(id) => console.log('Rejected:', id)}
            />
            <TownCrierFeed
              events={events}
              onEventClick={(id) => console.log('Event clicked:', id)}
              realTime={useRealBackend}
            />
          </div>
        </div>
      </main>
    </div>
  )
}