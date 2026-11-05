import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';

export class UpsertPlayerStatDto {
  @IsUUID()
  playerId!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  goals?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  assists?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  yellowCards?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  redCards?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  minutesPlayed?: number;
}
