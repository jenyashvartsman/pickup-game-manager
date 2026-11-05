import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameResult } from './entities/game-result.entity';
import { Game } from '../games/entities/game.entity';
import { AuditLog } from '../audit-logs/entities/audit-log.entity';
import { GameResultsController } from './game-results.controller';
import { GameResultsService } from './game-results.service';
import { AuditLogService } from '../audit-logs/audit-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([GameResult, Game, AuditLog])],
  controllers: [GameResultsController],
  providers: [GameResultsService, AuditLogService],
})
export class GameResultsModule {}
