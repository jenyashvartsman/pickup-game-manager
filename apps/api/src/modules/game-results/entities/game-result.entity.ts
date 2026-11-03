import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Game } from '../../games/entities/game.entity';

@Entity('game_results')
export class GameResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer', name: 'score_team_a', default: 0 })
  scoreTeamA: number;

  @Column({ type: 'integer', name: 'score_team_b', default: 0 })
  scoreTeamB: number;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => Game, (game) => game.result)
  @JoinColumn({ name: 'game_id' })
  game: Game;
}
