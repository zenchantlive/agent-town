/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import {
  TILE_SIZE,
  GRID_WIDTH,
  GRID_HEIGHT,
  TerrainType,
  BuildingType,
  CAMERA,
  PixelColors,
} from '../constants';

describe('PixelTown Constants', () => {
  describe('Tile Configuration', () => {
    it('should have 32x32 pixel tiles', () => {
      expect(TILE_SIZE).toBe(32);
    });

    it('should have 20x15 grid dimensions', () => {
      expect(GRID_WIDTH).toBe(20);
      expect(GRID_HEIGHT).toBe(15);
    });

    it('should calculate total tile count correctly', () => {
      expect(GRID_WIDTH * GRID_HEIGHT).toBe(300);
    });
  });

  describe('Terrain Types', () => {
    it('should define all required terrain types', () => {
      expect(TerrainType.GRASS).toBe('grass');
      expect(TerrainType.STREET).toBe('street');
      expect(TerrainType.WATER).toBe('water');
      expect(TerrainType.PATH).toBe('path');
      expect(TerrainType.BUILDING_FLOOR).toBe('building_floor');
    });

    it('should have exactly 5 terrain types', () => {
      const terrainKeys = Object.keys(TerrainType);
      expect(terrainKeys.length).toBe(5);
    });
  });

  describe('Building Types', () => {
    it('should define all required building types', () => {
      expect(BuildingType.HQ).toBe('hq');
      expect(BuildingType.WORKSHOP).toBe('workshop');
      expect(BuildingType.MARKETPLACE).toBe('marketplace');
      expect(BuildingType.TAVERN).toBe('tavern');
    });

    it('should have exactly 4 landmark building types', () => {
      const buildingKeys = Object.keys(BuildingType);
      expect(buildingKeys.length).toBe(4);
    });
  });

  describe('Camera Settings', () => {
    it('should have valid zoom range', () => {
      expect(CAMERA.MIN_ZOOM).toBeLessThan(CAMERA.MAX_ZOOM);
      expect(CAMERA.MIN_ZOOM).toBe(0.5);
      expect(CAMERA.MAX_ZOOM).toBe(2.0);
      expect(CAMERA.DEFAULT_ZOOM).toBe(1.0);
    });

    it('should have positive zoom step', () => {
      expect(CAMERA.ZOOM_STEP).toBeGreaterThan(0);
    });
  });

  describe('Pixel Colors', () => {
    it('should have terrain colors defined', () => {
      expect(PixelColors.GRASS_LIGHT).toBeDefined();
      expect(PixelColors.GRASS_DARK).toBeDefined();
      expect(PixelColors.STREET).toBeDefined();
      expect(PixelColors.WATER).toBeDefined();
    });

    it('should have building colors for each type', () => {
      expect(PixelColors.HQ).toBeDefined();
      expect(PixelColors.HQ_ROOF).toBeDefined();
      expect(PixelColors.WORKSHOP).toBeDefined();
      expect(PixelColors.WORKSHOP_ROOF).toBeDefined();
      expect(PixelColors.MARKETPLACE).toBeDefined();
      expect(PixelColors.MARKETPLACE_ROOF).toBeDefined();
      expect(PixelColors.TAVERN).toBeDefined();
      expect(PixelColors.TAVERN_ROOF).toBeDefined();
    });

    it('should have valid color format (hex or rgba)', () => {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      const rgbaColorRegex = /^rgba?\(.+\)$/;
      Object.values(PixelColors).forEach(color => {
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$|^rgba?\(.+\)$/);
      });
    });
  });
});