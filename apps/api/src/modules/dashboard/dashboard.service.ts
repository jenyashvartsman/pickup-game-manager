import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../games/entities/game.entity';
import { PlayerStat } from '../player-stats/entities/player-stat.entity';
import {
  DashboardSummaryDto,
  GameStatus,
  RecentResultDto,
  TopPlayerDto,
  UpcomingGameDto,
} from 'shared-types';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(PlayerStat)
    private readonly playerStatRepository: Repository<PlayerStat>,
  ) {}

  async getSummary(): Promise<DashboardSummaryDto> {
    const [upcomingGames, recentResults, topPlayers] = await Promise.all([
      this.getUpcomingGames(),
      this.getRecentResults(),
      this.getTopPlayers(),
    ]);
    return { upcomingGames, recentResults, topPlayers };
  }

  private async getUpcomingGames(): Promise<UpcomingGameDto[]> {
    const now = new Date();
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const games = await this.gameRepository
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.players', 'player')
      .where('game.status = :status', { status: GameStatus.SCHEDULED })
      .andWhere('game.scheduledAt >= :now', { now })
      .andWhere('game.scheduledAt <= :later', { later: sevenDaysLater })
      .orderBy('game.scheduledAt', 'ASC')
      .getMany();

    return games.map((game) => ({
      id: game.id,
      scheduledAt: game.scheduledAt,
      location: game.location,
      playerCount: game.players.length,
    }));
  }

  private async getRecentResults(): Promise<RecentResultDto[]> {
    const games = await this.gameRepository
      .createQueryBuilder('game')
      .leftJoinAndSelect('game.result', 'result')
      .where('game.status = :status', { status: GameStatus.COMPLETED })
      .orderBy('game.scheduledAt', 'DESC')
      .take(5)
      .getMany();

    return games
      .filter((game) => game.result !== null)
      .map((game) => ({
        id: game.id,
        scheduledAt: game.scheduledAt,
        location: game.location,
        scoreTeamA: game.result?.scoreTeamA ?? 0,
        scoreTeamB: game.result?.scoreTeamB ?? 0,
      }));
  }

  private async getTopPlayers(): Promise<TopPlayerDto[]> {
    const rows = await this.playerStatRepository
      .createQueryBuilder('ps')
      .select('player.id', 'id')
      .addSelect('player.name', 'name')
      .addSelect('player.position', 'position')
      .addSelect('SUM(ps.goals)', 'totalGoals')
      .addSelect('SUM(ps.assists)', 'totalAssists')
      .leftJoin('ps.player', 'player')
      .groupBy('player.id')
      .addGroupBy('player.name')
      .addGroupBy('player.position')
      .orderBy('SUM(ps.goals)', 'DESC')
      .limit(5)
      .getRawMany<{
        id: string;
        name: string;
        position: string;
        totalGoals: string;
        totalAssists: string;
      }>();

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      position: row.position,
      totalGoals: parseInt(row.totalGoals, 10),
      totalAssists: parseInt(row.totalAssists, 10),
    }));
  }
}
