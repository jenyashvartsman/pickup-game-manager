import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GameResult } from './entities/game-result.entity';
import { Game } from '../games/entities/game.entity';
import { GameResultsService } from './game-results.service';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { AuditAction, GameStatus } from 'shared-types';

type GameResultRepositoryMock = {
  findOne: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
};

type GameRepositoryMock = {
  findOne: jest.Mock;
  save: jest.Mock;
};

const mockGameResultRepository = (): GameResultRepositoryMock => ({
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
});

const mockGameRepository = (): GameRepositoryMock => ({
  findOne: jest.fn(),
  save: jest.fn(),
});

const mockAuditLogService = () => ({
  log: jest.fn(),
});

const NOW = new Date('2026-11-05T10:00:00Z');
const SCHEDULED_AT = new Date('2026-11-08T18:00:00Z');

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

const makeGameResult = (overrides: Partial<GameResult> = {}): GameResult =>
  ({
    id: 'result-uuid-1',
    game: makeGame({ status: GameStatus.COMPLETED }),
    scoreTeamA: 2,
    scoreTeamB: 1,
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  }) as GameResult;

describe('GameResultsService', () => {
  let service: GameResultsService;
  let gameResultRepo: GameResultRepositoryMock;
  let gameRepo: GameRepositoryMock;
  let auditLogService: ReturnType<typeof mockAuditLogService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameResultsService,
        {
          provide: getRepositoryToken(GameResult),
          useFactory: mockGameResultRepository,
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

    service = module.get<GameResultsService>(GameResultsService);
    gameResultRepo = module.get(getRepositoryToken(GameResult));
    gameRepo = module.get(getRepositoryToken(Game));
    auditLogService = module.get(AuditLogService);
  });

  describe('getResult', () => {
    it('returns the game result as DTO when found', async () => {
      const result = makeGameResult();
      gameResultRepo.findOne.mockResolvedValue(result);

      const dto = await service.getResult('game-uuid-1');

      expect(gameResultRepo.findOne).toHaveBeenCalledWith({
        where: { game: { id: 'game-uuid-1' } },
        relations: { game: true },
      });
      expect(dto.id).toBe(result.id);
      expect(dto.scoreTeamA).toBe(2);
      expect(dto.scoreTeamB).toBe(1);
    });

    it('throws NotFoundException when no result exists', async () => {
      gameResultRepo.findOne.mockResolvedValue(null);

      await expect(service.getResult('game-uuid-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createResult', () => {
    it('creates a result, sets game to completed, and writes audit log', async () => {
      const game = makeGame();
      const created = makeGameResult({ scoreTeamA: 3, scoreTeamB: 0 });
      const saved = makeGameResult({ scoreTeamA: 3, scoreTeamB: 0 });

      gameRepo.findOne.mockResolvedValue(game);
      gameResultRepo.create.mockReturnValue(created);
      gameResultRepo.save.mockResolvedValue(saved);
      gameRepo.save.mockResolvedValue({ ...game, status: GameStatus.COMPLETED });

      const dto = await service.createResult('game-uuid-1', {
        scoreTeamA: 3,
        scoreTeamB: 0,
      });

      expect(gameRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'game-uuid-1' },
      });
      expect(gameResultRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ scoreTeamA: 3, scoreTeamB: 0, game }),
      );
      expect(gameResultRepo.save).toHaveBeenCalledWith(created);
      expect(game.status).toBe(GameStatus.COMPLETED);
      expect(gameRepo.save).toHaveBeenCalledWith(game);
      expect(auditLogService.log).toHaveBeenCalledWith(
        'GameResult',
        saved.id,
        AuditAction.CREATE,
        expect.stringContaining('3-0'),
      );
      expect(dto.id).toBe(saved.id);
    });

    it('throws NotFoundException when game does not exist', async () => {
      gameRepo.findOne.mockResolvedValue(null);

      await expect(
        service.createResult('missing-id', { scoreTeamA: 1, scoreTeamB: 0 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws BadRequestException when game is cancelled', async () => {
      const game = makeGame({ status: GameStatus.CANCELLED });
      gameRepo.findOne.mockResolvedValue(game);

      await expect(
        service.createResult('game-uuid-1', { scoreTeamA: 1, scoreTeamB: 0 }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateResult', () => {
    it('updates the result and writes an audit log', async () => {
      const result = makeGameResult();
      const saved = makeGameResult({ scoreTeamA: 4, scoreTeamB: 2 });

      gameResultRepo.findOne.mockResolvedValue(result);
      gameResultRepo.save.mockResolvedValue(saved);

      const dto = await service.updateResult('game-uuid-1', {
        scoreTeamA: 4,
        scoreTeamB: 2,
      });

      expect(gameResultRepo.findOne).toHaveBeenCalledWith({
        where: { game: { id: 'game-uuid-1' } },
        relations: { game: true },
      });
      expect(result.scoreTeamA).toBe(4);
      expect(result.scoreTeamB).toBe(2);
      expect(gameResultRepo.save).toHaveBeenCalledWith(result);
      expect(auditLogService.log).toHaveBeenCalledWith(
        'GameResult',
        saved.id,
        AuditAction.UPDATE,
        expect.stringContaining('4-2'),
      );
      expect(dto.id).toBe(saved.id);
    });

    it('only updates provided fields', async () => {
      const result = makeGameResult({ scoreTeamA: 2, scoreTeamB: 1 });
      const saved = makeGameResult({ scoreTeamA: 5, scoreTeamB: 1 });

      gameResultRepo.findOne.mockResolvedValue(result);
      gameResultRepo.save.mockResolvedValue(saved);

      await service.updateResult('game-uuid-1', { scoreTeamA: 5 });

      expect(result.scoreTeamA).toBe(5);
      expect(result.scoreTeamB).toBe(1);
    });

    it('throws NotFoundException when no result exists', async () => {
      gameResultRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updateResult('game-uuid-1', { scoreTeamA: 1 }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
