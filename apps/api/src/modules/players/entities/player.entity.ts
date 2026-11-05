import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Game } from '../../games/entities/game.entity';
import { PlayerStat } from '../../player-stats/entities/player-stat.entity';

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 50 })
  position!: string;

  @ManyToMany(() => Game, (game) => game.players)
  games!: Game[];

  @OneToMany(() => PlayerStat, (stat) => stat.player)
  stats!: PlayerStat[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;
}
