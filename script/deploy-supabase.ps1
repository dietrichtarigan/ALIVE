param(
  [string]$ProjectRef = $env:SUPABASE_PROJECT_REF,
  [string]$DbPassword = $env:SUPABASE_DB_PASSWORD,
  [string]$AccessToken = $env:SUPABASE_ACCESS_TOKEN,
  [string[]]$SeedFiles = @("supabase/seed/002_arcade_initial_content.sql"),
  [switch]$SkipSeeds
)

function Require-Value {
  param(
    [string]$Value,
    [string]$Name
  )

  if ([string]::IsNullOrWhiteSpace($Value)) {
    throw "Missing required value for $Name. Provide it via parameter or environment variable."
  }
}

function Invoke-Supabase {
  param([string[]]$Args)

  if (Get-Command supabase -ErrorAction SilentlyContinue) {
    & supabase @Args
    if ($LASTEXITCODE -ne 0) {
      throw "Command 'supabase $Args' failed with exit code $LASTEXITCODE."
    }
    return
  }

  if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
    throw 'Neither supabase CLI nor npx was found on PATH.'
  }

  $commandArgs = @('--yes', 'supabase@latest') + $Args
  & npx @commandArgs
  if ($LASTEXITCODE -ne 0) {
    throw "Command 'npx --yes supabase@latest $Args' failed with exit code $LASTEXITCODE."
  }
}

Require-Value -Value $ProjectRef -Name 'SUPABASE_PROJECT_REF'
Require-Value -Value $DbPassword -Name 'SUPABASE_DB_PASSWORD'
Require-Value -Value $AccessToken -Name 'SUPABASE_ACCESS_TOKEN'

$env:SUPABASE_ACCESS_TOKEN = $AccessToken

Write-Host 'Linking Supabase project...' -ForegroundColor Cyan
Invoke-Supabase -Args @('link', '--project-ref', $ProjectRef, '--password', $DbPassword, '--non-interactive', '--yes')

Write-Host 'Pushing database migrations...' -ForegroundColor Cyan
Invoke-Supabase -Args @('db', 'push', '--linked', '--non-interactive')

if ($SkipSeeds) {
  Write-Host 'Skipping seed execution as requested.' -ForegroundColor Yellow
  exit 0
}

if (-not (Get-Command psql -ErrorAction SilentlyContinue)) {
  Write-Warning 'psql not found on PATH. Seeds were not applied. Install PostgreSQL client or rerun with -SkipSeeds.'
  exit 0
}

$encodedPassword = [System.Uri]::EscapeDataString($DbPassword)
$dbUrl = "postgresql://postgres:$encodedPassword@db.$ProjectRef.supabase.co:5432/postgres"

foreach ($seedFile in $SeedFiles) {
  if (-not (Test-Path $seedFile)) {
    Write-Warning "Seed file '$seedFile' not found. Skipping."
    continue
  }

  Write-Host "Applying seed: $seedFile" -ForegroundColor Cyan
  & psql $dbUrl -v ON_ERROR_STOP=1 -f $seedFile
  if ($LASTEXITCODE -ne 0) {
    throw "Seed file '$seedFile' failed with exit code $LASTEXITCODE."
  }
}

Write-Host 'Supabase deployment complete.' -ForegroundColor Green
