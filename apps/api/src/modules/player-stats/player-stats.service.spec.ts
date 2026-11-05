import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PlayerStat } from './entities/player-stat.entity';
import { Game } from '../games/entities/game.entity';
import { Player } from '../players/entities/player.entity';
import { PlayerStatsService } from './player-stats.service';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { AuditAction, GameStatus } from 'shared-types';

type PlayerStatRepositoryMock = {
  find: jest.Mock;
  findOne: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
};

type GameRepositoryMock = {
  findOne: jest.Mock;
};

const mockPlayerStatRepository = (): PlayerStatRepositoryMock => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const mockGameRepository = (): GameRepositoryMock => ({
  findOne: jest.fn(),
});

const mockAuditLogService = () => ({
  log: jest.fn(),
});

const NOW = new Date('2026-11-05T10:00:00Z');
const SCHEDULED_AT = new Date('2026-11-08T18:00:00Z');

const makePlayer = (overrides: Partial<Player> = {}): Player =>
  ({
    id: 'player-uuid-1',
    name: 'Alice',
    position: 'forward',
    games: [],
    stats: [],
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  }) as Player;

const makeGame = (overrides: Partial<Game> = {}): Game =>
  ({
    id: 'game-uuid-1',
    scheduledAt: SCHEDULED_AT,
    location: 'Central Park',
    status: GameStatus.COMPLETED,
    players: [],
    result: null,
    playerStats: [],
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  }) as Game;

const makePlayerStat = (
  game: Game,
  player: Player,
  overrides: Partial<PlayerStat> = {},
): PlayerStat =>
  ({
    id: 'stat-uuid-1',
    game,
    player,
    goals: 1,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
    minutesPlayed: 90,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  }) as PlayerStat;

describe('PlayerStatsService', () => {
  let service: PlayerStatsService;
  let playerStatRepo: PlayerStatRepositoryMock;
  let gameRepo: GameRepositoryMock;
  let auditLogService: ReturnType<typeof mockAuditLogService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerStatsService,
        {
          provide: getRepositoryToken(PlayerStat),
          useFactory: mockPlayerStatRepository,
        },
        {
          provide: getRepositoryToken(Game),
          useFactory: mockGameRepository,
        },
        {
          provide: AuditLogService,
          useFactory: mockAuditLogService,
        },
      ],
    }).compile();

    service = module.get<PlayerStatsService>(PlayerStatsService);
    playerStatRepo = module.get(getRepositoryToken(PlayerStat));
    gameRepo = module.get(getRepositoryToken(Game));
    auditLogService = module.get(AuditLogService);
  });

  describe('getStats', () => {
    it('returns all player stats for a game as DTOs', async () => {
      const player = makePlayer();
      const game = makeGame({ players: [player] });
      const stat = makePlayerStat(game, player);
      playerStatRepo.find.mockResolvedValue([stat]);

      const result = await service.getStats('game-uuid-1');

      expect(playerStatRepo.find).toHaveBeenCalledWith({
        where: { game: { id: 'game-uuid-1' } },
        relations: { game: true, player: true },
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(stat.id);
      expect(result[0].goals).toBe(1);
      expect(result[0].gameId).toBe('game-uuid-1');
      expect(result[0].playerId).toBe('player-uuid-1');
    });

    it('returns an empty array when no stats exist for the game', async () => {
      playerStatRepo.find.mockResolvedValue([]);

      const result = await service.getStats('game-uuid-1');

      expect(result).toEqual([]);
    });
  });

  describe('upsertStats', () => {
    it('creates new stats for a rostered player and writes an audit log', async () => {
      const player = makePlayer();
      const game = makeGame({ players: [player] });
      const stat = makePlayerStat(game, player, { goals: 2, minutesPlayed: 90 });

      gameRepo.findOne.mockResolvedValue(game);
      playerStatRepo.findOne.mockResolvedValue(null);
      playerStatRepo.create.mockReturnValue(stat);
      playerStatRepo.save.mockResolvedValue(stat);

      const result = await service.upsertStats('game-uuid-1', [
        { playerId: 'player-uuid-1', goals: 2, minutesPlayed: 90 },
      ]);

      expect(gameRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'game-uuid-1' },
        relations: { players: true },
      });
      expect(playerStatRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          game,
          player,
          goals: 2,
          minutesPlayed: 90,
          assists: 0,
          yellowCards: 0,
          redCards: 0,
        }),
      );
      expect(playerStatRepo.save).toHaveBeenCalledWith(stat);
      expect(auditLogService.log).toHaveBeenCalledWith(
        'PlayerStat',
        stat.id,
        AuditAction.CREATE,
        expect.stringContaining('Alice'),
      );
      expect(result).toHaveLength(1);
      expect(result[0].goals).toBe(2);
    });

    it('updates existing stats for a rostered player and writes an audit log', async () => {
      const player = makePlayer();
      const game = makeGame({ players: [player] });
      const existing = makePlayerStat(game, player, { goals: 1 });
      const saved = makePlayerStat(game, player, { goals: 3 });

      gameRepo.findOne.mockResolvedValue(game);
      playerStatRepo.findOne.mockResolvedValue(existing);
      playerStatRepo.save.mockResolvedValue(saved);

      const result = await service.upsertStats('game-uuid-1', [
        { playerId: 'player-uuid-1', goals: 3 },
      ]);

      expect(existing.goals).toBe(3);
      expect(playerStatRepo.save).toHaveBeenCalledWith(existing);
      expect(auditLogService.log).toHaveBeenCalledWith(
        'PlayerStat',
        saved.id,
        AuditAction.UPDATE,
        expect.stringContaining('Alice'),
      );
      expect(result[0].goals).toBe(3);
    });

    it('handles multiple players in one call', async () => {
      const alice = makePlayer({ id: 'player-uuid-1', name: 'Alice' });
      const bob = makePlayer({ id: 'player-uuid-2', name: 'Bob' });
      const game = makeGame({ players: [alice, bob] });
      const statAlice = makePlayerStat(game, alice, { id: 'stat-uuid-1' });
      const statBob = makePlayerStat(game, bob, { id: 'stat-uuid-2' });

      gameRepo.findOne.mockResolvedValue(game);
      playerStatRepo.findOne.mockResolvedValue(null);
      playerStatRepo.create
        .mockReturnValueOnce(statAlice)
        .mockReturnValueOnce(statBob);
      playerStatRepo.save
        .mockResolvedValueOnce(statAlice)
        .mockResolvedValueOnce(statBob);

      const result = await service.upsertStats('game-uuid-1', [
        { playerId: 'player-uuid-1', goals: 1 },
        { playerId: 'player-uuid-2', goals: 0 },
      ]);

      expect(result).toHaveLength(2);
      expect(auditLogService.log).toHaveBeenCalledTimes(2);
    });

    it('throws BadRequestException when player is not on the roster', async () => {
      const game = makeGame({ players: [] });
      gameRepo.findOne.mockResolvedValue(game);

      await expect(
        service.upsertStats('game-uuid-1', [
          { playerId: 'player-uuid-1', goals: 1 },
        ]),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws NotFoundException when game does not exist', async () => {
      gameRepo.findOne.mockResolvedValue(null);

      await expect(
        service.upsertStats('missing-id', [{ playerId: 'player-uuid-1' }]),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
