'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TILE_SIZE, GRID_WIDTH, GRID_HEIGHT, CAMERA } from './constants';
import { MapData, CameraState, AgentData, TaskData, PingData } from './types';
import { TileRenderer } from './components/Terrain/TileRenderer';
import { BuildingRenderer } from './components/Landmarks/BuildingRenderer';
import { AgentSprite } from './components/Agents';
import { TaskMarker } from './components/Markers';
import { Minimap, EventPing } from './components/HUD';

interface PixelTownMapProps {
  mapData: MapData;
  camera: CameraState;
  tileSize: number;
  agents?: AgentData[];
  tasks?: TaskData[];
  pings?: PingData[];
  onWheel: (e: React.WheelEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onResetCamera: () => void;
}

export function PixelTownMap({
  mapData,
  camera,
  tileSize,
  agents = [],
  tasks = [],
  pings = [],
  onWheel,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onResetCamera,
}: PixelTownMapProps) {
  const mapWidth = GRID_WIDTH * tileSize;
  const mapHeight = GRID_HEIGHT * tileSize;

  return (
    <div
      className="relative overflow-hidden bg-gray-950 rounded-lg border border-gray-700 select-none"
      style={{
        width: '100%',
        height: '600px',
        cursor: camera.isDragging ? 'grabbing' : 'grab',
      }}
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {/* Camera viewport container with zoom and pan */}
      <motion.div
        className="absolute origin-top-left"
        style={{
          width: mapWidth,
          height: mapHeight,
          transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Terrain layer */}
        {mapData.tiles.map((row, y) =>
          row.map((tile, x) => (
            <TileRenderer key={`${x}-${y}`} tile={tile} x={x} y={y} />
          ))
        )}

        {/* Buildings layer */}
        {mapData.buildings.map(building => (
          <BuildingRenderer key={building.id} building={building} />
        ))}

        {/* Agents layer */}
        {agents.map(agent => (
          <AgentSprite key={agent.id} agent={agent} />
        ))}

        {/* Tasks layer */}
        {tasks.map(task => (
          <TaskMarker key={task.id} task={task} />
        ))}

        {/* Event pings layer */}
        {pings.map(ping => (
          <EventPing key={ping.id} ping={ping} />
        ))}

        {/* Grid overlay for pixel aesthetic */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(74, 222, 128, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(74, 222, 128, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: `${tileSize}px ${tileSize}px`,
          }}
        />
      </motion.div>

      {/* HUD Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => {
            // Zoom in handled by parent via props if needed
          }}
          className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded flex items-center justify-center text-white text-sm font-bold border border-gray-600"
        >
          +
        </button>
        <button
          onClick={onResetCamera}
          className="px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-white text-xs border border-gray-600"
        >
          Reset
        </button>
        <button
          onClick={() => {
            // Zoom out handled by parent via props if needed
          }}
          className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded flex items-center justify-center text-white text-sm font-bold border border-gray-600"
        >
          −
        </button>
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 left-4 px-2 py-1 bg-gray-800/80 rounded text-white text-xs border border-gray-600">
        {Math.round(camera.zoom * 100)}%
      </div>

      {/* Map info */}
      <div className="absolute top-4 left-4 px-3 py-1 bg-gray-800/80 rounded text-white text-sm border border-gray-600">
        {GRID_WIDTH}×{GRID_HEIGHT} tiles ({TILE_SIZE}px each)
      </div>

      {/* Minimap */}
      <Minimap
        tiles={mapData.tiles}
        buildings={mapData.buildings}
        agents={agents}
        viewportPosition={{
          x: Math.max(0, -camera.x / tileSize),
          y: Math.max(0, -camera.y / tileSize),
        }}
      />
    </div>
  );
}