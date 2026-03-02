// Agent Town - Main Page
'use client'

import { useState } from 'react'
import { TownCanvas, TaskItem } from '../components/TownCanvas/TownCanvas'
import { AgentSprites, AgentSpriteData } from '../components/AgentSprites/AgentSprites'
import { TaskPanel } from '../components/TaskPanel/TaskPanel'
import { TownCrierFeed, TownCrierEvent } from '../components/TownCrierFeed/TownCrierFeed'

// Demo agents for testing
const demoAgents: AgentSpriteData[] = [
  { id: 'agent-1', name: 'Builder', role: 'infrastructure', status: 'idle', x: 150, y: 200 },
  { id: 'agent-2', name: 'Tester', role: 'qa', status: 'working', x: 350, y: 300 },
  { id: 'agent-3', name: 'Architect', role: 'design', status: 'thinking', x: 500, y: 200 },
  { id: 'agent-4', name: 'DevOps', role: 'devops', status: 'idle', x: 250, y: 450 },
]

const demoTasks = [
  { id: 'task-1', title: 'Implement API', assignee: 'agent-1', status: 'in_progress' as const, priority: 'P0' },
  { id: 'task-2', title: 'Write Tests', assignee: 'agent-2', status: 'pending' as const, priority: 'P1' },
  { id: 'task-3', title: 'Design UI', assignee: 'agent-3', status: 'done' as const, priority: 'P2' },
]

const demoEvents: TownCrierEvent[] = [
  { id: 'evt-1', type: 'task_completed', message: 'Builder completed Implement API', timestamp: Date.now() - 1000 },
  { id: 'evt-2', type: 'approval_requested', message: 'Tester requested approval for Deploy to prod', timestamp: Date.now() - 5000 },
  { id: 'evt-3', type: 'agent_status_changed', message: 'Architect is now thinking', timestamp: Date.now() - 10000 },
]

export default function AgentTown() {
  const [agents] = useState<AgentSpriteData[]>(demoAgents)
  const [tasks] = useState<typeof demoTasks>(demoTasks)
  const [events] = useState<TownCrierEvent[]>(demoEvents)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

  const handleAgentSelect = (agentId: string) => {
    setSelectedAgent(agentId)
  }

  const handleTaskClick = (taskId: string) => {
    console.log('Task clicked:', taskId)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Agent Town</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              {agents.length} agents active
            </span>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500" title="Idle" />
              <span className="w-3 h-3 rounded-full bg-blue-500" title="Working" />
              <span className="w-3 h-3 rounded-full bg-yellow-500" title="Thinking" />
            </div>
          </div>
        </div>
      </header>

      <main className="p-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left column: Town Canvas */}
          <div className="lg:col-span-2">
            <div className="relative">
              <TownCanvas
                agents={agents}
                tasks={tasks}
                onAgentSelect={handleAgentSelect}
                onTaskClick={handleTaskClick}
              />
            </div>

            {/* Selected Agent Info */}
            {selectedAgent && (
              <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                <h3 className="font-semibold">Selected Agent</h3>
                <p className="text-gray-400">
                  {agents.find(a => a.id === selectedAgent)?.name} ({agents.find(a => a.id === selectedAgent)?.role})
                </p>
              </div>
            )}
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
              realTime={true}
            />
          </div>
        </div>
      </main>
    </div>
  );
}