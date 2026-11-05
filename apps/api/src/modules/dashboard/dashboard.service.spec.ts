import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game } from '../games/entities/game.entity';
import { PlayerStat } from '../player-stats/entities/player-stat.entity';
import { GameResult } from '../game-results/entities/game-result.entity';
import { DashboardService } from './dashboard.service';
import { GameStatus } from 'shared-types';

type QbMock = {
  leftJoinAndSelect: jest.Mock;
  leftJoin: jest.Mock;
  select: jest.Mock;
  addSelect: jest.Mock;
  where: jest.Mock;
  andWhere: jest.Mock;
  orderBy: jest.Mock;
  groupBy: jest.Mock;
  addGroupBy: jest.Mock;
  take: jest.Mock;
  limit: jest.Mock;
  getMany: jest.Mock;
  getRawMany: jest.Mock;
};

const makeQbMock = (manyResult: unknown[] = [], rawResult: unknown[] = []): QbMock => {
  const qb = {} as QbMock;
  const chainMethods: (keyof QbMock)[] = [
    'leftJoinAndSelect', 'leftJoin', 'select', 'addSelect',
    'where', 'andWhere', 'orderBy', 'groupBy', 'addGroupBy',
    'take', 'limit',
  ];
  for (const m of chainMethods) {
    qb[m] = jest.fn().mockReturnThis() as jest.Mock;
  }
  qb.getMany = jest.fn().mockResolvedValue(manyResult);
  qb.getRawMany = jest.fn().mockResolvedValue(rawResult);
  return qb;
};

const NOW = new Date('2026-11-05T10:00:00Z');

const makeGame = (overrides: Partial<Game> = {}): Game =>
  ({
    id: 'game-uuid-1',
    scheduledAt: new Date('2026-11-07T18:00:00Z'),
    location: 'Central Park',
    status: GameStatus.SCHEDULED,
    players: [],
    result: null,
    playerStats: [],
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  }) as Game;

const makeGameResult = (overrides: Partial<GameResult> = {}): GameResult =>
  ({
    id: 'result-uuid-1',
    scoreTeamA: 3,
    scoreTeamB: 1,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  }) as GameResult;

