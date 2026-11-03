// Domain types for pickup-game-manager
// Shared between Angular frontend and NestJS backend

export { GameStatus, AuditAction } from './lib/enums';

export type PlayerPosition = 'goalkeeper' | 'defender' | 'midfielder' | 'forward';

export interface Player {
  id: string;
  name: string;
  position: PlayerPosition;
  createdAt: string;
  updatedAt: string;
}

export interface Game {
  id: string;
  scheduledAt: string;
  location: string | null;
  status: GameStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GameResult {
  id: string;
  gameId: string;
  scoreTeamA: number;
  scoreTeamB: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerStat {
  id: string;
  gameId: string;
  playerId: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  createdAt: string;
  updatedAt: string;
}

export interface GameRoster {
  gameId: string;
  playerId: string;
}
