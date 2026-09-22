<#
.SYNOPSIS
  Launches Chrome with CDP enabled and starts the BrowserOS server.
.DESCRIPTION
  Finds Chrome, launches it with --remote-debugging-port=9000,
  waits for CDP to be ready, loads the extension via CDP,
  then starts the Bun server in the foreground.
.PARAMETER CdpPort
  CDP debugging port (default: 9000)
.PARAMETER ServerPort
  Server HTTP port (default: 9100)
.PARAMETER ChromePath
  Path to Chrome executable. Auto-detected if not specified.
.PARAMETER NoExtension
  Skip loading the BrowserOS extension.
.PARAMETER KeepChrome
  Keep Chrome running after server exits.
#>

param(
  [int]$CdpPort = 9000,
  [int]$ServerPort = 9100,
  [string]$ChromePath = "",
  [switch]$NoExtension,
  [switch]$KeepChrome
)

$ErrorActionPreference = "Continue"
$ScriptDir = Split-Path -Parent $PSCommandPath

function Find-Chrome {
  $paths = @(
    "${env:ProgramFiles}\Google\Chrome\Application\chrome.exe",
    "${env:ProgramFiles(x86)}\Google\Chrome\Application\chrome.exe",
    "${env:LOCALAPPDATA}\Google\Chrome\Application\chrome.exe"
  )

  if ($ChromePath -and (Test-Path $ChromePath)) { return $ChromePath }
  foreach ($p in $paths) { if (Test-Path $p) { return $p } }
  $fromPath = Get-Command "chrome" -ErrorAction SilentlyContinue
  if ($fromPath) { return $fromPath.Source }
  return $null
}

function Wait-ForCdp {
  $url = "http://127.0.0.1:$CdpPort/json/version"
  Write-Host "Waiting for CDP on port $CdpPort..."
  for ($i = 0; $i -lt 30; $i++) {
    try {
      $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 1
      if ($response.StatusCode -eq 200) {
        Write-Host "CDP ready."
        return $true
      }
    } catch {}
    Start-Sleep -Seconds 1
  }
  Write-Warning "CDP not ready after 30 seconds."
  return $false
}

function Load-ExtensionViaCdp {
  param([string]$ExtPath)
  $result = & bun $ScriptDir\scripts\load-extension.ts $ExtPath $CdpPort 2>&1
  Write-Host $result
  if ($LASTEXITCODE -ne 0) {
    Write-Warning "Extension load failed"
  }
}

# --- Main ---

$chrome = Find-Chrome
if (-not $chrome) {
  Write-Error "Chrome not found."
  exit 1
}

$userDataDir = Join-Path $env:TEMP "browseros-chrome-profile"

Get-Process -Name "chrome" -ErrorAction SilentlyContinue | Where-Object {
  $_.CommandLine -like "*browseros-chrome-profile*"
} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

$chromeArgs = @(
  "--remote-debugging-port=$CdpPort"
  "--no-first-run"
  "--user-data-dir=$userDataDir"
)

Write-Host "Starting Chrome..."
$chromeProcess = Start-Process -FilePath $chrome -ArgumentList $chromeArgs -PassThru -WindowStyle Hidden

if (-not (Wait-ForCdp)) { Write-Warning "Starting server anyway..." }

if (-not $NoExtension) {
  $extDir = Join-Path $ScriptDir "apps\agent\dist\chrome-mv3"
  $extDirDev = Join-Path $ScriptDir "apps\agent\dist\chrome-mv3-dev"
  $finalExtDir = $null
  if (Test-Path (Join-Path $extDir "manifest.json")) { $finalExtDir = $extDir }
  elseif (Test-Path (Join-Path $extDirDev "manifest.json")) { $finalExtDir = $extDirDev }

  if ($finalExtDir) {
    Write-Host "Loading extension via CDP: $finalExtDir"
    $result = Load-ExtensionViaCdp -ExtPath $finalExtDir
    Write-Host "Extension load result: $result"
  } else {
    Write-Warning "Extension not built. Run 'bun run build:agent' first, or use -NoExtension."
  }
}

$env:BROWSEROS_CDP_PORT = "$CdpPort"
$env:BROWSEROS_SERVER_PORT = "$ServerPort"
if (-not $env:BROWSEROS_WORKING_DIR) {
  $env:BROWSEROS_WORKING_DIR = (Get-Location).Path
}
$env:NODE_ENV = "development"
$env:LOG_LEVEL = "info"

Push-Location $ScriptDir
try {
  Write-Host ""
  Write-Host "Starting BrowserOS server on port $ServerPort..."
  Write-Host "---"
  Write-Host "Press Ctrl+C to stop the server."
  Write-Host ""

  & bun run start:server
} finally {
  Pop-Location
  if (-not $KeepChrome) {
    Stop-Process -Id $chromeProcess.Id -Force -ErrorAction SilentlyContinue
  }
}
