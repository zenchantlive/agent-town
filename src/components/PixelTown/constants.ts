// Pixel Town Constants - M1.1: Tile Size + Grid System
// Using 32x32 pixel tiles for that classic pixel-town feel

export const TILE_SIZE = 32;
export const GRID_WIDTH = 20;  // 20 tiles wide
export const GRID_HEIGHT = 15; // 15 tiles tall

// Terrain types for the tilemap
export const TerrainType = {
  GRASS: 'grass',
  STREET: 'street',
  WATER: 'water',
  PATH: 'path',
  BUILDING_FLOOR: 'building_floor',
} as const;

export type TerrainType = typeof TerrainType[keyof typeof TerrainType];

// Building types (landmarks)
export const BuildingType = {
  HQ: 'hq',
  WORKSHOP: 'workshop',
  MARKETPLACE: 'marketplace',
  TAVERN: 'tavern',
} as const;

export type BuildingType = typeof BuildingType[keyof typeof BuildingType];

// Camera settings
export const CAMERA = {
  MIN_ZOOM: 0.5,
  MAX_ZOOM: 2.0,
  DEFAULT_ZOOM: 1.0,
  ZOOM_STEP: 0.25,
} as const;

// Colors for pixel art aesthetic
export const PixelColors = {
  // Terrain
  GRASS_LIGHT: '#4ade80',
  GRASS_DARK: '#22c55e',
  STREET: '#374151',
  STREET_LIGHT: '#4b5563',
  WATER: '#1e3a5f',
  WATER_LIGHT: '#2563eb',
  PATH: '#78716c',

  // Buildings
  HQ: '#dc2626',
  HQ_ROOF: '#991b1b',
  WORKSHOP: '#f59e0b',
  WORKSHOP_ROOF: '#d97706',
  MARKETPLACE: '#8b5cf6',
  MARKETPLACE_ROOF: '#7c3aed',
  TAVERN: '#059669',
  TAVERN_ROOF: '#047857',

  // UI
  GRID_OVERLAY: 'rgba(74, 222, 128, 0.1)',
} as const;