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
  Query,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { AddPlayerToRosterDto } from './dto/add-player-to-roster.dto';
import { GameDto } from 'shared-types';

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Get()
  findAll(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<GameDto[]> {
    return this.gamesService.findAll(from, to);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<GameDto> {
    return this.gamesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateGameDto): Promise<GameDto> {
    return this.gamesService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateGameDto,
  ): Promise<GameDto> {
    return this.gamesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.gamesService.remove(id);
  }

  @Post(':id/roster')
  addToRoster(
    @Param('id') id: string,
    @Body() dto: AddPlayerToRosterDto,
  ): Promise<GameDto> {
    return this.gamesService.addToRoster(id, dto.playerId);
  }

  @Delete(':id/roster/:playerId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeFromRoster(
    @Param('id') id: string,
    @Param('playerId') playerId: string,
  ): Promise<void> {
    return this.gamesService.removeFromRoster(id, playerId);
  }
}
