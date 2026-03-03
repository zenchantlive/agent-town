'use client';

import React from 'react';
import { BuildingData } from '../../types';
import { TILE_SIZE, PixelColors, BuildingType } from '../../constants';

interface BuildingRendererProps {
  building: BuildingData;
}

export function BuildingRenderer({ building }: BuildingRendererProps) {
  const left = building.position.x * TILE_SIZE;
  const top = building.position.y * TILE_SIZE;
  const width = building.width * TILE_SIZE;
  const height = building.height * TILE_SIZE;

  // Get building colors based on type
  const getBuildingColors = () => {
    switch (building.type) {
      case BuildingType.HQ:
        return { wall: PixelColors.HQ, roof: PixelColors.HQ_ROOF };
      case BuildingType.WORKSHOP:
        return { wall: PixelColors.WORKSHOP, roof: PixelColors.WORKSHOP_ROOF };
      case BuildingType.MARKETPLACE:
        return { wall: PixelColors.MARKETPLACE, roof: PixelColors.MARKETPLACE_ROOF };
      case BuildingType.TAVERN:
        return { wall: PixelColors.TAVERN, roof: PixelColors.TAVERN_ROOF };
      default:
        return { wall: PixelColors.HQ, roof: PixelColors.HQ_ROOF };
    }
  };

  const colors = getBuildingColors();

  return (
    <div
      data-testid="building-renderer"
      className="absolute cursor-pointer group"
      style={{
        left,
        top,
        width,
        height,
      }}
    >
      {/* Building shadow */}
      <div
        data-testid="building-shadow"
        className="absolute inset-0 bg-black/30 translate-x-1 translate-y-1 rounded-sm"
        style={{ width: width - 4, height: height - 4 }}
      />

      {/* Main building body */}
      <div
        data-testid="building-body"
        className="absolute inset-0 rounded-sm border-2 border-black/20"
        style={{
          backgroundColor: colors.wall,
        }}
      >
        {/* Roof section */}
        <div
          data-testid="building-roof"
          className="absolute top-0 left-0 right-0 h-4 rounded-t-sm"
          style={{ backgroundColor: colors.roof }}
        />

        {/* Windows */}
        <div className="absolute top-6 left-2 flex gap-1">
          {Array.from({ length: Math.max(1, Math.floor(building.width / 2)) }).map((_, i) => (
            <div
              key={i}
              data-testid="building-window"
              className="w-3 h-4 bg-yellow-300/50 rounded-sm border border-black/30"
            />
          ))}
        </div>

        {/* Door */}
        <div
          data-testid="building-door"
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-5 bg-amber-900/70 rounded-t-sm border border-black/30"
          style={{ width: TILE_SIZE - 8 }}
        />
      </div>

      {/* Building label */}
      <div
        data-testid="building-label"
        className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/70 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {building.name}
      </div>
    </div>
  );
}