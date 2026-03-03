import { TerrainType, BuildingType } from './constants';

export interface TilePosition {
  x: number;
  y: number;
}

export interface TileData {
  position: TilePosition;
  terrain: TerrainType;
  isWalkable: boolean;
  hasBuilding?: boolean;
  buildingId?: string;
}

export interface BuildingData {
  id: string;
  type: BuildingType;
  position: TilePosition;
  width: number;  // in tiles
  height: number; // in tiles
  name: string;
  description: string;
}

export interface MapData {
  tiles: TileData[][];
  buildings: BuildingData[];
  width: number;
  height: number;
}

export interface CameraState {
  x: number;
  y: number;
  zoom: number;
  isDragging: boolean;
  lastMouseX: number;
  lastMouseY: number;
}

export enum AgentDirection {
  NORTH = 'north',
  SOUTH = 'south',
  EAST = 'east',
  WEST = 'west',
}

export enum AgentState {
  IDLE = 'idle',
  WORKING = 'working',
  BLOCKED = 'blocked',
  SUCCESS = 'success',
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum PingType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export interface AgentData {
  id: string;
  name: string;
  position: TilePosition;
  direction: AgentDirection;
  state: AgentState;
  taskId: string | null;
}

export interface TaskData {
  id: string;
  title: string;
  status: TaskStatus;
  position: TilePosition;
  assigneeId: string | null;
}

export interface PingData {
  id: string;
  type: PingType;
  message: string;
  position: TilePosition;
  timestamp: number;
}