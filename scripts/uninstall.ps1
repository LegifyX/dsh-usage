# Remove the fork deploy and restore the registry copy.
#
#   powershell -File scripts/uninstall.ps1
#   powershell -File scripts/uninstall.ps1 -Profile web

param(
  [string]$Profile = 'desktop',
  [string]$DshHome = (Join-Path $env:USERPROFILE '.dsh')
)

$ErrorActionPreference = 'Stop'

$profileDir = Join-Path $DshHome "profiles\$Profile"
$deploy = Join-Path $profileDir 'plugins\dsh-usage'
$link = Join-Path $profileDir 'node_modules\@linxin666\dsh-usage'
$stock = "$link.stock"

if (Test-Path $link) {
  $existing = Get-Item $link -Force
  if ($existing.LinkType) { [System.IO.Directory]::Delete($link) }
  else { Remove-Item -LiteralPath $link -Recurse -Force }
  Write-Host "removed $link"
}

if (Test-Path $deploy) {
  Remove-Item -LiteralPath $deploy -Recurse -Force
  Write-Host "removed $deploy"
}

if (Test-Path $stock) {
  Rename-Item -LiteralPath $stock -NewName 'dsh-usage'
  Write-Host "restored previous copy"
}

$pkgPath = Join-Path $profileDir 'package.json'
$pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
if ($pkg.dependencies.PSObject.Properties.Name -contains '@linxin666/dsh-usage') {
  $pkg.dependencies.PSObject.Properties.Remove('@linxin666/dsh-usage')
  ($pkg | ConvertTo-Json -Depth 8) | Set-Content $pkgPath -Encoding utf8
  Write-Host "dropped the link dependency; run pnpm install to restore the registry copy"
}
