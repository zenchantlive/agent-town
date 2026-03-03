'use client';

import { useState, useCallback } from 'react';
import { PingData, PingType, TilePosition } from '../types';

interface UsePingsOptions {
  initialPings?: PingData[];
}

export function usePings(options: UsePingsOptions = {}) {
  const [pings, setPings] = useState<PingData[]>(options.initialPings || [
    {
      id: 'ping-1',
      type: PingType.SUCCESS,
      message: 'Task completed!',
      position: { x: 9, y: 4 },
      timestamp: Date.now(),
    },
    {
      id: 'ping-2',
      type: PingType.INFO,
      message: 'Agent dispatched',
      position: { x: 12, y: 7 },
      timestamp: Date.now(),
    },
  ]);

  const addPing = useCallback((ping: Omit<PingData, 'id' | 'timestamp'>) => {
    const newPing: PingData = {
      ...ping,
      id: `ping-${Date.now()}`,
      timestamp: Date.now(),
    };
    setPings(prev => [...prev, newPing]);
  }, []);

  const removePing = useCallback((id: string) => {
    setPings(prev => prev.filter(p => p.id !== id));
  }, []);

  const clearPings = useCallback(() => {
    setPings([]);
  }, []);

  return {
    pings,
    addPing,
    removePing,
    clearPings,
  };
}
