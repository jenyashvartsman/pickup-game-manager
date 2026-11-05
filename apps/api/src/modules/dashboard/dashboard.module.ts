import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from '../games/entities/game.entity';
import { PlayerStat } from '../player-stats/entities/player-stat.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([Game, PlayerStat])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
