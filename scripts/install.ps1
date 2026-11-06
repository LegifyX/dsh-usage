# Deploy this fork into a dsh profile as a pnpm `link:` dependency.
#
#   powershell -File scripts/install.ps1
#   powershell -File scripts/install.ps1 -Profile web
#
# Layout it creates:
#   <profile>/plugins/dsh-usage                       mirror of this checkout
#   <profile>/node_modules/@linxin666/dsh-usage       junction -> ../plugins/dsh-usage
#   <profile>/package.json                            "@linxin666/dsh-usage": "link:./plugins/dsh-usage"
#
# The dependency entry is what makes the fork survive `pnpm install` (any
# plugin install runs one): pnpm re-creates the junction from the manifest
# instead of restoring the registry copy.
#
# The deploy lives INSIDE the profile on purpose. dsh routes a plugin's own
# imports (`@deepseek-ai/cordis`, `@deepseek-ai/schemastery`) through a
# profile-scoped resolver that only answers requests from packages physically
# inside the profile; a link to a checkout elsewhere makes lib/index.js fail to
# import and the host row goes inactive (no card, no Usage page).

param(
  [string]$Profile = 'desktop',
  [string]$DshHome = (Join-Path $env:USERPROFILE '.dsh')
)

$ErrorActionPreference = 'Stop'

$source = Split-Path -Parent $PSScriptRoot
$profileDir = Join-Path $DshHome "profiles\$Profile"
$deploy = Join-Path $profileDir 'plugins\dsh-usage'
$link = Join-Path $profileDir 'node_modules\@linxin666\dsh-usage'
$spec = 'link:./plugins/dsh-usage'

if (-not (Test-Path $source)) { throw "fork checkout missing: $source" }
if (-not (Test-Path (Join-Path $profileDir 'package.json'))) { throw "profile not found: $Profile" }

New-Item -ItemType Directory -Force -Path (Join-Path $profileDir 'plugins') | Out-Null
robocopy $source $deploy /MIR /XD .git node_modules /XF *.log /NFL /NDL /NJH /NJS /NP | Out-Null
if ($LASTEXITCODE -ge 8) { throw "robocopy failed with code $LASTEXITCODE" }

if (Test-Path $link) {
  $existing = Get-Item $link -Force
  if ($existing.LinkType) {
    [System.IO.Directory]::Delete($link)
  } else {
    # First run over a registry install: keep it for rollback.
    $stock = "$link.stock"
    if (Test-Path $stock) { Remove-Item -LiteralPath $link -Recurse -Force }
    else { Rename-Item -LiteralPath $link -NewName 'dsh-usage.stock' }
  }
}

New-Item -ItemType Junction -Path $link -Target $deploy | Out-Null

$pkgPath = Join-Path $profileDir 'package.json'
$pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
if ($null -eq $pkg.dependencies) { $pkg | Add-Member -NotePropertyName dependencies -NotePropertyValue ([pscustomobject]@{}) }
if ($pkg.dependencies.'@linxin666/dsh-usage' -ne $spec) {
  $pkg.dependencies | Add-Member -NotePropertyName '@linxin666/dsh-usage' -NotePropertyValue $spec -Force
  ($pkg | ConvertTo-Json -Depth 8) | Set-Content $pkgPath -Encoding utf8
  Write-Host "declared $spec in $pkgPath"
}

$deployed = Get-Content (Join-Path $deploy 'package.json') -Raw | ConvertFrom-Json
Write-Host "deployed $($deployed.name)@$($deployed.version)"
Write-Host "linked $link -> $deploy"
Write-Host "Restart DSH for the host half; refresh the page for the client half."
