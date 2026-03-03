/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TaskMarker } from '../components/Markers/TaskMarker';
import { TaskStatus } from '../types';

describe('TaskMarker Component', () => {
  const createTaskMarker = (status: TaskStatus = TaskStatus.PENDING, overrides = {}) => ({
    id: 'task-1',
    title: 'Build Workshop',
    status,
    position: { x: 5, y: 3 },
    assigneeId: null,
    ...overrides,
  });

  it('should render at correct pixel position (centered)', () => {
    const task = createTaskMarker();
    render(<TaskMarker task={task} />);

    const marker = screen.getByTestId('task-marker');
    // Centered position: 5 * 32 + 16 = 176px
    expect(marker.style.left).toBe('176px');
    expect(marker.style.top).toBe('112px');
  });

  it('should render pending task with correct color', () => {
    const task = createTaskMarker(TaskStatus.PENDING);
    render(<TaskMarker task={task} />);

    const marker = screen.getByTestId('task-marker');
    expect(marker.className).toContain('task-pending');
  });

  it('should render in-progress task with correct color', () => {
    const task = createTaskMarker(TaskStatus.IN_PROGRESS);
    render(<TaskMarker task={task} />);

    const marker = screen.getByTestId('task-marker');
    expect(marker.className).toContain('task-in-progress');
  });

  it('should render completed task with correct color', () => {
    const task = createTaskMarker(TaskStatus.COMPLETED);
    render(<TaskMarker task={task} />);

    const marker = screen.getByTestId('task-marker');
    expect(marker.className).toContain('task-completed');
  });

  it('should show task tooltip element', () => {
    const task = createTaskMarker();
    render(<TaskMarker task={task} />);

    const tooltip = screen.getByTestId('task-tooltip');
    expect(tooltip).toBeDefined();
  });

  it('should have absolute positioning', () => {
    const task = createTaskMarker();
    render(<TaskMarker task={task} />);

    const marker = screen.getByTestId('task-marker');
    expect(marker.classList.contains('absolute')).toBe(true);
  });

  it('should have z-index above terrain', () => {
    const task = createTaskMarker();
    render(<TaskMarker task={task} />);

    const marker = screen.getByTestId('task-marker');
    expect(marker.classList.contains('z-5')).toBe(true);
  });
});

describe('PathRenderer Component', () => {
  it('should render path between two points', () => {
    // PathRenderer will be tested when implemented
    // This is a placeholder for TDD
  });

  it('should animate path segments', () => {
    // Path animation tests
  });
});
