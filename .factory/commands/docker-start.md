# Command: docker-start

Start the local development infrastructure (PostgreSQL).

## Command

```bash
docker compose up -d
```

The `docker-compose.yml` is at the project root.

## What starts
- `postgres` — PostgreSQL database on port 5432

## Success
```
Container pickup-game-manager-postgres-1  Started
```

Verify with:
```bash
docker compose ps
```
All services show `running`.

## On Failure
1. Check that Docker Desktop is running
2. Check for port conflicts on 5432: another PostgreSQL instance may be using it
3. Run `docker compose logs postgres` to see startup errors
4. If the container is in a restart loop, run `docker compose down -v` (requires developer approval) then `docker compose up -d`
