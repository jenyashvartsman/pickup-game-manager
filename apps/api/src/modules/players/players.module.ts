import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { PlayersController } from './players.controller';
import { PlayersService } from './players.service';
import { AuditLog } from '../audit-logs/entities/audit-log.entity';
import { AuditLogService } from '../audit-logs/audit-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([Player, AuditLog])],
  controllers: [PlayersController],
  providers: [PlayersService, AuditLogService],
  exports: [AuditLogService],
})
export class PlayersModule {}
