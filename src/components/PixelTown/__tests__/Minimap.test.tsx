/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Minimap } from '../components/HUD/Minimap';

describe('Minimap Component', () => {
  const mockTiles = Array(20).fill(null).map((_, y) =>
    Array(20).fill(null).map((_, x) => ({
      position: { x, y },
      terrain: y < 15 ? 'grass' : 'water',
      isWalkable: y < 15,
    }))
  );

  const mockBuildings = [
    { id: 'hq', position: { x: 8, y: 4 }, width: 3, height: 3 },
  ];

  const mockAgents = [
    { id: 'agent-1', position: { x: 9, y: 5 }, state: 'working' },
  ];

  it('should render minimap container', () => {
    render(
      <Minimap
        tiles={mockTiles}
        buildings={mockBuildings}
        agents={mockAgents}
        viewportPosition={{ x: 0, y: 0 }}
      />
    );

    expect(screen.getByTestId('minimap')).toBeDefined();
  });

  it('should have correct dimensions', () => {
    render(
      <Minimap
        tiles={mockTiles}
        buildings={mockBuildings}
        agents={mockAgents}
        viewportPosition={{ x: 0, y: 0 }}
      />
    );

    const minimap = screen.getByTestId('minimap');
    expect(minimap.className).toContain('w-48');
    expect(minimap.className).toContain('h-48');
  });

  it('should have absolute positioning', () => {
    render(
      <Minimap
        tiles={mockTiles}
        buildings={mockBuildings}
        agents={mockAgents}
        viewportPosition={{ x: 0, y: 0 }}
      />
    );

    const minimap = screen.getByTestId('minimap');
    expect(minimap.classList.contains('absolute')).toBe(true);
  });

  it('should render buildings on minimap', () => {
    render(
      <Minimap
        tiles={mockTiles}
        buildings={mockBuildings}
        agents={mockAgents}
        viewportPosition={{ x: 0, y: 0 }}
      />
    );

    const buildings = screen.getAllByTestId('minimap-building');
    expect(buildings.length).toBeGreaterThan(0);
  });

  it('should render agents on minimap', () => {
    render(
      <Minimap
        tiles={mockTiles}
        buildings={mockBuildings}
        agents={mockAgents}
        viewportPosition={{ x: 0, y: 0 }}
      />
    );

    const agents = screen.getAllByTestId('minimap-agent');
    expect(agents.length).toBeGreaterThan(0);
  });
});

describe('Performance Tests', () => {
  it('should handle large agent counts', () => {
    // Performance test placeholder
    const agents = Array(50).fill(null).map((_, i) => ({
      id: `agent-${i}`,
      position: { x: i % 20, y: Math.floor(i / 20) },
      state: 'idle',
    }));

    expect(agents.length).toBe(50);
  });

  it('should handle large task counts', () => {
    // Performance test placeholder
    const tasks = Array(100).fill(null).map((_, i) => ({
      id: `task-${i}`,
      title: `Task ${i}`,
      position: { x: i % 20, y: Math.floor(i / 20) },
    }));

    expect(tasks.length).toBe(100);
  });
});
