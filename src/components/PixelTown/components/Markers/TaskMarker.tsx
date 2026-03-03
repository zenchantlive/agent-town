'use client';

import React from 'react';
import { TaskData, TaskStatus } from '../../types';
import { TILE_SIZE } from '../../constants';

interface TaskMarkerProps {
  task: TaskData;
}

const STATUS_CLASSES: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: 'task-pending',
  [TaskStatus.IN_PROGRESS]: 'task-in-progress',
  [TaskStatus.COMPLETED]: 'task-completed',
};

const STATUS_COLORS: Record<TaskStatus, string> = {
  [TaskStatus.PENDING]: '#a855f7',    // Purple
  [TaskStatus.IN_PROGRESS]: '#3b82f6', // Blue
  [TaskStatus.COMPLETED]: '#22c55e',   // Green
};

export function TaskMarker({ task }: TaskMarkerProps) {
  const left = task.position.x * TILE_SIZE + TILE_SIZE / 2;
  const top = task.position.y * TILE_SIZE + TILE_SIZE / 2;
  const statusClass = STATUS_CLASSES[task.status] || STATUS_CLASSES[TaskStatus.PENDING];
  const statusColor = STATUS_COLORS[task.status] || STATUS_COLORS[TaskStatus.PENDING];

  return (
    <div
      data-testid="task-marker"
      className={`absolute z-5 transition-all duration-200 group ${statusClass}`}
      style={{
        left: `${left}px`,
        top: `${top}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Task marker pin */}
      <div
        className="w-4 h-4 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-125 transition-transform"
        style={{ backgroundColor: statusColor }}
      >
        {/* Pulse animation for in-progress */}
        {task.status === TaskStatus.IN_PROGRESS && (
          <div
            className="absolute inset-0 rounded-full animate-ping opacity-75"
            style={{ backgroundColor: statusColor }}
          />
        )}
      </div>

      {/* Task tooltip */}
      <div
        data-testid="task-tooltip"
        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900/90 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
      >
        {task.title}
      </div>
    </div>
  );
}
