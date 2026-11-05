import {
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  Put,
} from '@nestjs/common';
import { PlayerStatsService } from './player-stats.service';
import { UpsertPlayerStatDto } from './dto/upsert-player-stat.dto';
import { PlayerStatDto } from 'shared-types';

@Controller('games')
export class PlayerStatsController {
  constructor(private readonly playerStatsService: PlayerStatsService) {}

  @Get(':id/stats')
  getStats(@Param('id') id: string): Promise<PlayerStatDto[]> {
    return this.playerStatsService.getStats(id);
  }

  @Put(':id/stats')
  upsertStats(
    @Param('id') id: string,
    @Body(new ParseArrayPipe({ items: UpsertPlayerStatDto }))
    stats: UpsertPlayerStatDto[],
  ): Promise<PlayerStatDto[]> {
    return this.playerStatsService.upsertStats(id, stats);
  }
}
