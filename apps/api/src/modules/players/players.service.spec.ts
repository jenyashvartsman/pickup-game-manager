import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { PlayersService } from './players.service';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { AuditAction } from 'shared-types';

type PlayerRepositoryMock = {
  find: jest.Mock;
  findOne: jest.Mock;
  create: jest.Mock;
  save: jest.Mock;
  remove: jest.Mock;
};

const mockPlayerRepository = (): PlayerRepositoryMock => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

const mockAuditLogService = () => ({
  log: jest.fn(),
});

const NOW = new Date('2026-11-05T10:00:00Z');

const makePlayer = (overrides: Partial<Player> = {}): Player =>
  ({
    id: 'uuid-1',
    name: 'Alice',
    position: 'forward',
    games: [],
    stats: [],
    createdAt: NOW,
    updatedAt: NOW,
    ...overrides,
  }) as Player;

describe('PlayersService', () => {
  let service: PlayersService;
  let playerRepo: PlayerRepositoryMock;
  let auditLogService: ReturnType<typeof mockAuditLogService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayersService,
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

    service = module.get<PlayersService>(PlayersService);
    playerRepo = module.get(getRepositoryToken(Player));
    auditLogService = module.get(AuditLogService);
  });

  describe('findAll', () => {
    it('returns all players as DTOs', async () => {
      const player = makePlayer();
      playerRepo.find.mockResolvedValue([player]);

      const result = await service.findAll();

      expect(playerRepo.find).toHaveBeenCalled();
      expect(result).toEqual([
        {
          id: player.id,
          name: player.name,
          position: player.position,
          createdAt: NOW,
          updatedAt: NOW,
        },
      ]);
    });
  });

  describe('findOne', () => {
    it('returns a player as DTO when found', async () => {
      const player = makePlayer();
      playerRepo.findOne.mockResolvedValue(player);

      const result = await service.findOne('uuid-1');

      expect(playerRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
      });
      expect(result).toEqual({
        id: player.id,
        name: player.name,
        position: player.position,
        createdAt: NOW,
        updatedAt: NOW,
      });
    });

    it('throws NotFoundException when player does not exist', async () => {
      playerRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('creates a player and returns a DTO with an audit log entry', async () => {
      const dto = { name: 'Bob', position: 'goalkeeper' };
      const created = makePlayer({ name: 'Bob', position: 'goalkeeper' });
      const saved = makePlayer({ id: 'uuid-2', name: 'Bob', position: 'goalkeeper' });

      playerRepo.create.mockReturnValue(created);
      playerRepo.save.mockResolvedValue(saved);

      const result = await service.create(dto);

      expect(playerRepo.create).toHaveBeenCalledWith(dto);
      expect(playerRepo.save).toHaveBeenCalledWith(created);
      expect(auditLogService.log).toHaveBeenCalledWith(
        'Player',
        saved.id,
        AuditAction.CREATE,
        `Player '${saved.name}' created`,
      );
      expect(result).toEqual({
        id: saved.id,
        name: saved.name,
        position: saved.position,
        createdAt: NOW,
        updatedAt: NOW,
      });
    });
  });

  describe('update', () => {
    it('updates a player and returns a DTO with an audit log entry', async () => {
      const existing = makePlayer();
      const dto = { position: 'midfielder' };
      const saved = makePlayer({ position: 'midfielder' });

      playerRepo.findOne.mockResolvedValue(existing);
      playerRepo.save.mockResolvedValue(saved);

      const result = await service.update('uuid-1', dto);

      expect(playerRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
      });
      expect(playerRepo.save).toHaveBeenCalled();
      expect(auditLogService.log).toHaveBeenCalledWith(
        'Player',
        saved.id,
        AuditAction.UPDATE,
        `Player '${saved.name}' updated`,
      );
      expect(result).toEqual({
        id: saved.id,
        name: saved.name,
        position: saved.position,
        createdAt: NOW,
        updatedAt: NOW,
      });
    });

    it('throws NotFoundException when player does not exist', async () => {
      playerRepo.findOne.mockResolvedValue(null);

      await expect(service.update('missing-id', {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('removes a player and writes an audit log entry', async () => {
      const player = makePlayer();
      playerRepo.findOne.mockResolvedValue(player);
      playerRepo.remove.mockResolvedValue(undefined);

      await service.remove('uuid-1');

      expect(playerRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'uuid-1' },
      });
      expect(playerRepo.remove).toHaveBeenCalledWith(player);
      expect(auditLogService.log).toHaveBeenCalledWith(
        'Player',
        'uuid-1',
        AuditAction.DELETE,
        `Player '${player.name}' deleted`,
      );
    });

    it('throws NotFoundException when player does not exist', async () => {
      playerRepo.findOne.mockResolvedValue(null);

      await expect(service.remove('missing-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
