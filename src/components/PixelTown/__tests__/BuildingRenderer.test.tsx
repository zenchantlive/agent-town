/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BuildingRenderer } from '../components/Landmarks/BuildingRenderer';
import { BuildingType } from '../constants';
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

describe('BuildingRenderer Component', () => {
  const createBuilding = (type: BuildingType, x: number, y: number) => ({
    id: type,
    type,
    position: { x, y },
    width: 2,
    height: 2,
    name: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
    description: `Test ${type} building`,
  });

  it('should render at correct pixel position', () => {
    const building = createBuilding(BuildingType.HQ, 5, 3);
    render(<BuildingRenderer building={building} />);

    const buildingElement = screen.getByTestId('building-renderer');
    expect(buildingElement.style.left).toBe(`${5 * TILE_SIZE}px`);
    expect(buildingElement.style.top).toBe(`${3 * TILE_SIZE}px`);
  });

  it('should render with correct dimensions', () => {
    const building = createBuilding(BuildingType.HQ, 0, 0);
    render(<BuildingRenderer building={building} />);

    const buildingElement = screen.getByTestId('building-renderer');
    expect(buildingElement.style.width).toBe(`${2 * TILE_SIZE}px`);
    expect(buildingElement.style.height).toBe(`${2 * TILE_SIZE}px`);
  });

  it('should render HQ building with correct colors', () => {
    const building = createBuilding(BuildingType.HQ, 0, 0);
    render(<BuildingRenderer building={building} />);

    const buildingBody = screen.getByTestId('building-body');
    expect(colorsMatch(buildingBody.style.backgroundColor, '#dc2626')).toBe(true);
  });

  it('should render Workshop building with correct colors', () => {
    const building = createBuilding(BuildingType.WORKSHOP, 0, 0);
    render(<BuildingRenderer building={building} />);

    const buildingBody = screen.getByTestId('building-body');
    expect(colorsMatch(buildingBody.style.backgroundColor, '#f59e0b')).toBe(true);
  });

  it('should render Marketplace building with correct colors', () => {
    const building = createBuilding(BuildingType.MARKETPLACE, 0, 0);
    render(<BuildingRenderer building={building} />);

    const buildingBody = screen.getByTestId('building-body');
    expect(colorsMatch(buildingBody.style.backgroundColor, '#8b5cf6')).toBe(true);
  });

  it('should render Tavern building with correct colors', () => {
    const building = createBuilding(BuildingType.TAVERN, 0, 0);
    render(<BuildingRenderer building={building} />);

    const buildingBody = screen.getByTestId('building-body');
    expect(colorsMatch(buildingBody.style.backgroundColor, '#059669')).toBe(true);
  });

  it('should include hover classes for label visibility', () => {
    const building = createBuilding(BuildingType.HQ, 0, 0);
    render(<BuildingRenderer building={building} />);

    const label = screen.getByTestId('building-label');

    // Label should be hidden by default and show on group-hover
    expect(label.className).toContain('opacity-0');
    expect(label.className).toContain('group-hover:opacity-100');
  });

  it('should have absolute positioning', () => {
    const building = createBuilding(BuildingType.HQ, 0, 0);
    render(<BuildingRenderer building={building} />);

    const buildingElement = screen.getByTestId('building-renderer');
    expect(buildingElement.classList.contains('absolute')).toBe(true);
  });

  it('should have pointer cursor', () => {
    const building = createBuilding(BuildingType.HQ, 0, 0);
    render(<BuildingRenderer building={building} />);

    const buildingElement = screen.getByTestId('building-renderer');
    expect(buildingElement.classList.contains('cursor-pointer')).toBe(true);
  });

  it('should have rounded corners on building body', () => {
    const building = createBuilding(BuildingType.HQ, 0, 0);
    render(<BuildingRenderer building={building} />);

    const buildingBody = screen.getByTestId('building-body');
    expect(buildingBody.classList.contains('rounded-sm')).toBe(true);
  });

  it('should include door element', () => {
    const building = createBuilding(BuildingType.HQ, 0, 0);
    render(<BuildingRenderer building={building} />);

    const door = screen.getByTestId('building-door');
    expect(door).toBeDefined();
  });

  it('should include window elements', () => {
    const building = createBuilding(BuildingType.HQ, 0, 0);
    render(<BuildingRenderer building={building} />);

    const windows = screen.getAllByTestId('building-window');
    expect(windows.length).toBeGreaterThan(0);
  });

  it('should have building shadow', () => {
    const building = createBuilding(BuildingType.HQ, 0, 0);
    render(<BuildingRenderer building={building} />);

    const shadow = screen.getByTestId('building-shadow');
    expect(shadow).toBeDefined();
  });
});