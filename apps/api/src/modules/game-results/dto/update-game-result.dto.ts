import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateGameResultDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  scoreTeamA?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  scoreTeamB?: number;
}
