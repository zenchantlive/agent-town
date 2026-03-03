'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TileData } from '../../types';
import { TILE_SIZE, PixelColors, TerrainType } from '../../constants';

interface TileRendererProps {
  tile: TileData;
  x: number;
  y: number;
}

export function TileRenderer({ tile, x, y }: TileRendererProps) {
  const left = x * TILE_SIZE;
  const top = y * TILE_SIZE;

  // Get terrain color based on type
  const getTerrainColor = () => {
    switch (tile.terrain) {
      case TerrainType.GRASS:
        return (x + y) % 2 === 0 ? PixelColors.GRASS_LIGHT : PixelColors.GRASS_DARK;
      case TerrainType.STREET:
        return (x + y) % 2 === 0 ? PixelColors.STREET : PixelColors.STREET_LIGHT;
      case TerrainType.WATER:
        return (y % 2 === 0) ? PixelColors.WATER : PixelColors.WATER_LIGHT;
      case TerrainType.PATH:
        return PixelColors.PATH;
      default:
        return PixelColors.GRASS_LIGHT;
    }
  };

  const color = getTerrainColor();

  // Add subtle pixel pattern
  const isPatterned = tile.terrain === TerrainType.GRASS || tile.terrain === TerrainType.WATER;

  return (
    <div
      data-testid="tile-renderer"
      className="absolute overflow-hidden"
      style={{
        left,
        top,
        width: TILE_SIZE,
        height: TILE_SIZE,
        backgroundColor: color,
        boxShadow: 'inset 0 0 2px rgba(0,0,0,0.1)',
      }}
    >
      {/* Pixel pattern overlay for texture */}
      {isPatterned && (
        <svg
          width={TILE_SIZE}
          height={TILE_SIZE}
          className="absolute inset-0 opacity-20"
        >
          <pattern id={`pattern-${tile.terrain}-${x}-${y}`} width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="1" fill={PixelColors.GRID_OVERLAY} />
          </pattern>
          <rect width="100%" height="100%" fill={`url(#pattern-${tile.terrain}-${x}-${y})`} />
        </svg>
      )}

      {/* Water animation effect */}
      {tile.terrain === TerrainType.WATER && (
        <motion.div
          className="absolute inset-0 bg-blue-400/20"
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      )}
    </div>
  );
}