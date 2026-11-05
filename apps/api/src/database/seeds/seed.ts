import 'dotenv/config';
import { AppDataSource } from '../data-source';
import { Player } from '../../modules/players/entities/player.entity';
import { Game } from '../../modules/games/entities/game.entity';
import { GameResult } from '../../modules/game-results/entities/game-result.entity';
import { PlayerStat } from '../../modules/player-stats/entities/player-stat.entity';
import { PLAYERS_FIXTURE } from './players.fixture';
import { GAMES_FIXTURE } from './games.fixture';

async function seed(): Promise<void> {
  await AppDataSource.initialize();

  const playerRepo = AppDataSource.getRepository(Player);
  const gameRepo = AppDataSource.getRepository(Game);
  const gameResultRepo = AppDataSource.getRepository(GameResult);
  const playerStatRepo = AppDataSource.getRepository(PlayerStat);

  // Truncate in FK-safe order (children before parents)
  await AppDataSource.query('TRUNCATE TABLE audit_logs CASCADE');
  await AppDataSource.query('TRUNCATE TABLE player_stats CASCADE');
  await AppDataSource.query('TRUNCATE TABLE game_results CASCADE');
  await AppDataSource.query('TRUNCATE TABLE game_roster CASCADE');
  await AppDataSource.query('TRUNCATE TABLE games CASCADE');
  await AppDataSource.query('TRUNCATE TABLE players CASCADE');

  console.log('Tables truncated.');

  // Insert players
  const players = playerRepo.create(PLAYERS_FIXTURE);
  const savedPlayers = await playerRepo.save(players);
  console.log(`Inserted ${savedPlayers.length} players.`);

  // Insert games, results, and player stats
  for (const fixture of GAMES_FIXTURE) {
    const roster = fixture.rosterIndices.map((i) => savedPlayers[i]);

    const game = gameRepo.create({
      scheduledAt: fixture.scheduledAt,
      location: fixture.location,
      status: fixture.status,
      players: roster,
    });
    const savedGame = await gameRepo.save(game);

    if (fixture.result) {
      const result = gameResultRepo.create({
        game: savedGame,
        scoreTeamA: fixture.result.scoreTeamA,
        scoreTeamB: fixture.result.scoreTeamB,
      });
      await gameResultRepo.save(result);
    }

    if (fixture.playerStats) {
      const stats = fixture.playerStats.map((s) =>
        playerStatRepo.create({
          game: savedGame,
          player: savedPlayers[s.playerIndex],
          goals: s.goals,
          assists: s.assists,
          yellowCards: s.yellowCards,
          redCards: s.redCards,
          minutesPlayed: s.minutesPlayed,
        }),
      );
      await playerStatRepo.save(stats);
    }

    console.log(`Inserted game: ${fixture.location} [${fixture.status}]`);
  }

  await AppDataSource.destroy();
  console.log('Seed complete.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
