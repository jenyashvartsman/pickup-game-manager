import { GameStatus } from 'shared-types';

export interface PlayerStatFixture {
  playerIndex: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
}

export interface GameResultFixture {
  scoreTeamA: number;
  scoreTeamB: number;
}

export interface GameFixture {
  scheduledAt: Date;
  location: string;
  status: GameStatus;
  rosterIndices: number[];
  result?: GameResultFixture;
  playerStats?: PlayerStatFixture[];
}

// Today is 2026-11-05. Past = completed, future = scheduled.
export const GAMES_FIXTURE: GameFixture[] = [
  // --- Game 1: completed, 3 weeks ago ---
  {
    scheduledAt: new Date('2026-10-15T18:00:00Z'),
    location: 'Riverside Park Field A',
    status: GameStatus.COMPLETED,
    rosterIndices: [0, 2, 3, 4, 6, 7, 8, 11, 12, 14],
    result: { scoreTeamA: 3, scoreTeamB: 2 },
    playerStats: [
      { playerIndex: 0,  goals: 0, assists: 0, yellowCards: 0, redCards: 0, minutesPlayed: 90 },
      { playerIndex: 2,  goals: 0, assists: 1, yellowCards: 1, redCards: 0, minutesPlayed: 90 },
      { playerIndex: 3,  goals: 0, assists: 0, yellowCards: 0, redCards: 0, minutesPlayed: 90 },
      { playerIndex: 4,  goals: 1, assists: 0, yellowCards: 0, redCards: 0, minutesPlayed: 90 },
      { playerIndex: 6,  goals: 0, assists: 2, yellowCards: 0, redCards: 0, minutesPlayed: 90 },
      { playerIndex: 7,  goals: 1, assists: 0, yellowCards: 1, redCards: 0, minutesPlayed: 80 },
      { playerIndex: 8,  goals: 0, assists: 0, yellowCards: 0, redCards: 0, minutesPlayed: 70 },
      { playerIndex: 11, goals: 2, assists: 0, yellowCards: 0, redCards: 0, minutesPlayed: 90 },
      { playerIndex: 12, goals: 0, assists: 1, yellowCards: 0, redCards: 0, minutesPlayed: 85 },
      { playerIndex: 14, goals: 1, assists: 0, yellowCards: 0, redCards: 0, minutesPlayed: 90 },
    ],
  },

  // --- Game 2: completed, 2 weeks ago ---
  {
    scheduledAt: new Date('2026-10-22T18:00:00Z'),
    location: 'Eastside Sports Complex',
    status: GameStatus.COMPLETED,
    rosterIndices: [1, 3, 5, 6, 7, 9, 10, 11, 13, 14],
    result: { scoreTeamA: 1, scoreTeamB: 4 },
    playerStats: [
      { playerIndex: 1,  goals: 0, assists: 0, yellowCards: 0, redCards: 0, minutesPlayed: 90 },
      { playerIndex: 3,  goals: 0, assists: 0, yellowCards: 1, redCards: 0, minutesPlayed: 90 },
      { playerIndex: 5,  goals: 0, assists: 1, yellowCards: 0, redCards: 0, minutesPlayed: 90 },
      { playerIndex: 6,  goals: 1, assists: 1, yellowCards: 0, redCards: 0, minutesPlayed: 90 },
      { playerIndex: 7,  goals: 0, assists: 0, yellowCards: 0, redCards: 0, minutesPlayed: 60 },
      { playerIndex: 9,  goals: 0, assists: 2, yellowCards: 0, redCards: 0, minutesPlayed: 90 },
      { playerIndex: 10, goals: 0, assists: 0, yellowCards: 1, redCards: 0, minutesPlayed: 90 },
      { playerIndex: 11, goals: 1, assists: 0, yellowCards: 0, redCards: 0, minutesPlayed: 90 },
      { playerIndex: 13, goals: 2, assists: 0, yellowCards: 0, redCards: 0, minutesPlayed: 90 },
      { playerIndex: 14, goals: 1, assists: 1, yellowCards: 0, redCards: 1, minutesPlayed: 75 },
    ],
  },

  // --- Game 3: scheduled, next week ---
  {
    scheduledAt: new Date('2026-11-12T18:00:00Z'),
    location: 'Riverside Park Field A',
    status: GameStatus.SCHEDULED,
    rosterIndices: [0, 1, 2, 4, 6, 8, 9, 11, 12, 13, 14],
  },

  // --- Game 4: scheduled, 2 weeks from now ---
  {
    scheduledAt: new Date('2026-11-19T18:00:00Z'),
    location: 'Westfield Community Pitch',
    status: GameStatus.SCHEDULED,
    rosterIndices: [1, 3, 5, 6, 7, 9, 10, 12, 13],
  },
];
