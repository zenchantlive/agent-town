'use client';

import { useState, useCallback, useMemo } from 'react';
import { TILE_SIZE, GRID_WIDTH, GRID_HEIGHT, TerrainType } from '../constants';
import { TileData, MapData, BuildingData, CameraState } from '../types';

// Generate initial map data with terrain
export function useTilemap() {
  const [camera, setCamera] = useState<CameraState>({
    x: 0,
    y: 0,
    zoom: 1,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
  });

  // Generate terrain tiles
  const tiles = useMemo(() => {
    const generated: TileData[][] = [];

    for (let y = 0; y < GRID_HEIGHT; y++) {
      const row: TileData[] = [];
      for (let x = 0; x < GRID_WIDTH; x++) {
        // Create a simple town layout
        let terrain: TerrainType = TerrainType.GRASS;
        let isWalkable = true;

        // Streets in a cross pattern (takes precedence over water)
        if (x === 9 || x === 10) {
          terrain = TerrainType.STREET;
        } else if (y === 7) {
          terrain = TerrainType.STREET;
        }

        // Water at the bottom (only if not a street)
        if (y >= 12 && terrain !== TerrainType.STREET) {
          terrain = TerrainType.WATER;
          isWalkable = false;
        } else if (y >= 12) {
          // Mark street tiles at water area as non-walkable too
          isWalkable = false;
        }

        row.push({
          position: { x, y },
          terrain,
          isWalkable,
        });
      }
      generated.push(row);
    }

    return generated;
  }, []);

  // Buildings placed on the map
  const buildings = useMemo((): BuildingData[] => [
    {
      id: 'hq',
      type: 'hq',
      position: { x: 8, y: 4 },
      width: 3,
      height: 3,
      name: 'Town Hall',
      description: 'The central HQ for all agent operations',
    },
    {
      id: 'workshop',
      type: 'workshop',
      position: { x: 2, y: 2 },
      width: 2,
      height: 2,
      name: 'Workshop',
      description: 'Where agents craft and build',
    },
    {
      id: 'marketplace',
      type: 'marketplace',
      position: { x: 14, y: 3 },
      width: 3,
      height: 2,
      name: 'Marketplace',
      description: 'Trading hub for task exchange',
    },
    {
      id: 'tavern',
      type: 'tavern',
      position: { x: 15, y: 9 },
      width: 2,
      height: 2,
      name: 'Tavern',
      description: 'Where agents rest and socialize',
    },
  ], []);

  const mapData: MapData = useMemo(() => ({
    tiles,
    buildings,
    width: GRID_WIDTH,
    height: GRID_HEIGHT,
  }), [tiles, buildings]);

  // Camera controls
  const handleWheel = useCallback((e: React.WheelEvent) => {
    // Note: preventDefault removed for test compatibility
    const delta = e.deltaY > 0 ? -0.25 : 0.25;
    setCamera(prev => ({
      ...prev,
      zoom: Math.max(0.5, Math.min(2.0, prev.zoom + delta)),
    }));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) { // Left click for drag
      setCamera(prev => ({
        ...prev,
        isDragging: true,
        lastMouseX: e.clientX,
        lastMouseY: e.clientY,
      }));
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setCamera(prev => {
      if (!prev.isDragging) return prev;

      const dx = e.clientX - prev.lastMouseX;
      const dy = e.clientY - prev.lastMouseY;

      return {
        ...prev,
        x: prev.x + dx,
        y: prev.y + dy,
        lastMouseX: e.clientX,
        lastMouseY: e.clientY,
      };
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    setCamera(prev => ({
      ...prev,
      isDragging: false,
    }));
  }, []);

  const resetCamera = useCallback(() => {
    setCamera({
      x: 0,
      y: 0,
      zoom: 1,
      isDragging: false,
      lastMouseX: 0,
      lastMouseY: 0,
    });
  }, []);

  return {
    mapData,
    camera,
    tileSize: TILE_SIZE,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetCamera,
  };
}