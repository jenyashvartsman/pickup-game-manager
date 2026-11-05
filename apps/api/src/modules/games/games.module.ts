import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Player } from '../players/entities/player.entity';
import { AuditLog } from '../audit-logs/entities/audit-log.entity';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { AuditLogService } from '../audit-logs/audit-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Player, AuditLog])],
  controllers: [GamesController],
  providers: [GamesService, AuditLogService],
})
export class GamesModule {}
