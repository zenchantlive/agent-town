/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTilemap } from '../hooks/useTilemap';
import { TILE_SIZE, GRID_WIDTH, GRID_HEIGHT, TerrainType } from '../constants';

describe('useTilemap Hook', () => {
  it('should initialize with valid camera state', () => {
    const { result } = renderHook(() => useTilemap());

    expect(result.current.camera.zoom).toBe(1);
    expect(result.current.camera.x).toBe(0);
    expect(result.current.camera.y).toBe(0);
    expect(result.current.camera.isDragging).toBe(false);
  });

  it('should return correct tile size', () => {
    const { result } = renderHook(() => useTilemap());
    expect(result.current.tileSize).toBe(TILE_SIZE);
  });

  it('should generate valid map data structure', () => {
    const { result } = renderHook(() => useTilemap());
    const { mapData } = result.current;

    expect(mapData).toBeDefined();
    expect(mapData.tiles).toBeDefined();
    expect(mapData.buildings).toBeDefined();
    expect(mapData.width).toBe(GRID_WIDTH);
    expect(mapData.height).toBe(GRID_HEIGHT);
  });

  it('should generate correct number of tiles', () => {
    const { result } = renderHook(() => useTilemap());
    const { mapData } = result.current;

    expect(mapData.tiles.length).toBe(GRID_HEIGHT);
    mapData.tiles.forEach((row, index) => {
      expect(row.length).toBe(GRID_WIDTH);
    });
  });

  it('should generate tiles with valid position data', () => {
    const { result } = renderHook(() => useTilemap());
    const { mapData } = result.current;

    for (let y = 0; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const tile = mapData.tiles[y][x];
        expect(tile.position.x).toBe(x);
        expect(tile.position.y).toBe(y);
      }
    }
  });

  it('should generate buildings with valid data', () => {
    const { result } = renderHook(() => useTilemap());
    const { mapData } = result.current;

    expect(mapData.buildings.length).toBe(4);
    mapData.buildings.forEach(building => {
      expect(building.id).toBeDefined();
      expect(building.name).toBeDefined();
      expect(building.position.x).toBeGreaterThanOrEqual(0);
      expect(building.position.y).toBeGreaterThanOrEqual(0);
      expect(building.width).toBeGreaterThan(0);
      expect(building.height).toBeGreaterThan(0);
    });
  });

  it('should create street tiles in cross pattern (x=9,10 and y=7)', () => {
    const { result } = renderHook(() => useTilemap());
    const { mapData } = result.current;

    // Check vertical street (columns 9 and 10)
    for (let y = 0; y < GRID_HEIGHT; y++) {
      if (y !== 12) { // Exclude water area
        expect(mapData.tiles[y][9].terrain).toBe(TerrainType.STREET);
        expect(mapData.tiles[y][10].terrain).toBe(TerrainType.STREET);
      }
    }

    // Check horizontal street (row 7)
    expect(mapData.tiles[7][9].terrain).toBe(TerrainType.STREET);
    expect(mapData.tiles[7][10].terrain).toBe(TerrainType.STREET);
  });

  it('should create water tiles at bottom (y >= 12) except at street columns', () => {
    const { result } = renderHook(() => useTilemap());
    const { mapData } = result.current;

    // Check street columns remain streets even at y=12
    expect(mapData.tiles[12][9].terrain).toBe(TerrainType.STREET);
    expect(mapData.tiles[12][10].terrain).toBe(TerrainType.STREET);
    expect(mapData.tiles[13][9].terrain).toBe(TerrainType.STREET);
    expect(mapData.tiles[13][10].terrain).toBe(TerrainType.STREET);

    // Non-street columns should be water
    expect(mapData.tiles[12][0].terrain).toBe(TerrainType.WATER);
    expect(mapData.tiles[13][5].terrain).toBe(TerrainType.WATER);
    expect(mapData.tiles[14][8].terrain).toBe(TerrainType.WATER);
  });

  it('should mark water tiles as non-walkable', () => {
    const { result } = renderHook(() => useTilemap());
    const { mapData } = result.current;

    for (let x = 0; x < GRID_WIDTH; x++) {
      expect(mapData.tiles[12][x].isWalkable).toBe(false);
      expect(mapData.tiles[13][x].isWalkable).toBe(false);
      expect(mapData.tiles[14][x].isWalkable).toBe(false);
    }
  });

  it('should mark grass/street tiles as walkable', () => {
    const { result } = renderHook(() => useTilemap());
    const { mapData } = result.current;

    // Check some non-water tiles are walkable
    expect(mapData.tiles[0][0].isWalkable).toBe(true);
    expect(mapData.tiles[0][1].isWalkable).toBe(true);
    expect(mapData.tiles[7][8].isWalkable).toBe(true);
  });

  describe('Camera Controls', () => {
    it('should handle wheel zoom events', () => {
      const { result } = renderHook(() => useTilemap());

      // Zoom in
      act(() => {
        result.current.handleWheel({ deltaY: -100 } as React.WheelEvent);
      });
      expect(result.current.camera.zoom).toBeGreaterThan(1);

      // Zoom out
      act(() => {
        result.current.handleWheel({ deltaY: 100 } as React.WheelEvent);
      });
      expect(result.current.camera.zoom).toBeLessThanOrEqual(2);
    });

    it('should handle mouse drag events', () => {
      const { result } = renderHook(() => useTilemap());

      act(() => {
        result.current.handleMouseDown({ clientX: 100, clientY: 100, button: 0 } as React.MouseEvent);
      });
      expect(result.current.camera.isDragging).toBe(true);

      act(() => {
        result.current.handleMouseMove({ clientX: 150, clientY: 150 } as React.MouseEvent);
      });
      expect(result.current.camera.x).toBe(50);
      expect(result.current.camera.y).toBe(50);

      act(() => {
        result.current.handleMouseUp({} as React.MouseEvent);
      });
      expect(result.current.camera.isDragging).toBe(false);
    });

    it('should reset camera to default state', () => {
      const { result } = renderHook(() => useTilemap());

      // Move and zoom camera
      act(() => {
        result.current.handleMouseDown({ clientX: 0, clientY: 0, button: 0 } as React.MouseEvent);
      });
      act(() => {
        result.current.handleMouseMove({ clientX: 100, clientY: 100 } as React.MouseEvent);
      });
      act(() => {
        result.current.handleWheel({ deltaY: -100 } as React.WheelEvent);
      });

      // Reset
      act(() => {
        result.current.resetCamera();
      });

      expect(result.current.camera.x).toBe(0);
      expect(result.current.camera.y).toBe(0);
      expect(result.current.camera.zoom).toBe(1);
      expect(result.current.camera.isDragging).toBe(false);
    });
  });
});