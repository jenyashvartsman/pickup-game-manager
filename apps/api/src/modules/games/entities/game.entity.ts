import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GameStatus } from 'shared-types';
import { Player } from '../../players/entities/player.entity';
import { GameResult } from '../../game-results/entities/game-result.entity';
import { PlayerStat } from '../../player-stats/entities/player-stat.entity';

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'timestamptz', name: 'scheduled_at' })
  scheduledAt!: Date;

  @Column({ type: 'varchar', length: 150, nullable: true })
  location!: string | null;

  @Column({
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.SCHEDULED,
  })
  status!: GameStatus;

  @ManyToMany(() => Player, (player) => player.games)
  @JoinTable({
    name: 'game_roster',
    joinColumn: { name: 'game_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'player_id', referencedColumnName: 'id' },
  })
  players!: Player[];

  @OneToOne(() => GameResult, (result) => result.game)
  result!: GameResult | null;

  @OneToMany(() => PlayerStat, (stat) => stat.game)
  playerStats!: PlayerStat[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;
}
