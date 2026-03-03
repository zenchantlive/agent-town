/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AgentSprite } from '../components/Agents/AgentSprite';
import { AgentState, AgentDirection } from '../types';

describe('AgentSprite Component', () => {
  const createAgent = (overrides = {}) => ({
    id: 'agent-1',
    name: 'Test Agent',
    position: { x: 5, y: 5 },
    direction: AgentDirection.SOUTH,
    state: AgentState.IDLE,
    taskId: null,
    ...overrides,
  });

  it('should render agent at correct pixel position', () => {
    const agent = createAgent({ position: { x: 5, y: 3 } });
    render(<AgentSprite agent={agent} />);

    const sprite = screen.getByTestId('agent-sprite');
    expect(sprite.style.left).toBe('160px'); // 5 * 32
    expect(sprite.style.top).toBe('96px'); // 3 * 32
  });

  it('should render with correct dimensions', () => {
    const agent = createAgent();
    render(<AgentSprite agent={agent} />);

    const sprite = screen.getByTestId('agent-sprite');
    expect(sprite.style.width).toBe('32px');
    expect(sprite.style.height).toBe('32px');
  });

  it('should apply correct CSS class for facing NORTH', () => {
    const agent = createAgent({ direction: AgentDirection.NORTH });
    render(<AgentSprite agent={agent} />);

    const sprite = screen.getByTestId('agent-sprite');
    expect(sprite.className).toContain('agent-facing-north');
  });

  it('should apply correct CSS class for facing SOUTH', () => {
    const agent = createAgent({ direction: AgentDirection.SOUTH });
    render(<AgentSprite agent={agent} />);

    const sprite = screen.getByTestId('agent-sprite');
    expect(sprite.className).toContain('agent-facing-south');
  });

  it('should apply correct CSS class for facing EAST', () => {
    const agent = createAgent({ direction: AgentDirection.EAST });
    render(<AgentSprite agent={agent} />);

    const sprite = screen.getByTestId('agent-sprite');
    expect(sprite.className).toContain('agent-facing-east');
  });

  it('should apply correct CSS class for facing WEST', () => {
    const agent = createAgent({ direction: AgentDirection.WEST });
    render(<AgentSprite agent={agent} />);

    const sprite = screen.getByTestId('agent-sprite');
    expect(sprite.className).toContain('agent-facing-west');
  });

  it('should apply idle state class when idle', () => {
    const agent = createAgent({ state: AgentState.IDLE });
    render(<AgentSprite agent={agent} />);

    const sprite = screen.getByTestId('agent-sprite');
    expect(sprite.className).toContain('agent-state-idle');
  });

  it('should apply working state class when working', () => {
    const agent = createAgent({ state: AgentState.WORKING });
    render(<AgentSprite agent={agent} />);

    const sprite = screen.getByTestId('agent-sprite');
    expect(sprite.className).toContain('agent-state-working');
  });

  it('should apply blocked state class when blocked', () => {
    const agent = createAgent({ state: AgentState.BLOCKED });
    render(<AgentSprite agent={agent} />);

    const sprite = screen.getByTestId('agent-sprite');
    expect(sprite.className).toContain('agent-state-blocked');
  });

  it('should apply success state class when success', () => {
    const agent = createAgent({ state: AgentState.SUCCESS });
    render(<AgentSprite agent={agent} />);

    const sprite = screen.getByTestId('agent-sprite');
    expect(sprite.className).toContain('agent-state-success');
  });

  it('should render agent name', () => {
    const agent = createAgent({ name: 'My Agent' });
    render(<AgentSprite agent={agent} />);

    expect(screen.getByText('My Agent')).toBeDefined();
  });

  it('should have absolute positioning', () => {
    const agent = createAgent();
    render(<AgentSprite agent={agent} />);

    const sprite = screen.getByTestId('agent-sprite');
    expect(sprite.classList.contains('absolute')).toBe(true);
  });

  it('should have z-index above terrain', () => {
    const agent = createAgent();
    render(<AgentSprite agent={agent} />);

    const sprite = screen.getByTestId('agent-sprite');
    expect(sprite.classList.contains('z-10')).toBe(true);
  });
});
