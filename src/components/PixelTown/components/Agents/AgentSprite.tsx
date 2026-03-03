'use client';

import React from 'react';
import { AgentData, AgentDirection, AgentState } from '../../types';
import { TILE_SIZE } from '../../constants';

interface AgentSpriteProps {
  agent: AgentData;
}

const DIRECTION_CLASSES: Record<AgentDirection, string> = {
  [AgentDirection.NORTH]: 'agent-facing-north',
  [AgentDirection.SOUTH]: 'agent-facing-south',
  [AgentDirection.EAST]: 'agent-facing-east',
  [AgentDirection.WEST]: 'agent-facing-west',
};

const STATE_CLASSES: Record<AgentState, string> = {
  [AgentState.IDLE]: 'agent-state-idle',
  [AgentState.WORKING]: 'agent-state-working',
  [AgentState.BLOCKED]: 'agent-state-blocked',
  [AgentState.SUCCESS]: 'agent-state-success',
};

const STATE_COLORS: Record<AgentState, string> = {
  [AgentState.IDLE]: '#94a3b8',      // Slate - neutral
  [AgentState.WORKING]: '#3b82f6',   // Blue - active
  [AgentState.BLOCKED]: '#ef4444',   // Red - blocked
  [AgentState.SUCCESS]: '#22c55e',   // Green - success
};

export function AgentSprite({ agent }: AgentSpriteProps) {
  const left = agent.position.x * TILE_SIZE;
  const top = agent.position.y * TILE_SIZE;

  const directionClass = DIRECTION_CLASSES[agent.direction] || DIRECTION_CLASSES[AgentDirection.SOUTH];
  const stateClass = STATE_CLASSES[agent.state] || STATE_CLASSES[AgentState.IDLE];
  const stateColor = STATE_COLORS[agent.state] || STATE_COLORS[AgentState.IDLE];

  return (
    <div
      data-testid="agent-sprite"
      className={`absolute z-10 transition-all duration-200 ${directionClass} ${stateClass}`}
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${TILE_SIZE}px`,
        height: `${TILE_SIZE}px`,
      }}
    >
      {/* Agent body (pixel art style) */}
      <div
        className="w-full h-full rounded-full border-2 border-black/30"
        style={{ backgroundColor: stateColor }}
      >
        {/* Face direction indicator */}
        <div
          className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full"
          style={{
            transform: agent.direction === AgentDirection.NORTH ? 'translateY(-2px)' :
                       agent.direction === AgentDirection.SOUTH ? 'translateY(2px)' :
                       agent.direction === AgentDirection.EAST ? 'translateX(2px)' :
                       agent.direction === AgentDirection.WEST ? 'translateX(-2px)' : 'none',
          }}
        />
      </div>

      {/* Agent name label */}
      <div
        data-testid="agent-name"
        className="absolute -top-5 left-1/2 -translate-x-1/2 px-1 py-0.5 bg-black/70 text-white text-xs rounded whitespace-nowrap"
      >
        {agent.name}
      </div>

      {/* State indicator */}
      <div
        data-testid="agent-state-indicator"
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full border border-white"
        style={{ backgroundColor: stateColor }}
      />
    </div>
  );
}
