'use client';

import { useState, useMemo, useCallback } from 'react';
import { AgentData, AgentDirection, AgentState, TilePosition } from '../types';

interface UseAgentsOptions {
  initialAgents?: AgentData[];
}

export function useAgents(options: UseAgentsOptions = {}) {
  const [agents, setAgents] = useState<AgentData[]>(options.initialAgents || [
    {
      id: 'agent-1',
      name: 'Builder',
      position: { x: 9, y: 5 },
      direction: AgentDirection.SOUTH,
      state: AgentState.WORKING,
      taskId: 'task-1',
    },
    {
      id: 'agent-2',
      name: 'Explorer',
      position: { x: 10, y: 8 },
      direction: AgentDirection.EAST,
      state: AgentState.IDLE,
      taskId: null,
    },
    {
      id: 'agent-3',
      name: 'Hauler',
      position: { x: 8, y: 6 },
      direction: AgentDirection.NORTH,
      state: AgentState.BLOCKED,
      taskId: 'task-2',
    },
  ]);

  const moveAgent = useCallback((agentId: string, newPosition: TilePosition) => {
    setAgents(prev =>
      prev.map(agent =>
        agent.id === agentId
          ? { ...agent, position: newPosition }
          : agent
      )
    );
  }, []);

  const setAgentDirection = useCallback((agentId: string, direction: AgentDirection) => {
    setAgents(prev =>
      prev.map(agent =>
        agent.id === agentId
          ? { ...agent, direction }
          : agent
      )
    );
  }, []);

  const setAgentState = useCallback((agentId: string, state: AgentState) => {
    setAgents(prev =>
      prev.map(agent =>
        agent.id === agentId
          ? { ...agent, state }
          : agent
      )
    );
  }, []);

  const assignTask = useCallback((agentId: string, taskId: string | null) => {
    setAgents(prev =>
      prev.map(agent =>
        agent.id === agentId
          ? { ...agent, taskId, state: taskId ? AgentState.WORKING : AgentState.IDLE }
          : agent
      )
    );
  }, []);

  return {
    agents,
    moveAgent,
    setAgentDirection,
    setAgentState,
    assignTask,
  };
}
