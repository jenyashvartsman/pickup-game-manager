import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Game } from '../../games/entities/game.entity';
import { Player } from '../../players/entities/player.entity';

@Entity('player_stats')
@Unique(['game', 'player'])
export class PlayerStat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer', default: 0 })
  goals: number;

  @Column({ type: 'integer', default: 0 })
  assists: number;

  @Column({ type: 'integer', name: 'yellow_cards', default: 0 })
  yellowCards: number;

  @Column({ type: 'integer', name: 'red_cards', default: 0 })
  redCards: number;

  @Column({ type: 'integer', name: 'minutes_played', default: 0 })
  minutesPlayed: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Game, (game) => game.stats)
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @ManyToOne(() => Player, (player) => player.stats)
  @JoinColumn({ name: 'player_id' })
  player: Player;
}
