import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateGameDto {
  @IsDateString()
  scheduledAt!: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  location?: string;
}