describe('DashboardService', () => {
  let service: DashboardService;
  let gameRepo: { createQueryBuilder: jest.Mock };
  let playerStatRepo: { createQueryBuilder: jest.Mock };

  beforeEach(async () => {
    gameRepo = { createQueryBuilder: jest.fn() };
    playerStatRepo = { createQueryBuilder: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: getRepositoryToken(Game), useValue: gameRepo },
        { provide: getRepositoryToken(PlayerStat), useValue: playerStatRepo },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  describe('getSummary', () => {
    it('returns all three sections', async () => {
      const upcomingQb = makeQbMock([makeGame()]);
      const recentQb = makeQbMock([
        makeGame({ status: GameStatus.COMPLETED, result: makeGameResult() }),
      ]);
      const topQb = makeQbMock([], [
        { id: 'p1', name: 'Alice', position: 'forward', totalGoals: '5', totalAssists: '3' },
      ]);

      gameRepo.createQueryBuilder
        .mockReturnValueOnce(upcomingQb)
        .mockReturnValueOnce(recentQb);
      playerStatRepo.createQueryBuilder.mockReturnValue(topQb);

      const result = await service.getSummary();

      expect(result.upcomingGames).toHaveLength(1);
      expect(result.recentResults).toHaveLength(1);
      expect(result.topPlayers).toHaveLength(1);
    });

    it('maps upcomingGames to DTO with playerCount from players array', async () => {
      const game = makeGame({
        players: [
          { id: 'p1' } as never,
          { id: 'p2' } as never,
          { id: 'p3' } as never,
        ],
      });
      const upcomingQb = makeQbMock([game]);
      const recentQb = makeQbMock([]);
      const topQb = makeQbMock([], []);

      gameRepo.createQueryBuilder
        .mockReturnValueOnce(upcomingQb)
        .mockReturnValueOnce(recentQb);
      playerStatRepo.createQueryBuilder.mockReturnValue(topQb);

      const result = await service.getSummary();

      expect(result.upcomingGames[0]).toEqual({
        id: game.id,
        scheduledAt: game.scheduledAt,
        location: game.location,
        playerCount: 3,
      });
    });

    it('queries upcoming games with SCHEDULED status and date range ordered ASC', async () => {
      const upcomingQb = makeQbMock([]);
      const recentQb = makeQbMock([]);
      const topQb = makeQbMock([], []);

      gameRepo.createQueryBuilder
        .mockReturnValueOnce(upcomingQb)
        .mockReturnValueOnce(recentQb);
      playerStatRepo.createQueryBuilder.mockReturnValue(topQb);

      await service.getSummary();

      expect(upcomingQb.where).toHaveBeenCalledWith('game.status = :status', {
        status: GameStatus.SCHEDULED,
      });
      expect(upcomingQb.andWhere).toHaveBeenCalledWith(
        'game.scheduledAt >= :now',
        expect.objectContaining({ now: expect.any(Date) }),
      );
      expect(upcomingQb.andWhere).toHaveBeenCalledWith(
        'game.scheduledAt <= :later',
        expect.objectContaining({ later: expect.any(Date) }),
      );
      expect(upcomingQb.orderBy).toHaveBeenCalledWith('game.scheduledAt', 'ASC');
    });

    it('queries recent results with COMPLETED status, take 5, ordered DESC', async () => {
      const upcomingQb = makeQbMock([]);
      const recentQb = makeQbMock([]);
      const topQb = makeQbMock([], []);

      gameRepo.createQueryBuilder
        .mockReturnValueOnce(upcomingQb)
        .mockReturnValueOnce(recentQb);
      playerStatRepo.createQueryBuilder.mockReturnValue(topQb);

      await service.getSummary();

      expect(recentQb.where).toHaveBeenCalledWith('game.status = :status', {
        status: GameStatus.COMPLETED,
      });
      expect(recentQb.orderBy).toHaveBeenCalledWith('game.scheduledAt', 'DESC');
      expect(recentQb.take).toHaveBeenCalledWith(5);
    });

    it('maps recentResults to DTO with scores from result', async () => {
      const result = makeGameResult({ scoreTeamA: 2, scoreTeamB: 0 });
      const game = makeGame({
        status: GameStatus.COMPLETED,
        scheduledAt: new Date('2026-11-01T18:00:00Z'),
        result,
      });
      const upcomingQb = makeQbMock([]);
      const recentQb = makeQbMock([game]);
      const topQb = makeQbMock([], []);

      gameRepo.createQueryBuilder
        .mockReturnValueOnce(upcomingQb)
        .mockReturnValueOnce(recentQb);
      playerStatRepo.createQueryBuilder.mockReturnValue(topQb);

      const summary = await service.getSummary();

      expect(summary.recentResults[0]).toEqual({
        id: game.id,
        scheduledAt: game.scheduledAt,
        location: game.location,
        scoreTeamA: 2,
        scoreTeamB: 0,
      });
    });

    it('excludes completed games that have no result record', async () => {
      const gameWithoutResult = makeGame({ status: GameStatus.COMPLETED, result: null });
      const upcomingQb = makeQbMock([]);
      const recentQb = makeQbMock([gameWithoutResult]);
      const topQb = makeQbMock([], []);

      gameRepo.createQueryBuilder
        .mockReturnValueOnce(upcomingQb)
        .mockReturnValueOnce(recentQb);
      playerStatRepo.createQueryBuilder.mockReturnValue(topQb);

      const summary = await service.getSummary();

      expect(summary.recentResults).toHaveLength(0);
    });

    it('maps topPlayers and parses string aggregates from raw query', async () => {
      const rawRows = [
        { id: 'p1', name: 'Alice', position: 'forward', totalGoals: '7', totalAssists: '4' },
        { id: 'p2', name: 'Bob', position: 'midfielder', totalGoals: '3', totalAssists: '6' },
      ];
      const upcomingQb = makeQbMock([]);
      const recentQb = makeQbMock([]);
      const topQb = makeQbMock([], rawRows);

      gameRepo.createQueryBuilder
        .mockReturnValueOnce(upcomingQb)
        .mockReturnValueOnce(recentQb);
      playerStatRepo.createQueryBuilder.mockReturnValue(topQb);

      const summary = await service.getSummary();

      expect(summary.topPlayers).toHaveLength(2);
      expect(summary.topPlayers[0]).toEqual({
        id: 'p1',
        name: 'Alice',
        position: 'forward',
        totalGoals: 7,
        totalAssists: 4,
      });
    });

    it('queries top players with limit 5 ordered by goals DESC', async () => {
      const upcomingQb = makeQbMock([]);
      const recentQb = makeQbMock([]);
      const topQb = makeQbMock([], []);

      gameRepo.createQueryBuilder
        .mockReturnValueOnce(upcomingQb)
        .mockReturnValueOnce(recentQb);
      playerStatRepo.createQueryBuilder.mockReturnValue(topQb);

      await service.getSummary();

      expect(topQb.limit).toHaveBeenCalledWith(5);
      expect(topQb.orderBy).toHaveBeenCalledWith('SUM(ps.goals)', 'DESC');
    });

    it('returns empty arrays when no data exists', async () => {
      const upcomingQb = makeQbMock([]);
      const recentQb = makeQbMock([]);
      const topQb = makeQbMock([], []);

      gameRepo.createQueryBuilder
        .mockReturnValueOnce(upcomingQb)
        .mockReturnValueOnce(recentQb);
      playerStatRepo.createQueryBuilder.mockReturnValue(topQb);

      const summary = await service.getSummary();

      expect(summary.upcomingGames).toEqual([]);
      expect(summary.recentResults).toEqual([]);
      expect(summary.topPlayers).toEqual([]);
    });
  });
});
