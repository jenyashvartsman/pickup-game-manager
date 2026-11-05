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

export interface GameResultDto {
  id: string;
  gameId: string;
  scoreTeamA: number;
  scoreTeamB: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGameResultRequest {
  scoreTeamA: number;
  scoreTeamB: number;
}

export interface UpdateGameResultRequest {
  scoreTeamA?: number;
  scoreTeamB?: number;
}

export interface PlayerStatDto {
  id: string;
  gameId: string;
  playerId: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpsertPlayerStatRequest {
  playerId: string;
  goals?: number;
  assists?: number;
  yellowCards?: number;
  redCards?: number;
  minutesPlayed?: number;
}

export interface UpcomingGameDto {
  id: string;
  scheduledAt: Date;
  location: string | null;
  playerCount: number;
}

export interface RecentResultDto {
  id: string;
  scheduledAt: Date;
  location: string | null;
  scoreTeamA: number;
  scoreTeamB: number;
}

export interface TopPlayerDto {
  id: string;
  name: string;
  position: string;
  totalGoals: number;
  totalAssists: number;
}

export interface DashboardSummaryDto {
  upcomingGames: UpcomingGameDto[];
  recentResults: RecentResultDto[];
  topPlayers: TopPlayerDto[];
}
