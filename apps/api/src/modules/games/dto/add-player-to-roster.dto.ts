import { IsUUID } from 'class-validator';

export class AddPlayerToRosterDto {
  @IsUUID()
  playerId!: string;
}
