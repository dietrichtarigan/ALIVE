# Supabase Deployment Automation

This project now includes a repeatable Supabase deployment flow that works both locally and in CI.

## 1. Required environment variables

Define the following secrets/variables before running any automation:

| Name | Notes |
| --- | --- |
| `SUPABASE_ACCESS_TOKEN` | Generate from https://supabase.com/dashboard/account/tokens (needs database permissions). |
| `SUPABASE_PROJECT_REF` | The project reference, e.g. `iwjcvxsmaeeqvjxjmerm`. |
| `SUPABASE_DB_PASSWORD` | The database password from the Supabase dashboard. |

> ⚠️ Never commit these values. Store them in `.env.local`, GitHub Secrets, or a secure secrets manager only.

## 2. Local one-liner (PowerShell)

Run migrations remotely (and optionally apply idempotent seed data) straight from your workstation:

```powershell
# Ensure Node.js/npm (for npx), Supabase CLI, and psql are installed/on PATH
$env:SUPABASE_ACCESS_TOKEN = '<token>'
$env:SUPABASE_PROJECT_REF = '<project-ref>'
$env:SUPABASE_DB_PASSWORD = '<db-password>'

# Apply migrations and seeds
powershell -ExecutionPolicy Bypass -File script/deploy-supabase.ps1

# Skip seeds if you want to run migrations only
powershell -ExecutionPolicy Bypass -File script/deploy-supabase.ps1 -SkipSeeds
```

The script will:

1. Link the local repo to the target Supabase project (`supabase link`).
2. Push all pending SQL migrations (`supabase db push`).
3. Execute seed files via `psql` (defaults to `supabase/seed/002_arcade_initial_content.sql`).

Seeds use `ON_ERROR_STOP` so the command aborts if any statement fails.

## 3. GitHub Actions auto-deploy

The workflow `.github/workflows/deploy-supabase.yml` keeps the remote database schema synchronized on every push to `main` (and supports manual runs via "Run workflow").

Steps performed:

1. Install the Supabase CLI (`supabase/setup-cli@v1`).
2. Link the project using `SUPABASE_PROJECT_REF` and `SUPABASE_DB_PASSWORD`.
3. Run `supabase db push --linked --non-interactive` to apply migrations.

### GitHub Secrets to configure

Add these secrets in **Settings → Secrets and variables → Actions**:

- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_PROJECT_REF`
- `SUPABASE_DB_PASSWORD`

The job short-circuits if any secret is missing so it is safe to keep the workflow committed even before secrets are set.

## 4. Recommended workflow

1. Make schema changes locally using `supabase db diff` to create new SQL migrations.
2. Commit migrations and open a PR.
3. Once PR merges to `main`, the GitHub Action pushes migrations automatically.
4. (Optional) Run `script/deploy-supabase.ps1` with `-SkipSeeds` during PR review to validate migrations in a staging project.
5. Run with seeds (default) when you need to refresh demo content.

## 5. Troubleshooting

- **`npx supabase` not found** – install Node.js 18+ and rerun.
- **`psql` missing** – install the PostgreSQL client tools or rerun with `-SkipSeeds`.
- **Auth errors** – double-check that the access token was generated with the same organization as the project.
- **Conflicting data during seeding** – seeds stop on error; adjust seed SQL or run with `-SkipSeeds` if you want to preserve production data.
