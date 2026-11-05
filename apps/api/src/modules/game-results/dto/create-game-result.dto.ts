import { IsInt, Min } from 'class-validator';

export class CreateGameResultDto {
  @IsInt()
  @Min(0)
  scoreTeamA!: number;

  @IsInt()
  @Min(0)
  scoreTeamB!: number;
}
