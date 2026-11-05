import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { GameResultsService } from './game-results.service';
import { CreateGameResultDto } from './dto/create-game-result.dto';
import { UpdateGameResultDto } from './dto/update-game-result.dto';
import { GameResultDto } from 'shared-types';

@Controller('games')
export class GameResultsController {
  constructor(private readonly gameResultsService: GameResultsService) {}

  @Get(':id/result')
  getResult(@Param('id') id: string): Promise<GameResultDto> {
    return this.gameResultsService.getResult(id);
  }

  @Post(':id/result')
  @HttpCode(HttpStatus.CREATED)
  createResult(
    @Param('id') id: string,
    @Body() dto: CreateGameResultDto,
  ): Promise<GameResultDto> {
    return this.gameResultsService.createResult(id, dto);
  }

  @Patch(':id/result')
  updateResult(
    @Param('id') id: string,
    @Body() dto: UpdateGameResultDto,
  ): Promise<GameResultDto> {
    return this.gameResultsService.updateResult(id, dto);
  }
}
