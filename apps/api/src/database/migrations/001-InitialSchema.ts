import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1762387200000 implements MigrationInterface {
  name = 'InitialSchema1762387200000';

  async up(queryRunner: QueryRunner): Promise<void> {
    // Enum types
    await queryRunner.query(
      `CREATE TYPE "games_status_enum" AS ENUM ('scheduled', 'completed', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TYPE "audit_logs_action_enum" AS ENUM ('CREATE', 'UPDATE', 'DELETE')`,
    );

    // players
    await queryRunner.query(`
      CREATE TABLE "players" (
        "id"         uuid                     NOT NULL DEFAULT gen_random_uuid(),
        "name"       character varying(100)   NOT NULL,
        "position"   character varying(50)    NOT NULL,
        "created_at" TIMESTAMPTZ              NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ              NOT NULL DEFAULT now(),
        CONSTRAINT "PK_players" PRIMARY KEY ("id")
      )
    `);

    // games
    await queryRunner.query(`
      CREATE TABLE "games" (
        "id"           uuid                   NOT NULL DEFAULT gen_random_uuid(),
        "scheduled_at" TIMESTAMPTZ            NOT NULL,
        "location"     character varying(150),
        "status"       "games_status_enum"    NOT NULL DEFAULT 'scheduled',
        "created_at"   TIMESTAMPTZ            NOT NULL DEFAULT now(),
        "updated_at"   TIMESTAMPTZ            NOT NULL DEFAULT now(),
        CONSTRAINT "PK_games" PRIMARY KEY ("id")
      )
    `);

    // game_roster (join table with composite PK)
    await queryRunner.query(`
      CREATE TABLE "game_roster" (
        "game_id"   uuid NOT NULL,
        "player_id" uuid NOT NULL,
        CONSTRAINT "PK_game_roster" PRIMARY KEY ("game_id", "player_id")
      )
    `);

    // game_results
    await queryRunner.query(`
      CREATE TABLE "game_results" (
        "id"           uuid    NOT NULL DEFAULT gen_random_uuid(),
        "game_id"      uuid    NOT NULL,
        "score_team_a" integer NOT NULL DEFAULT 0,
        "score_team_b" integer NOT NULL DEFAULT 0,
        "created_at"   TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at"   TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_game_results"        PRIMARY KEY ("id"),
        CONSTRAINT "UQ_game_results_game_id" UNIQUE      ("game_id")
      )
    `);

    // player_stats
    await queryRunner.query(`
      CREATE TABLE "player_stats" (
        "id"             uuid    NOT NULL DEFAULT gen_random_uuid(),
        "game_id"        uuid    NOT NULL,
        "player_id"      uuid    NOT NULL,
        "goals"          integer NOT NULL DEFAULT 0,
        "assists"        integer NOT NULL DEFAULT 0,
        "yellow_cards"   integer NOT NULL DEFAULT 0,
        "red_cards"      integer NOT NULL DEFAULT 0,
        "minutes_played" integer NOT NULL DEFAULT 0,
        "created_at"     TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at"     TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_player_stats"              PRIMARY KEY ("id"),
        CONSTRAINT "UQ_player_stats_game_player"  UNIQUE      ("game_id", "player_id")
      )
    `);

    // audit_logs
    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id"          uuid                      NOT NULL DEFAULT gen_random_uuid(),
        "entity_type" character varying(50)     NOT NULL,
        "entity_id"   uuid                      NOT NULL,
        "action"      "audit_logs_action_enum"  NOT NULL,
        "description" text                      NOT NULL,
        "created_at"  TIMESTAMPTZ               NOT NULL DEFAULT now(),
        CONSTRAINT "PK_audit_logs" PRIMARY KEY ("id")
      )
    `);

    // Foreign keys — game_roster
    await queryRunner.query(`
      ALTER TABLE "game_roster"
        ADD CONSTRAINT "FK_game_roster_game_id"
          FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "game_roster"
        ADD CONSTRAINT "FK_game_roster_player_id"
          FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE
    `);

    // Foreign keys — game_results
    await queryRunner.query(`
      ALTER TABLE "game_results"
        ADD CONSTRAINT "FK_game_results_game_id"
          FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE
    `);

    // Foreign keys — player_stats
    await queryRunner.query(`
      ALTER TABLE "player_stats"
        ADD CONSTRAINT "FK_player_stats_game_id"
          FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "player_stats"
        ADD CONSTRAINT "FK_player_stats_player_id"
          FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "player_stats"  DROP CONSTRAINT "FK_player_stats_player_id"`);
    await queryRunner.query(`ALTER TABLE "player_stats"  DROP CONSTRAINT "FK_player_stats_game_id"`);
    await queryRunner.query(`ALTER TABLE "game_results"  DROP CONSTRAINT "FK_game_results_game_id"`);
    await queryRunner.query(`ALTER TABLE "game_roster"   DROP CONSTRAINT "FK_game_roster_player_id"`);
    await queryRunner.query(`ALTER TABLE "game_roster"   DROP CONSTRAINT "FK_game_roster_game_id"`);

    await queryRunner.query(`DROP TABLE "audit_logs"`);
    await queryRunner.query(`DROP TABLE "player_stats"`);
    await queryRunner.query(`DROP TABLE "game_results"`);
    await queryRunner.query(`DROP TABLE "game_roster"`);
    await queryRunner.query(`DROP TABLE "games"`);
    await queryRunner.query(`DROP TABLE "players"`);

    await queryRunner.query(`DROP TYPE "audit_logs_action_enum"`);
    await queryRunner.query(`DROP TYPE "games_status_enum"`);
  }
}
