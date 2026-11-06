import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayerStatsService } from '../player-stats/player-stats.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { PlayerDto, PlayerStatDto } from 'shared-types';

@Controller('players')
export class PlayersController {
  constructor(
    private readonly playersService: PlayersService,
    private readonly playerStatsService: PlayerStatsService,
  ) {}

  @Get()
  findAll(): Promise<PlayerDto[]> {
    return this.playersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PlayerDto> {
    return this.playersService.findOne(id);
  }

  @Get(':id/stats')
  getPlayerStats(@Param('id') id: string): Promise<PlayerStatDto[]> {
    return this.playerStatsService.getStatsByPlayer(id);
  }

  @Post()
  create(@Body() dto: CreatePlayerDto): Promise<PlayerDto> {
    return this.playersService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePlayerDto,
  ): Promise<PlayerDto> {
    return this.playersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.playersService.remove(id);
  }
}
