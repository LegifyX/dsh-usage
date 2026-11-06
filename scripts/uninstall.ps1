# Restore the copy that was installed before the link.
#
#   pwsh -File scripts/uninstall.ps1
#   pwsh -File scripts/uninstall.ps1 -Profile web

param(
  [string]$Profile = 'desktop',
  [string]$DshHome = (Join-Path $env:USERPROFILE '.dsh')
)

$ErrorActionPreference = 'Stop'

$target = Join-Path $DshHome "profiles\$Profile\node_modules\@linxin666\dsh-usage"
$stock = "$target.stock"

$existing = Get-Item $target -Force -ErrorAction SilentlyContinue
if ($existing -and $existing.LinkType -eq 'Junction') {
  Remove-Item -LiteralPath $target -Force
  Write-Host "unlinked $target"
}

if (Test-Path $stock) {
  Rename-Item -LiteralPath $stock -NewName 'dsh-usage'
  Write-Host "restored previous copy"
} else {
  Write-Host "no previous copy parked; run pnpm install in the profile to restore it"
}
