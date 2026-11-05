// Domain types for pickup-game-manager
// Shared between Angular frontend and NestJS backend

export type PlayerPosition = 'goalkeeper' | 'defender' | 'midfielder' | 'forward';

export type GameStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Player {
  id: number;
  name: string;
  position: PlayerPosition;
  createdAt: string;
  updatedAt: string;
}

export interface Game {
  id: number;
  date: string;
  time: string;
  location: string;
  status: GameStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GameResult {
  id: number;
  gameId: number;
  homeScore: number;
  awayScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerStat {
  id: number;
  gameId: number;
  playerId: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  createdAt: string;
  updatedAt: string;
}

export interface GameRoster {
  gameId: number;
  playerId: number;
}
