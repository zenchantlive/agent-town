'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTilemap } from './hooks/useTilemap';
import { useAgents } from './hooks/useAgents';
import { usePings } from './hooks/usePings';
import { PixelTownMap } from './PixelTownMap';
import { AnimatedAgentData } from '../AnimatedAgent/AnimatedAgent';
import { TaskItem } from '../TownCanvas/TownCanvas';
import { AgentDirection, AgentState, TaskStatus } from './types';

interface PixelTownCanvasProps {
  agents: AnimatedAgentData[];
  tasks: TaskItem[];
  selectedAgentId?: string | null;
  onAgentSelect?: (agentId: string) => void;
  onTaskClick?: (taskId: string) => void;
}

// Convert AnimatedAgentData to AgentData for PixelTownMap
function convertAgents(animatedAgents: AnimatedAgentData[]) {
  return animatedAgents.map(agent => ({
    id: agent.id,
    name: agent.name,
    position: {
      x: Math.floor(agent.x / 32), // Convert pixel to tile position
      y: Math.floor(agent.y / 32),
    },
    direction: AgentDirection.SOUTH,
    state: agent.status === 'idle' ? AgentState.IDLE :
            agent.status === 'working' ? AgentState.WORKING :
            agent.status === 'blocked' ? AgentState.BLOCKED :
            agent.status === 'success' ? AgentState.SUCCESS :
            AgentState.IDLE,
    taskId: null,
  }));
}

function convertTasks(tasks: TaskItem[]) {
  return tasks.map((task, index) => ({
    id: task.id,
    title: task.title,
    status: task.status === 'pending' ? TaskStatus.PENDING :
            task.status === 'in_progress' ? TaskStatus.IN_PROGRESS :
            TaskStatus.COMPLETED,
    position: {
      x: 2 + (index % 5) * 3,
      y: 10 + Math.floor(index / 5) * 2,
    },
    assigneeId: task.assignee || null,
  }));
}

export function PixelTownCanvas({
  agents: animatedAgents,
  tasks,
  selectedAgentId,
  onAgentSelect,
  onTaskClick,
}: PixelTownCanvasProps) {
  const {
    mapData,
    camera,
    tileSize,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetCamera,
  } = useTilemap();

  const { agents } = useAgents({
    initialAgents: convertAgents(animatedAgents),
  });

  const { pings } = usePings();

  const mapTasks = convertTasks(tasks);

  return (
    <div className="relative">
      <PixelTownMap
        mapData={mapData}
        camera={camera}
        tileSize={tileSize}
        agents={agents}
        tasks={mapTasks}
        pings={pings}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onResetCamera={resetCamera}
      />
    </div>
  );
}
