import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerStat } from './entities/player-stat.entity';
import { Game } from '../games/entities/game.entity';
import { AuditLog } from '../audit-logs/entities/audit-log.entity';
import { PlayerStatsController } from './player-stats.controller';
import { PlayerStatsService } from './player-stats.service';
import { AuditLogService } from '../audit-logs/audit-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlayerStat, Game, AuditLog])],
  controllers: [PlayerStatsController],
  providers: [PlayerStatsService, AuditLogService],
})
export class PlayerStatsModule {}
