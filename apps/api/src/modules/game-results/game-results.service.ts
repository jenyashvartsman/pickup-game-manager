import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GameResult } from './entities/game-result.entity';
import { Game } from '../games/entities/game.entity';
import { CreateGameResultDto } from './dto/create-game-result.dto';
import { UpdateGameResultDto } from './dto/update-game-result.dto';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { AuditAction, GameResultDto, GameStatus } from 'shared-types';

@Injectable()
export class GameResultsService {
  constructor(
    @InjectRepository(GameResult)
    private readonly gameResultRepository: Repository<GameResult>,
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    private readonly auditLogService: AuditLogService,
  ) {}

  private toDto(result: GameResult): GameResultDto {
    return {
      id: result.id,
      gameId: result.game.id,
      scoreTeamA: result.scoreTeamA,
      scoreTeamB: result.scoreTeamB,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  async getResult(gameId: string): Promise<GameResultDto> {
    const result = await this.gameResultRepository.findOne({
      where: { game: { id: gameId } },
      relations: { game: true },
    });
    if (!result) {
      throw new NotFoundException(`Result for game ${gameId} not found`);
    }
    return this.toDto(result);
  }

  async createResult(
    gameId: string,
    dto: CreateGameResultDto,
  ): Promise<GameResultDto> {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });
    if (!game) {
      throw new NotFoundException(`Game with id ${gameId} not found`);
    }
    if (game.status === GameStatus.CANCELLED) {
      throw new BadRequestException(
        `Cannot add a result to a cancelled game`,
      );
    }
    const result = this.gameResultRepository.create({
      game,
      scoreTeamA: dto.scoreTeamA,
      scoreTeamB: dto.scoreTeamB,
    });
    const saved = await this.gameResultRepository.save(result);
    game.status = GameStatus.COMPLETED;
    await this.gameRepository.save(game);
    await this.auditLogService.log(
      'GameResult',
      saved.id,
      AuditAction.CREATE,
      `Result created for game ${gameId}: ${dto.scoreTeamA}-${dto.scoreTeamB}`,
    );
    return this.toDto(saved);
  }

  async updateResult(
    gameId: string,
    dto: UpdateGameResultDto,
  ): Promise<GameResultDto> {
    const result = await this.gameResultRepository.findOne({
      where: { game: { id: gameId } },
      relations: { game: true },
    });
    if (!result) {
      throw new NotFoundException(`Result for game ${gameId} not found`);
    }
    if (dto.scoreTeamA !== undefined) {
      result.scoreTeamA = dto.scoreTeamA;
    }
    if (dto.scoreTeamB !== undefined) {
      result.scoreTeamB = dto.scoreTeamB;
    }
    const saved = await this.gameResultRepository.save(result);
    await this.auditLogService.log(
      'GameResult',
      saved.id,
      AuditAction.UPDATE,
      `Result updated for game ${gameId}: ${saved.scoreTeamA}-${saved.scoreTeamB}`,
    );
    return this.toDto(saved);
  }
}
