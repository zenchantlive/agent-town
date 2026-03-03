/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TileRenderer } from '../components/Terrain/TileRenderer';
import { TerrainType } from '../constants';
import { TILE_SIZE } from '../constants';

// Helper to normalize color comparison (handles hex vs rgb)
const hexToRgb = (hex: string) => {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
};
const colorsMatch = (a: string, b: string) => {
  const expected = b.startsWith('#') ? hexToRgb(b) : b;
  return a.replace(/\s+/g, '') === expected.replace(/\s+/g, '');
};

describe('TileRenderer Component', () => {
  const createTile = (terrain: TerrainType, x: number, y: number) => ({
    position: { x, y },
    terrain,
    isWalkable: terrain !== TerrainType.WATER,
  });

  it('should render at correct pixel position', () => {
    const tile = createTile(TerrainType.GRASS, 5, 3);
    render(<TileRenderer tile={tile} x={5} y={3} />);

    const tileElement = screen.getByTestId('tile-renderer');
    expect(tileElement.style.left).toBe(`${5 * TILE_SIZE}px`);
    expect(tileElement.style.top).toBe(`${3 * TILE_SIZE}px`);
  });

  it('should render with correct dimensions', () => {
    const tile = createTile(TerrainType.GRASS, 0, 0);
    render(<TileRenderer tile={tile} x={0} y={0} />);

    const tileElement = screen.getByTestId('tile-renderer');
    expect(tileElement.style.width).toBe(`${TILE_SIZE}px`);
    expect(tileElement.style.height).toBe(`${TILE_SIZE}px`);
  });

  it('should render grass tile with grass color', () => {
    const tile = createTile(TerrainType.GRASS, 0, 0);
    render(<TileRenderer tile={tile} x={0} y={0} />);

    const tileElement = screen.getByTestId('tile-renderer');
    // Grass alternates between light and dark based on position
    const expectedColor = (0 + 0) % 2 === 0 ? '#4ade80' : '#22c55e';
    expect(colorsMatch(tileElement.style.backgroundColor, expectedColor)).toBe(true);
  });

  it('should render street tile with street color', () => {
    const tile = createTile(TerrainType.STREET, 0, 0);
    render(<TileRenderer tile={tile} x={0} y={0} />);

    const tileElement = screen.getByTestId('tile-renderer');
    expect(colorsMatch(tileElement.style.backgroundColor, '#374151')).toBe(true);
  });

  it('should render water tile with water color', () => {
    const tile = createTile(TerrainType.WATER, 0, 0);
    render(<TileRenderer tile={tile} x={0} y={0} />);

    const tileElement = screen.getByTestId('tile-renderer');
    expect(colorsMatch(tileElement.style.backgroundColor, '#1e3a5f')).toBe(true);
  });

  it('should render path tile with path color', () => {
    const tile = createTile(TerrainType.PATH, 0, 0);
    render(<TileRenderer tile={tile} x={0} y={0} />);

    const tileElement = screen.getByTestId('tile-renderer');
    expect(colorsMatch(tileElement.style.backgroundColor, '#78716c')).toBe(true);
  });

  it('should alternate grass color pattern', () => {
    const evenTile = createTile(TerrainType.GRASS, 0, 0);
    const oddTile = createTile(TerrainType.GRASS, 1, 0);

    render(
      <>
        <TileRenderer tile={evenTile} x={0} y={0} />
        <TileRenderer tile={oddTile} x={1} y={0} />
      </>
    );

    const tiles = screen.getAllByTestId('tile-renderer');
    expect(tiles[0].style.backgroundColor).not.toBe(tiles[1].style.backgroundColor);
  });

  it('should alternate water color pattern', () => {
    const evenTile = createTile(TerrainType.WATER, 0, 0);
    const oddTile = createTile(TerrainType.WATER, 0, 1);

    render(
      <>
        <TileRenderer tile={evenTile} x={0} y={0} />
        <TileRenderer tile={oddTile} x={0} y={1} />
      </>
    );

    const tiles = screen.getAllByTestId('tile-renderer');
    expect(tiles[0].style.backgroundColor).not.toBe(tiles[1].style.backgroundColor);
  });

  it('should have absolute positioning', () => {
    const tile = createTile(TerrainType.GRASS, 2, 2);
    render(<TileRenderer tile={tile} x={2} y={2} />);

    const tileElement = screen.getByTestId('tile-renderer');
    expect(tileElement.classList.contains('absolute')).toBe(true);
  });

  it('should have overflow hidden', () => {
    const tile = createTile(TerrainType.GRASS, 0, 0);
    render(<TileRenderer tile={tile} x={0} y={0} />);

    const tileElement = screen.getByTestId('tile-renderer');
    expect(tileElement.classList.contains('overflow-hidden')).toBe(true);
  });
});