# Command: docker-logs

View logs from running Docker containers.

## Commands

```bash
# View PostgreSQL logs (live, follow mode)
docker compose logs postgres -f

# View last 50 lines of PostgreSQL logs
docker compose logs postgres --tail=50

# View logs from all services
docker compose logs -f
```

## When to use
- Diagnosing a database connection failure
- Checking for migration or startup errors in PostgreSQL
- Confirming PostgreSQL is ready to accept connections (look for `database system is ready to accept connections`)
