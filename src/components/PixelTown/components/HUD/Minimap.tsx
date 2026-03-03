'use client';

import React from 'react';
import { TileData, BuildingData, AgentData } from '../../types';

interface MinimapProps {
  tiles: TileData[][];
  buildings: BuildingData[];
  agents: AgentData[];
  viewportPosition: { x: number; y: number };
  width?: number;
  height?: number;
}

const TERRAIN_COLORS: Record<string, string> = {
  grass: '#22c55e',
  water: '#1e3a5f',
  street: '#374151',
  path: '#78716c',
};

export function Minimap({
  tiles,
  buildings,
  agents,
  viewportPosition,
  width = 192, // 48 * 4
  height = 192,
}: MinimapProps) {
  const gridWidth = tiles[0]?.length || 20;
  const gridHeight = tiles.length || 20;
  const cellWidth = width / gridWidth;
  const cellHeight = height / gridHeight;

  return (
    <div
      data-testid="minimap"
      className="absolute bottom-4 right-4 w-48 h-48 bg-gray-900/90 rounded-lg border border-gray-600 overflow-hidden"
      style={{ width, height }}
    >
      <svg width={width} height={height} className="block">
        {/* Terrain layer */}
        {tiles.map((row, y) =>
          row.map((tile, x) => (
            <rect
              key={`tile-${x}-${y}`}
              x={x * cellWidth}
              y={y * cellHeight}
              width={cellWidth}
              height={cellHeight}
              fill={TERRAIN_COLORS[tile.terrain as string] || TERRAIN_COLORS.grass}
            />
          ))
        )}

        {/* Buildings layer */}
        {buildings.map((building) => (
          <rect
            key={`minimap-building-${building.id}`}
            data-testid="minimap-building"
            x={building.position.x * cellWidth}
            y={building.position.y * cellHeight}
            width={building.width * cellWidth}
            height={building.height * cellHeight}
            fill="#dc2626"
            className="opacity-80"
          />
        ))}

        {/* Agents layer */}
        {agents.map((agent) => (
          <circle
            key={`minimap-agent-${agent.id}`}
            data-testid="minimap-agent"
            cx={agent.position.x * cellWidth + cellWidth / 2}
            cy={agent.position.y * cellHeight + cellHeight / 2}
            r={cellWidth / 2}
            fill="#3b82f6"
            className="opacity-90"
          />
        ))}

        {/* Viewport indicator */}
        <rect
          data-testid="minimap-viewport"
          x={Math.max(0, viewportPosition.x * cellWidth)}
          y={Math.max(0, viewportPosition.y * cellHeight)}
          width={Math.min(gridWidth * 0.3, (gridWidth - viewportPosition.x) * cellWidth)}
          height={Math.min(gridHeight * 0.3, (gridHeight - viewportPosition.y) * cellHeight)}
          fill="none"
          stroke="white"
          strokeWidth={1}
          className="opacity-50"
        />
      </svg>
    </div>
  );
}
