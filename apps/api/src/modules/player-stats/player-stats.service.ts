import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlayerStat } from './entities/player-stat.entity';
import { Game } from '../games/entities/game.entity';
import { Player } from '../players/entities/player.entity';
import { UpsertPlayerStatDto } from './dto/upsert-player-stat.dto';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { AuditAction, PlayerStatDto } from 'shared-types';

@Injectable()
export class PlayerStatsService {
  constructor(
    @InjectRepository(PlayerStat)
    private readonly playerStatRepository: Repository<PlayerStat>,
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    private readonly auditLogService: AuditLogService,
  ) {}

  private toDto(stat: PlayerStat): PlayerStatDto {
    return {
      id: stat.id,
      gameId: stat.game.id,
      playerId: stat.player.id,
      goals: stat.goals,
      assists: stat.assists,
      yellowCards: stat.yellowCards,
      redCards: stat.redCards,
      minutesPlayed: stat.minutesPlayed,
      createdAt: stat.createdAt,
      updatedAt: stat.updatedAt,
    };
  }

  async getStats(gameId: string): Promise<PlayerStatDto[]> {
    const stats = await this.playerStatRepository.find({
      where: { game: { id: gameId } },
      relations: { game: true, player: true },
    });
    return stats.map((s) => this.toDto(s));
  }

  async upsertStats(
    gameId: string,
    dtos: UpsertPlayerStatDto[],
  ): Promise<PlayerStatDto[]> {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: { players: true },
    });
    if (!game) {
      throw new NotFoundException(`Game with id ${gameId} not found`);
    }

    const rosterMap = new Map<string, Player>(
      game.players.map((p) => [p.id, p]),
    );

    const results: PlayerStatDto[] = [];

    for (const dto of dtos) {
      if (!rosterMap.has(dto.playerId)) {
        throw new BadRequestException(
          `Player ${dto.playerId} is not on the roster for game ${gameId}`,
        );
      }

      // rosterMap.has() check above guarantees the value is present
      const player = rosterMap.get(dto.playerId) as Player;

      const existing = await this.playerStatRepository.findOne({
        where: { game: { id: gameId }, player: { id: dto.playerId } },
        relations: { game: true, player: true },
      });

      let saved: PlayerStat;

      if (!existing) {
        const stat = this.playerStatRepository.create({
          game,
          player,
          goals: dto.goals ?? 0,
          assists: dto.assists ?? 0,
          yellowCards: dto.yellowCards ?? 0,
          redCards: dto.redCards ?? 0,
          minutesPlayed: dto.minutesPlayed ?? 0,
        });
        saved = await this.playerStatRepository.save(stat);
        await this.auditLogService.log(
          'PlayerStat',
          saved.id,
          AuditAction.CREATE,
          `Stats created for player '${player.name}' in game ${gameId}`,
        );
      } else {
        if (dto.goals !== undefined) existing.goals = dto.goals;
        if (dto.assists !== undefined) existing.assists = dto.assists;
        if (dto.yellowCards !== undefined) existing.yellowCards = dto.yellowCards;
        if (dto.redCards !== undefined) existing.redCards = dto.redCards;
        if (dto.minutesPlayed !== undefined) existing.minutesPlayed = dto.minutesPlayed;
        saved = await this.playerStatRepository.save(existing);
        await this.auditLogService.log(
          'PlayerStat',
          saved.id,
          AuditAction.UPDATE,
          `Stats updated for player '${player.name}' in game ${gameId}`,
        );
      }

      results.push(this.toDto(saved));
    }

    return results;
  }
}
