export type GameStatus = 'scheduled' | 'completed' | 'cancelled';

export interface Game {
  id: string;
  scheduledAt: string;
  location: string | null;
  status: GameStatus;
  createdAt: string;
  updatedAt: string;
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
