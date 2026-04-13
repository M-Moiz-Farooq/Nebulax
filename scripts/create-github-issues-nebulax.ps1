# Creates GitHub issues on NEBULAX (issues live on GitHub — not in git commits).
# Requires: GitHub CLI — https://cli.github.com/ — then: gh auth login
#
# Bodies use @' '@ (single-quoted here-strings) so PowerShell does not treat (UI) as a command.
# Optional: set GitHub logins (no @) below. Leave empty to create unassigned (owner still named in body).
# Run ONCE from repo root:
#   powershell -ExecutionPolicy Bypass -File .\scripts\create-github-issues-nebulax.ps1
#
# If a previous run partially succeeded, close duplicate issues on GitHub before re-running.

$ErrorActionPreference = "Stop"
$Repo = "M-Moiz-Farooq/Nebulax"

# gh is often installed but not on PATH — resolve it
$GhExe = $null
if (Get-Command gh -ErrorAction SilentlyContinue) {
  $GhExe = (Get-Command gh).Source
} elseif (Test-Path "$env:ProgramFiles\GitHub CLI\gh.exe") {
  $GhExe = "$env:ProgramFiles\GitHub CLI\gh.exe"
}
if (-not $GhExe) {
  throw "GitHub CLI (gh) not found. Install: winget install --id GitHub.cli -e"
}

$Muskan     = ""
$Piyush     = ""
$Moiz       = ""
$Simranjeet = ""

function New-GhIssue {
  param([string]$Title, [string]$Body, [string]$Assignee)
  $ghArgs = @("issue", "create", "-R", $Repo, "--title", $Title, "--body", $Body)
  if ($Assignee -and $Assignee.Trim().Length -gt 0) {
    $ghArgs += @("--assignee", $Assignee)
  }
  & $GhExe @ghArgs
}

# --- Muskan: UI ---
New-GhIssue -Title '[UI] App shell, navigation, and dashboard presentation' -Assignee $Muskan -Body @'
**Primary owner:** Muskan — UI

## Summary
Layout shell (sidebar, header, content), navigation states, dashboard presentation for demo.

## Acceptance criteria
- [ ] No clipped text on common laptop resolutions.
- [ ] Sidebar + main content scroll usable (logout reachable).
- [ ] Screenshots usable for PRD.

Coordinate with Moiz if API data shapes affect layout.
'@

New-GhIssue -Title '[UI] Forms, tables, modals — visual consistency' -Assignee $Muskan -Body @'
**Primary owner:** Muskan — UI

Unify forms, tables, modals — spacing, buttons, loading/empty/error states.
'@

New-GhIssue -Title '[UI] Demo polish and responsive pass' -Assignee $Muskan -Body @'
**Primary owner:** Muskan — UI

Responsive / demo polish for key flows (~1280px). Note limitations in a comment.
'@

# --- Piyush: small FE ---
New-GhIssue -Title '[FE] Utilities: money, dates, small component fixes' -Assignee $Piyush -Body @'
**Primary owner:** Piyush — small front-end

Money/date helpers and small consistency fixes. Escalate API contract changes to Moiz.
'@

New-GhIssue -Title '[FE] Empty states, loading, inline validation' -Assignee $Piyush -Body @'
**Primary owner:** Piyush — small front-end

Empty states, loading indicators, inline validation on forms.
'@

New-GhIssue -Title '[FE] Accessibility and copy pass — incremental' -Assignee $Piyush -Body @'
**Primary owner:** Piyush — small front-end

Input labels, button text, consistent terminology.
'@

# --- Moiz: core BE + FE ---
New-GhIssue -Title '[Core] Auth API + React: JWT lifecycle' -Assignee $Moiz -Body @'
**Primary owner:** Moiz — main backend + front-end integration

Django auth + React: login, signup, JWT, 401 handling. Match SDD/PRD.
'@

New-GhIssue -Title '[Core] Transactions + RBAC — API and UI' -Assignee $Moiz -Body @'
**Primary owner:** Moiz — main backend + front-end integration

Transactions end-to-end per role. DB model changes: coordinate with Simranjeet.
'@

New-GhIssue -Title '[Core] API client, Vite proxy, error handling' -Assignee $Moiz -Body @'
**Primary owner:** Moiz — main backend + front-end integration

API layer, Vite proxy to Django :8000, sensible error messages. See HOW_TO_START_NEBULAX.md.
'@

# --- Simranjeet: DB ---
New-GhIssue -Title '[DB] Models, migrations, SQLite alignment' -Assignee $Simranjeet -Body @'
**Primary owner:** Simranjeet — database

Models/migrations/SQLite aligned with SDD; clean migrate on fresh clone.
'@

New-GhIssue -Title '[DB] Seed data and admin user' -Assignee $Simranjeet -Body @'
**Primary owner:** Simranjeet — database

seed_admin, env-driven credentials; no secrets in repo.
'@

New-GhIssue -Title '[DB] Data integrity — constraints and validation' -Assignee $Simranjeet -Body @'
**Primary owner:** Simranjeet — database

Model/DB integrity; document rules for API consumers.
'@

Write-Host "Done. Open: https://github.com/$Repo/issues"
