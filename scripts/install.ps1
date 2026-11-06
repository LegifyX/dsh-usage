# Deploy this fork into a dsh profile in place of the registry copy.
#
#   powershell -File scripts/install.ps1
#   powershell -File scripts/install.ps1 -Profile web
#
# The package name stays `@linxin666/dsh-usage`, so the dsh-web-all bundle patch
# keeps resolving it; only the directory behind that name changes.
#
# The deploy is a real copy, not a junction: dsh resolves a plugin's own imports
# (`@deepseek-ai/cordis`, `@deepseek-ai/schemastery`) through its profile-scoped
# resolver, which only routes requests from packages that physically live inside
# the profile. A junction to a checkout outside the profile makes the plugin
# fail to import, and the host row goes inactive.

param(
  [string]$Profile = 'desktop',
  [string]$DshHome = (Join-Path $env:USERPROFILE '.dsh')
)

$ErrorActionPreference = 'Stop'

$source = Split-Path -Parent $PSScriptRoot
$target = Join-Path $DshHome "profiles\$Profile\node_modules\@linxin666\dsh-usage"
$stock = "$target.stock"

if (-not (Test-Path $source)) { throw "fork checkout missing: $source" }
if (-not (Test-Path (Split-Path -Parent $target))) { throw "profile not found: $Profile" }

$existing = Get-Item $target -Force -ErrorAction SilentlyContinue
if ($existing -and $existing.LinkType -eq 'Junction') {
  # Clear a junction left by the earlier install shape; deploy a real copy.
  [System.IO.Directory]::Delete($target)
  Write-Host "removed junction at $target"
} elseif ($existing -and -not (Test-Path $stock)) {
  # First deploy over a registry install: keep the previous copy for rollback.
  Rename-Item -LiteralPath $target -NewName (Split-Path -Leaf $stock)
  Write-Host "previous copy parked at $stock"
}

robocopy $source $target /MIR /XD .git node_modules /XF *.log /NFL /NDL /NJH /NJS /NP | Out-Null
if ($LASTEXITCODE -ge 8) { throw "robocopy failed with code $LASTEXITCODE" }

$deployed = Get-Content (Join-Path $target 'package.json') -Raw | ConvertFrom-Json
Write-Host "deployed $($deployed.name)@$($deployed.version) to $target"
Write-Host "Restart DSH for the host half; refresh the page for the client half."
