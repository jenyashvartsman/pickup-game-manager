import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1762128000000 implements MigrationInterface {
  name = 'InitialSchema1762128000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "game_status_enum" AS ENUM ('scheduled', 'completed', 'cancelled')`,
    );

    await queryRunner.query(
      `CREATE TYPE "audit_action_enum" AS ENUM ('CREATE', 'UPDATE', 'DELETE')`,
    );

    await queryRunner.query(`
      CREATE TABLE "players" (
        "id"         UUID         NOT NULL DEFAULT gen_random_uuid(),
        "name"       VARCHAR(100) NOT NULL,
        "position"   VARCHAR(50)  NOT NULL,
        "created_at" TIMESTAMPTZ  NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ  NOT NULL DEFAULT now(),
        CONSTRAINT "PK_players" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "games" (
        "id"           UUID               NOT NULL DEFAULT gen_random_uuid(),
        "scheduled_at" TIMESTAMPTZ        NOT NULL,
        "location"     VARCHAR(150),
        "status"       "game_status_enum" NOT NULL DEFAULT 'scheduled',
        "created_at"   TIMESTAMPTZ        NOT NULL DEFAULT now(),
        "updated_at"   TIMESTAMPTZ        NOT NULL DEFAULT now(),
        CONSTRAINT "PK_games" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "game_roster" (
        "game_id"   UUID NOT NULL,
        "player_id" UUID NOT NULL,
        CONSTRAINT "PK_game_roster"        PRIMARY KEY ("game_id", "player_id"),
        CONSTRAINT "FK_game_roster_game"   FOREIGN KEY ("game_id")   REFERENCES "games"("id")   ON DELETE CASCADE,
        CONSTRAINT "FK_game_roster_player" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "game_results" (
        "id"           UUID        NOT NULL DEFAULT gen_random_uuid(),
        "game_id"      UUID        NOT NULL,
        "score_team_a" INTEGER     NOT NULL DEFAULT 0,
        "score_team_b" INTEGER     NOT NULL DEFAULT 0,
        "created_at"   TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at"   TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_game_results"         PRIMARY KEY ("id"),
        CONSTRAINT "UQ_game_results_game_id" UNIQUE      ("game_id"),
        CONSTRAINT "FK_game_results_game"    FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "player_stats" (
        "id"             UUID        NOT NULL DEFAULT gen_random_uuid(),
        "game_id"        UUID        NOT NULL,
        "player_id"      UUID        NOT NULL,
        "goals"          INTEGER     NOT NULL DEFAULT 0,
        "assists"        INTEGER     NOT NULL DEFAULT 0,
        "yellow_cards"   INTEGER     NOT NULL DEFAULT 0,
        "red_cards"      INTEGER     NOT NULL DEFAULT 0,
        "minutes_played" INTEGER     NOT NULL DEFAULT 0,
        "created_at"     TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at"     TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_player_stats"              PRIMARY KEY ("id"),
        CONSTRAINT "UQ_player_stats_game_player"  UNIQUE      ("game_id", "player_id"),
        CONSTRAINT "FK_player_stats_game"         FOREIGN KEY ("game_id")   REFERENCES "games"("id")   ON DELETE CASCADE,
        CONSTRAINT "FK_player_stats_player"       FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id"          UUID                  NOT NULL DEFAULT gen_random_uuid(),
        "entity_type" VARCHAR(50)           NOT NULL,
        "entity_id"   UUID                  NOT NULL,
        "action"      "audit_action_enum"   NOT NULL,
        "description" TEXT                  NOT NULL,
        "created_at"  TIMESTAMPTZ           NOT NULL DEFAULT now(),
        CONSTRAINT "PK_audit_logs" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "audit_logs"`);
    await queryRunner.query(`DROP TABLE "player_stats"`);
    await queryRunner.query(`DROP TABLE "game_results"`);
    await queryRunner.query(`DROP TABLE "game_roster"`);
    await queryRunner.query(`DROP TABLE "games"`);
    await queryRunner.query(`DROP TABLE "players"`);
    await queryRunner.query(`DROP TYPE "audit_action_enum"`);
    await queryRunner.query(`DROP TYPE "game_status_enum"`);
  }
}
