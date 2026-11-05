import { GameStatus } from './enums';

export interface PlayerDto {
  id: string;
  name: string;
  position: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePlayerRequest {
  name: string;
  position: string;
}

export interface UpdatePlayerRequest {
  name?: string;
  position?: string;
}

export interface GameDto {
  id: string;
  scheduledAt: Date;
  location: string | null;
  status: GameStatus;
  players: PlayerDto[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGameRequest {
  scheduledAt: string;
  location?: string;
}

export interface UpdateGameRequest {
  scheduledAt?: string;
  location?: string;
  status?: GameStatus;
}

export interface AddToRosterRequest {
  playerId: string;
}
