export interface Player {
  id: string;
  name: string;
  position: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlayerRequest {
  name: string;
  position: string;
}

export interface UpdatePlayerRequest {
  name?: string;
  position?: string;
}

export interface PlayerStat {
  id: string;
  gameId: string;
  playerId: string;
  gameScheduledAt: string;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerCareerTotals {
  gamesPlayed: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
}

export function computeCareerTotals(stats: PlayerStat[]): PlayerCareerTotals {
  return stats.reduce(
    (acc, s) => ({
      gamesPlayed: acc.gamesPlayed + 1,
      goals: acc.goals + s.goals,
      assists: acc.assists + s.assists,
      yellowCards: acc.yellowCards + s.yellowCards,
      redCards: acc.redCards + s.redCards,
      minutesPlayed: acc.minutesPlayed + s.minutesPlayed,
    }),
    { gamesPlayed: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, minutesPlayed: 0 },
  );
}
