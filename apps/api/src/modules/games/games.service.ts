import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Game } from './entities/game.entity';
import { Player } from '../players/entities/player.entity';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { AuditAction, GameDto, GameStatus, PlayerDto } from 'shared-types';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    private readonly auditLogService: AuditLogService,
  ) {}

  private toPlayerDto(player: Player): PlayerDto {
    return {
      id: player.id,
      name: player.name,
      position: player.position,
      createdAt: player.createdAt,
      updatedAt: player.updatedAt,
    };
  }

  private toDto(game: Game): GameDto {
    return {
      id: game.id,
      scheduledAt: game.scheduledAt,
      location: game.location,
      status: game.status,
      players: (game.players ?? []).map((p) => this.toPlayerDto(p)),
      createdAt: game.createdAt,
      updatedAt: game.updatedAt,
    };
  }

  async findAll(from?: string, to?: string): Promise<GameDto[]> {
    const where: FindOptionsWhere<Game> = {};
    if (from && to) {
      where.scheduledAt = Between(new Date(from), new Date(to));
    } else if (from) {
      where.scheduledAt = MoreThanOrEqual(new Date(from));
    } else if (to) {
      where.scheduledAt = LessThanOrEqual(new Date(to));
    }

    const games = await this.gameRepository.find({
      where,
      relations: { players: true },
      order: { scheduledAt: 'ASC' },
    });
    return games.map((g) => this.toDto(g));
  }

  async findOne(id: string): Promise<GameDto> {
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: { players: true },
    });
    if (!game) {
      throw new NotFoundException(`Game with id ${id} not found`);
    }
    return this.toDto(game);
  }

  async create(dto: CreateGameDto): Promise<GameDto> {
    const game = this.gameRepository.create({
      scheduledAt: new Date(dto.scheduledAt),
      location: dto.location ?? null,
      players: [],
    });
    const saved = await this.gameRepository.save(game);
    await this.auditLogService.log(
      'Game',
      saved.id,
      AuditAction.CREATE,
      `Game on ${saved.scheduledAt.toISOString()} created`,
    );
    return this.toDto(saved);
  }

  async update(id: string, dto: UpdateGameDto): Promise<GameDto> {
    const game = await this.gameRepository.findOne({
      where: { id },
      relations: { players: true },
    });
    if (!game) {
      throw new NotFoundException(`Game with id ${id} not found`);
    }
    if (dto.scheduledAt !== undefined) {
      game.scheduledAt = new Date(dto.scheduledAt);
    }
    if (dto.location !== undefined) {
      game.location = dto.location;
    }
    if (dto.status !== undefined) {
      game.status = dto.status;
    }
    const saved = await this.gameRepository.save(game);
    await this.auditLogService.log(
      'Game',
      saved.id,
      AuditAction.UPDATE,
      `Game on ${saved.scheduledAt.toISOString()} updated`,
    );
    return this.toDto(saved);
  }

  async remove(id: string): Promise<void> {
    const game = await this.gameRepository.findOne({ where: { id } });
    if (!game) {
      throw new NotFoundException(`Game with id ${id} not found`);
    }
    await this.gameRepository.remove(game);
    await this.auditLogService.log(
      'Game',
      id,
      AuditAction.DELETE,
      `Game on ${game.scheduledAt.toISOString()} deleted`,
    );
  }

  async addToRoster(gameId: string, playerId: string): Promise<GameDto> {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: { players: true },
    });
    if (!game) {
      throw new NotFoundException(`Game with id ${gameId} not found`);
    }
    if (
      game.status === GameStatus.COMPLETED ||
      game.status === GameStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `Cannot add player to a ${game.status} game`,
      );
    }
    const player = await this.playerRepository.findOne({
      where: { id: playerId },
    });
    if (!player) {
      throw new NotFoundException(`Player with id ${playerId} not found`);
    }
    const alreadyRostered = game.players.some((p) => p.id === playerId);
    if (!alreadyRostered) {
      game.players.push(player);
      await this.gameRepository.save(game);
      await this.auditLogService.log(
        'Game',
        gameId,
        AuditAction.UPDATE,
        `Player '${player.name}' added to roster for game ${gameId}`,
      );
    }
    return this.toDto(game);
  }

  async removeFromRoster(gameId: string, playerId: string): Promise<void> {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: { players: true },
    });
    if (!game) {
      throw new NotFoundException(`Game with id ${gameId} not found`);
    }
    const playerIndex = game.players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1) {
      throw new NotFoundException(
        `Player with id ${playerId} not in roster for game ${gameId}`,
      );
    }
    const player = game.players[playerIndex];
    game.players.splice(playerIndex, 1);
    await this.gameRepository.save(game);
    await this.auditLogService.log(
      'Game',
      gameId,
      AuditAction.UPDATE,
      `Player '${player.name}' removed from roster for game ${gameId}`,
    );
  }
}
