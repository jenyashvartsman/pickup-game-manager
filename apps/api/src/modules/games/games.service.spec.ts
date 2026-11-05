import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Player } from '../players/entities/player.entity';
import { GamesService } from './games.service';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { AuditAction, GameStatus } from 'shared-types';

type GameRepositoryMock = {
  find: jest.Mock;
  findOne: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
  remove: jest.Mock;
};

type PlayerRepositoryMock = {
  findOne: jest.Mock;
};

const mockGameRepository = (): GameRepositoryMock => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

const mockPlayerRepository = (): PlayerRepositoryMock => ({
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
    status: GameStatus.SCHEDULED,
    players: [],
    result: null,
    playerStats: [],
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  }) as Game;

describe('GamesService', () => {
  let service: GamesService;
  let gameRepo: GameRepositoryMock;
  let playerRepo: PlayerRepositoryMock;
  let auditLogService: ReturnType<typeof mockAuditLogService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        {
          provide: getRepositoryToken(Game),
          useFactory: mockGameRepository,
        },
        {
          provide: getRepositoryToken(Player),
          useFactory: mockPlayerRepository,
        },
        {
          provide: AuditLogService,
          useFactory: mockAuditLogService,
        },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);
    gameRepo = module.get(getRepositoryToken(Game));
    playerRepo = module.get(getRepositoryToken(Player));
    auditLogService = module.get(AuditLogService);
  });

  describe('findAll', () => {
    it('returns all games as DTOs when no filter is given', async () => {
      const game = makeGame();
      gameRepo.find.mockResolvedValue([game]);

      const result = await service.findAll();

      expect(gameRepo.find).toHaveBeenCalledWith({
        where: {},
        relations: { players: true },
        order: { scheduledAt: 'ASC' },
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(game.id);
      expect(result[0].players).toEqual([]);
    });

    it('passes a date range where clause when from and to are provided', async () => {
      gameRepo.find.mockResolvedValue([]);

      await service.findAll('2026-11-01', '2026-11-30');

      const callArgs = gameRepo.find.mock.calls[0][0];
      expect(callArgs.where.scheduledAt).toBeDefined();
    });

    it('passes a MoreThanOrEqual clause when only from is provided', async () => {
      gameRepo.find.mockResolvedValue([]);

      await service.findAll('2026-11-01');

      const callArgs = gameRepo.find.mock.calls[0][0];
      expect(callArgs.where.scheduledAt).toBeDefined();
    });

    it('passes a LessThanOrEqual clause when only to is provided', async () => {
      gameRepo.find.mockResolvedValue([]);

      await service.findAll(undefined, '2026-11-30');

      const callArgs = gameRepo.find.mock.calls[0][0];
      expect(callArgs.where.scheduledAt).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('returns a game with roster as DTO when found', async () => {
      const player = makePlayer();
      const game = makeGame({ players: [player] });
      gameRepo.findOne.mockResolvedValue(game);

      const result = await service.findOne('game-uuid-1');

      expect(gameRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'game-uuid-1' },
        relations: { players: true },
      });
      expect(result.id).toBe(game.id);
      expect(result.players).toHaveLength(1);
      expect(result.players[0].id).toBe(player.id);
    });

    it('throws NotFoundException when game does not exist', async () => {
      gameRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('creates a game and returns a DTO with an audit log entry', async () => {
      const dto = { scheduledAt: '2026-11-08T18:00:00Z', location: 'Central Park' };
      const created = makeGame({ players: [] });
      const saved = makeGame({ id: 'game-uuid-2', players: [] });

      gameRepo.create.mockReturnValue(created);
      gameRepo.save.mockResolvedValue(saved);

      const result = await service.create(dto);

      expect(gameRepo.create).toHaveBeenCalledWith({
        scheduledAt: new Date(dto.scheduledAt),
        location: 'Central Park',
        players: [],
      });
      expect(gameRepo.save).toHaveBeenCalledWith(created);
      expect(auditLogService.log).toHaveBeenCalledWith(
        'Game',
        saved.id,
        AuditAction.CREATE,
        expect.stringContaining('created'),
      );
      expect(result.id).toBe(saved.id);
      expect(result.status).toBe(GameStatus.SCHEDULED);
    });

    it('sets location to null when omitted', async () => {
      const dto = { scheduledAt: '2026-11-08T18:00:00Z' };
      const created = makeGame({ location: null, players: [] });
      const saved = makeGame({ location: null, players: [] });

      gameRepo.create.mockReturnValue(created);
      gameRepo.save.mockResolvedValue(saved);

      await service.create(dto);

      expect(gameRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ location: null }),
      );
    });
  });

  describe('update', () => {
    it('updates a game and returns a DTO with an audit log entry', async () => {
      const existing = makeGame();
      const dto = { status: GameStatus.CANCELLED };
      const saved = makeGame({ status: GameStatus.CANCELLED });

      gameRepo.findOne.mockResolvedValue(existing);
      gameRepo.save.mockResolvedValue(saved);

      const result = await service.update('game-uuid-1', dto);

      expect(gameRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'game-uuid-1' },
        relations: { players: true },
      });
      expect(gameRepo.save).toHaveBeenCalled();
      expect(auditLogService.log).toHaveBeenCalledWith(
        'Game',
        saved.id,
        AuditAction.UPDATE,
        expect.stringContaining('updated'),
      );
      expect(result.status).toBe(GameStatus.CANCELLED);
    });

    it('throws NotFoundException when game does not exist', async () => {
      gameRepo.findOne.mockResolvedValue(null);

      await expect(service.update('missing-id', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('removes a game and writes an audit log entry', async () => {
      const game = makeGame();
      gameRepo.findOne.mockResolvedValue(game);
      gameRepo.remove.mockResolvedValue(undefined);

      await service.remove('game-uuid-1');

      expect(gameRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'game-uuid-1' },
      });
      expect(gameRepo.remove).toHaveBeenCalledWith(game);
      expect(auditLogService.log).toHaveBeenCalledWith(
        'Game',
        'game-uuid-1',
        AuditAction.DELETE,
        expect.stringContaining('deleted'),
      );
    });

    it('throws NotFoundException when game does not exist', async () => {
      gameRepo.findOne.mockResolvedValue(null);

      await expect(service.remove('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('addToRoster', () => {
    it('adds a player to the roster and writes an audit log entry', async () => {
      const player = makePlayer();
      const game = makeGame({ players: [] });

      gameRepo.findOne.mockResolvedValue(game);
      playerRepo.findOne.mockResolvedValue(player);
      gameRepo.save.mockResolvedValue(game);

      const result = await service.addToRoster('game-uuid-1', 'player-uuid-1');

      expect(gameRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          players: expect.arrayContaining([player]),
        }),
      );
      expect(auditLogService.log).toHaveBeenCalledWith(
        'Game',
        'game-uuid-1',
        AuditAction.UPDATE,
        expect.stringContaining('Alice'),
      );
      expect(result.players).toHaveLength(1);
    });

    it('does not save or log when player is already in roster', async () => {
      const player = makePlayer();
      const game = makeGame({ players: [player] });

      gameRepo.findOne.mockResolvedValue(game);
      playerRepo.findOne.mockResolvedValue(player);

      await service.addToRoster('game-uuid-1', 'player-uuid-1');

      expect(gameRepo.save).not.toHaveBeenCalled();
      expect(auditLogService.log).not.toHaveBeenCalled();
    });

    it('throws BadRequestException when game is completed', async () => {
      const game = makeGame({ status: GameStatus.COMPLETED });
      gameRepo.findOne.mockResolvedValue(game);

      await expect(
        service.addToRoster('game-uuid-1', 'player-uuid-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when game is cancelled', async () => {
      const game = makeGame({ status: GameStatus.CANCELLED });
      gameRepo.findOne.mockResolvedValue(game);

      await expect(
        service.addToRoster('game-uuid-1', 'player-uuid-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws NotFoundException when game does not exist', async () => {
      gameRepo.findOne.mockResolvedValue(null);

      await expect(
        service.addToRoster('missing-id', 'player-uuid-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when player does not exist', async () => {
      const game = makeGame({ players: [] });
      gameRepo.findOne.mockResolvedValue(game);
      playerRepo.findOne.mockResolvedValue(null);

      await expect(
        service.addToRoster('game-uuid-1', 'missing-player'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeFromRoster', () => {
    it('removes a player from the roster and writes an audit log entry', async () => {
      const player = makePlayer();
      const game = makeGame({ players: [player] });

      gameRepo.findOne.mockResolvedValue(game);
      gameRepo.save.mockResolvedValue(game);

      await service.removeFromRoster('game-uuid-1', 'player-uuid-1');

      expect(gameRepo.save).toHaveBeenCalled();
      expect(auditLogService.log).toHaveBeenCalledWith(
        'Game',
        'game-uuid-1',
        AuditAction.UPDATE,
        expect.stringContaining('Alice'),
      );
    });

    it('throws NotFoundException when game does not exist', async () => {
      gameRepo.findOne.mockResolvedValue(null);

      await expect(
        service.removeFromRoster('missing-id', 'player-uuid-1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws NotFoundException when player is not in the roster', async () => {
      const game = makeGame({ players: [] });
      gameRepo.findOne.mockResolvedValue(game);

      await expect(
        service.removeFromRoster('game-uuid-1', 'player-uuid-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
