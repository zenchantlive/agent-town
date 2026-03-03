/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EventPing } from '../components/HUD/EventPing';
import { PingType } from '../types';

describe('EventPing Component', () => {
  const createPing = (type: PingType = PingType.INFO, overrides = {}) => ({
    id: 'ping-1',
    type,
    message: 'Task completed!',
    position: { x: 5, y: 3 },
    timestamp: Date.now(),
    ...overrides,
  });

  it('should render at correct pixel position (centered)', () => {
    const ping = createPing();
    render(<EventPing ping={ping} />);

    const pingElement = screen.getByTestId('event-ping');
    // Centered position: 5 * 32 + 16 = 176px
    expect(pingElement.style.left).toBe('176px');
    expect(pingElement.style.top).toBe('96px');
  });

  it('should render info ping with correct color', () => {
    const ping = createPing(PingType.INFO);
    render(<EventPing ping={ping} />);

    const pingElement = screen.getByTestId('event-ping');
    expect(pingElement.className).toContain('ping-info');
  });

  it('should render success ping with correct color', () => {
    const ping = createPing(PingType.SUCCESS);
    render(<EventPing ping={ping} />);

    const pingElement = screen.getByTestId('event-ping');
    expect(pingElement.className).toContain('ping-success');
  });

  it('should render warning ping with correct color', () => {
    const ping = createPing(PingType.WARNING);
    render(<EventPing ping={ping} />);

    const pingElement = screen.getByTestId('event-ping');
    expect(pingElement.className).toContain('ping-warning');
  });

  it('should render error ping with correct color', () => {
    const ping = createPing(PingType.ERROR);
    render(<EventPing ping={ping} />);

    const pingElement = screen.getByTestId('event-ping');
    expect(pingElement.className).toContain('ping-error');
  });

  it('should show message text', () => {
    const ping = createPing(PingType.INFO, { message: 'Test message' });
    render(<EventPing ping={ping} />);

    expect(screen.getByText('Test message')).toBeDefined();
  });

  it('should have absolute positioning', () => {
    const ping = createPing();
    render(<EventPing ping={ping} />);

    const pingElement = screen.getByTestId('event-ping');
    expect(pingElement.classList.contains('absolute')).toBe(true);
  });
});

describe('HUD Component', () => {
  it('should render agent count', () => {
    // HUD tests when implemented
  });

  it('should render task summary', () => {
    // HUD tests when implemented
  });

  it('should render minimap', () => {
    // HUD tests when implemented
  });
});
