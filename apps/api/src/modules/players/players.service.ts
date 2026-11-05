import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { AuditLogService } from '../audit-logs/audit-log.service';
import { AuditAction, PlayerDto } from 'shared-types';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
    private readonly auditLogService: AuditLogService,
  ) {}

  private toDto(player: Player): PlayerDto {
    return {
      id: player.id,
      name: player.name,
      position: player.position,
      createdAt: player.createdAt,
      updatedAt: player.updatedAt,
    };
  }

  async findAll(): Promise<PlayerDto[]> {
    const players = await this.playerRepository.find();
    return players.map((p) => this.toDto(p));
  }

  async findOne(id: string): Promise<PlayerDto> {
    const player = await this.playerRepository.findOne({ where: { id } });
    if (!player) {
      throw new NotFoundException(`Player with id ${id} not found`);
    }
    return this.toDto(player);
  }

  async create(dto: CreatePlayerDto): Promise<PlayerDto> {
    const player = this.playerRepository.create(dto);
    const saved = await this.playerRepository.save(player);
    await this.auditLogService.log(
      'Player',
      saved.id,
      AuditAction.CREATE,
      `Player '${saved.name}' created`,
    );
    return this.toDto(saved);
  }

  async update(id: string, dto: UpdatePlayerDto): Promise<PlayerDto> {
    const player = await this.playerRepository.findOne({ where: { id } });
    if (!player) {
      throw new NotFoundException(`Player with id ${id} not found`);
    }
    Object.assign(player, dto);
    const saved = await this.playerRepository.save(player);
    await this.auditLogService.log(
      'Player',
      saved.id,
      AuditAction.UPDATE,
      `Player '${saved.name}' updated`,
    );
    return this.toDto(saved);
  }

  async remove(id: string): Promise<void> {
    const player = await this.playerRepository.findOne({ where: { id } });
    if (!player) {
      throw new NotFoundException(`Player with id ${id} not found`);
    }
    await this.playerRepository.remove(player);
    await this.auditLogService.log(
      'Player',
      id,
      AuditAction.DELETE,
      `Player '${player.name}' deleted`,
    );
  }
}
