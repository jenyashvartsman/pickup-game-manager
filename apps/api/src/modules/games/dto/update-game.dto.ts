import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { GameStatus } from 'shared-types';

export class UpdateGameDto {
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  location?: string;

  @IsOptional()
  @IsEnum(GameStatus)
  status?: GameStatus;
}
