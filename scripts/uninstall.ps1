# Restore the copy that was installed before the fork deploy.
#
#   powershell -File scripts/uninstall.ps1
#   powershell -File scripts/uninstall.ps1 -Profile web

param(
  [string]$Profile = 'desktop',
  [string]$DshHome = (Join-Path $env:USERPROFILE '.dsh')
)

$ErrorActionPreference = 'Stop'

$target = Join-Path $DshHome "profiles\$Profile\node_modules\@linxin666\dsh-usage"
$stock = "$target.stock"

$existing = Get-Item $target -Force -ErrorAction SilentlyContinue
if ($existing) {
  if ($existing.LinkType -eq 'Junction' -or $existing.LinkType -eq 'SymbolicLink') {
    Remove-Item -LiteralPath $target -Force
  } else {
    Remove-Item -LiteralPath $target -Recurse -Force
  }
  Write-Host "removed $target"
}

if (Test-Path $stock) {
  Rename-Item -LiteralPath $stock -NewName 'dsh-usage'
  Write-Host "restored previous copy"
} else {
  Write-Host "no previous copy parked; run pnpm install in the profile to restore it"
}
