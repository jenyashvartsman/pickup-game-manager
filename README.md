# Pickup Game Manager

A pickup soccer game management tool for a single admin. The admin creates and manages players, schedules games on a weekly calendar, records game results and per-player stats, and monitors performance through game and player dashboards. Players can browse schedules and their own stats without any login.

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 22 (signals) |
| Backend | NestJS 11 |
| Database | PostgreSQL 16 |
| ORM | TypeORM |
| Monorepo | Nx 24 |
| Local infrastructure | Docker Compose |

---

## Prerequisites

- **Node.js** 20+ and **npm** 11+
- **Docker Desktop** (for the local PostgreSQL instance)
- **Nx CLI** — installed as a local devDependency; use `npx nx` or install globally: `npm install -g nx`

---

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

This starts a PostgreSQL 16 container on port `5432` and a pgAdmin instance on port `5050`.

Default credentials (overridable via `.env`):

| Variable | Default |
|----------|---------|
| `POSTGRES_DB` | `pickup_game` |
| `POSTGRES_USER` | `pguser` |
| `POSTGRES_PASSWORD` | `pgpassword` |
| `POSTGRES_PORT` | `5432` |

### 3. Run database migrations

```bash
npm run migration:run
```

This applies all pending TypeORM migrations to the `pickup_game` database.

### 4. Seed the database (optional)

```bash
npm run seed
```

Drops all tables, re-runs migrations, and inserts sample data: ~15 players, 4 weeks of scheduled games, and results + stats for past games.

> **Warning:** This is destructive. Do not run against a database with data you want to keep.

### 5. Start the API

```bash
npm run start:api
# or
npx nx serve api
```

The API runs at `http://localhost:3000/api`.

### 6. Start the Angular app

```bash
npm run start:web
# or
npx nx serve web
```

The app runs at `http://localhost:4200`.

---

## Project Structure

```
pickup-game-manager/
├── apps/
│   ├── web/                  ← Angular frontend (signals)
│   └── api/                  ← NestJS REST API
├── libs/
│   └── shared-types/         ← DTOs shared between apps
├── docker-compose.yml
├── nx.json
└── package.json
```

---

## Nx Commands Reference

### Development

| Command | Description |
|---------|-------------|
| `npx nx serve web` | Start Angular dev server (port 4200) |
| `npx nx serve api` | Start NestJS dev server (port 3000) |

### Testing

| Command | Description |
|---------|-------------|
| `npx nx test web --watch=false` | Run Angular unit tests once |
| `npx nx test api --watch=false` | Run NestJS unit tests once |
| `npm test` | Run all tests across both apps |

### Building

| Command | Description |
|---------|-------------|
| `npx nx build web` | Build Angular app |
| `npx nx build web --configuration=production` | Production build (tree-shaken, lazy chunks) |
| `npx nx build api` | Build NestJS app |
| `npm run build` | Build all projects |

### Linting

| Command | Description |
|---------|-------------|
| `npx nx lint web` | Lint Angular app |
| `npx nx lint api` | Lint NestJS app |
| `npm run lint` | Lint all projects |

### Database

| Command | Description |
|---------|-------------|
| `npm run migration:run` | Apply all pending migrations |
| `npm run migration:revert` | Revert the last migration |
| `npm run seed` | Drop, migrate, and seed the database |

### Docker

| Command | Description |
|---------|-------------|
| `npm run docker:up` | Start PostgreSQL + pgAdmin in background |
| `npm run docker:down` | Stop all containers |
| `npm run docker:logs` | View PostgreSQL logs |

---

## API Endpoints

Base URL: `http://localhost:3000/api`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/players` | List all players |
| POST | `/players` | Create a player |
| GET | `/players/:id` | Get a player |
| PATCH | `/players/:id` | Update a player |
| DELETE | `/players/:id` | Delete a player |
| GET | `/games` | List all games |
| POST | `/games` | Schedule a game |
| GET | `/games/:id` | Get a game |
| PATCH | `/games/:id` | Update a game |
| DELETE | `/games/:id` | Delete a game |
| POST | `/games/:id/roster` | Set game roster |
| GET | `/game-results/:gameId` | Get game result |
| POST | `/game-results` | Create game result |
| PATCH | `/game-results/:id` | Update game result |
| GET | `/player-stats/game/:gameId` | Stats for a game |
| GET | `/player-stats/player/:playerId` | Stats for a player |
| POST | `/player-stats` | Create player stat |
| PATCH | `/player-stats/:id` | Update player stat |
| GET | `/dashboard/stats` | Main dashboard summary |

---

## pgAdmin

pgAdmin is available at `http://localhost:5050` after running `docker compose up -d`.

Default login: `admin@local.dev` / `admin`

Add a server connection with:
- Host: `postgres` (the Docker service name)
- Port: `5432`
- Database: `pickup_game`
- Username: `pguser`
- Password: `pgpassword`
