# Link this fork into a dsh profile in place of the registry copy.
#
#   pwsh -File scripts/install.ps1
#   pwsh -File scripts/install.ps1 -Profile web
#
# The package name stays `@linxin666/dsh-usage`, so the dsh-web-all bundle patch
# keeps resolving it; only the directory behind that name changes.

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
  Write-Host "already linked: $target -> $($existing.Target)"
  exit 0
}

if ($existing) {
  if (Test-Path $stock) { Remove-Item -Recurse -Force $stock }
  Rename-Item -LiteralPath $target -NewName (Split-Path -Leaf $stock)
  Write-Host "stock copy parked at $stock"
}

New-Item -ItemType Junction -Path $target -Target $source | Out-Null
Write-Host "linked $target -> $source"
Write-Host "Restart DSH for the host half; refresh the page for the client half."
