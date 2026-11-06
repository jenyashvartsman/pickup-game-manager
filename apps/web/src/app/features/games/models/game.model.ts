export type GameStatus = 'scheduled' | 'completed' | 'cancelled';

export interface GamePlayer {
  id: string;
  name: string;
  position: string;
}

export interface Game {
  id: string;
  scheduledAt: string;
  location: string | null;
  status: GameStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GameDetail extends Game {
  players: GamePlayer[];
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

export interface GameResult {
  id: string;
  gameId: string;
  scoreTeamA: number;
  scoreTeamB: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGameResultRequest {
  scoreTeamA: number;
  scoreTeamB: number;
}

export interface UpdateGameResultRequest {
  scoreTeamA?: number;
  scoreTeamB?: number;
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

export interface UpsertPlayerStatRequest {
  playerId: string;
  goals?: number;
  assists?: number;
  yellowCards?: number;
  redCards?: number;
  minutesPlayed?: number;
}
