# GitHub Secrets Setup

The Supabase deployment workflow relies on three repository secrets. These **must be added through the GitHub UI**, not committed to version control.

## Required secrets

| Secret name | Description |
| --- | --- |
| `SUPABASE_ACCESS_TOKEN` | Personal access token from https://supabase.com/dashboard/account/tokens with database deployment permissions. |
| `SUPABASE_PROJECT_REF` | Your Supabase project reference (format: `xxxxxxxxxxxxxxxxxxxx`). |
| `SUPABASE_DB_PASSWORD` | Database password created when the Supabase project was provisioned. |

## How to add the secrets

1. Open the GitHub repository in a browser.
2. Go to **Settings → Secrets and variables → Actions → New repository secret**.
3. Enter the name (`SUPABASE_ACCESS_TOKEN`), paste the value, and click **Add secret**.
4. Repeat for `SUPABASE_PROJECT_REF` and `SUPABASE_DB_PASSWORD`.

> 🔐 Never commit these values to the repository. They should live only in GitHub Secrets (for CI) and in your local environment when running the PowerShell deployment script.

Once the secrets are present, the workflow `.github/workflows/deploy-supabase.yml` can run automatically on every push to `main`, or manually via **Actions → Deploy Supabase → Run workflow**.
