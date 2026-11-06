export interface UpcomingGameDto {
  id: string;
  scheduledAt: string;
  location: string | null;
  playerCount: number;
}

export interface RecentResultDto {
  id: string;
  scheduledAt: string;
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

export interface DashboardSummary {
  upcomingGames: UpcomingGameDto[];
  recentResults: RecentResultDto[];
  topPlayers: TopPlayerDto[];
}
