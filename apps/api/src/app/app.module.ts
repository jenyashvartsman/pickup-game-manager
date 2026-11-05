import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayersModule } from '../modules/players/players.module';
import { GamesModule } from '../modules/games/games.module';
import { GameResultsModule } from '../modules/game-results/game-results.module';
import { PlayerStatsModule } from '../modules/player-stats/player-stats.module';
import { DashboardModule } from '../modules/dashboard/dashboard.module';
import { Player } from '../modules/players/entities/player.entity';
import { Game } from '../modules/games/entities/game.entity';
import { GameResult } from '../modules/game-results/entities/game-result.entity';
import { PlayerStat } from '../modules/player-stats/entities/player-stat.entity';
import { AuditLog } from '../modules/audit-logs/entities/audit-log.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('POSTGRES_HOST', 'localhost'),
        port: config.get<number>('POSTGRES_PORT', 5432),
        database: config.get<string>('POSTGRES_DB', 'pickup_game'),
        username: config.get<string>('POSTGRES_USER', 'pguser'),
        password: config.get<string>('POSTGRES_PASSWORD', 'pgpassword'),
        entities: [Player, Game, GameResult, PlayerStat, AuditLog],
        migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
        synchronize: false,
        logging: config.get<string>('NODE_ENV') === 'development',
      }),
    }),
    PlayersModule,
    GamesModule,
    GameResultsModule,
    PlayerStatsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
