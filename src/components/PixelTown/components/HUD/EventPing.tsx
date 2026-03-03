'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PingData, PingType } from '../../types';
import { TILE_SIZE } from '../../constants';

interface EventPingProps {
  ping: PingData;
}

const PING_TYPE_CLASSES: Record<PingType, string> = {
  [PingType.INFO]: 'ping-info',
  [PingType.SUCCESS]: 'ping-success',
  [PingType.WARNING]: 'ping-warning',
  [PingType.ERROR]: 'ping-error',
};

const PING_COLORS: Record<PingType, string> = {
  [PingType.INFO]: '#3b82f6',     // Blue
  [PingType.SUCCESS]: '#22c55e',  // Green
  [PingType.WARNING]: '#eab308',  // Yellow
  [PingType.ERROR]: '#ef4444',    // Red
};

const PING_ICONS: Record<PingType, string> = {
  [PingType.INFO]: 'ℹ️',
  [PingType.SUCCESS]: '✅',
  [PingType.WARNING]: '⚠️',
  [PingType.ERROR]: '❌',
};

export function EventPing({ ping }: EventPingProps) {
  const left = ping.position.x * TILE_SIZE + TILE_SIZE / 2;
  const top = ping.position.y * TILE_SIZE;
  const pingClass = PING_TYPE_CLASSES[ping.type] || PING_TYPE_CLASSES[PingType.INFO];
  const pingColor = PING_COLORS[ping.type] || PING_COLORS[PingType.INFO];
  const pingIcon = PING_ICONS[ping.type] || PING_ICONS[PingType.INFO];

  return (
    <motion.div
      data-testid="event-ping"
      className={`absolute z-20 ${pingClass}`}
      style={{
        left: `${left}px`,
        top: `${top}px`,
        transform: 'translate(-50%, -100%)',
      }}
      initial={{ scale: 0, y: 10, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0, y: -10, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      {/* Ping bubble */}
      <div
        className="px-3 py-2 rounded-lg shadow-lg border border-white/20"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      >
        <div className="flex items-center gap-2">
          <span>{pingIcon}</span>
          <span className="text-white text-sm whitespace-nowrap">{ping.message}</span>
        </div>
      </div>

      {/* Ping stem */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      />
    </motion.div>
  );
}

// Auto-dismissing ping wrapper
interface EventPingWrapperProps {
  ping: PingData;
  onDismiss?: (id: string) => void;
  duration?: number;
}

export function EventPingWrapper({ ping, onDismiss, duration = 3000 }: EventPingWrapperProps) {
  React.useEffect(() => {
    if (onDismiss) {
      const timer = setTimeout(() => {
        onDismiss(ping.id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [ping.id, onDismiss, duration]);

  return (
    <AnimatePresence>
      <EventPing ping={ping} />
    </AnimatePresence>
  );
}
