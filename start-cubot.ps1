<#
  start-cubot.ps1
  Carga CUBOT.nails: levanta la infraestructura (Postgres via docker), compila la
  solucion, arranca la consola (CubotNails.SuperAdmin) y abre la pagina en el navegador.

  Uso:
    .\start-cubot.ps1                 # puerto 8080 (necesario para el tunel/webhook de WhatsApp)
    .\start-cubot.ps1 -Port 5232      # otro puerto
    .\start-cubot.ps1 -SkipBuild      # no recompila (arranque mas rapido)
    .\start-cubot.ps1 -SkipDocker     # no toca docker
    .\start-cubot.ps1 -NoBrowser      # no abre el navegador
#>
param(
    [int]$Port = 8080,
    [switch]$SkipBuild,
    [switch]$SkipDocker,
    [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'

$Root      = $PSScriptRoot
$Backend   = Join-Path $Root 'apps\backend'
$Solution  = Join-Path $Backend 'CubotNails.sln'
$AppProj   = Join-Path $Backend 'src\CubotNails.SuperAdmin'
$DockerDir = Join-Path $Root 'deploy\docker'
$Url       = "http://localhost:$Port"
$PidFile   = Join-Path $Root '.cubot-pid'

# Cadena de conexion y entorno. Si ya viene definida en la sesion, se respeta.
if (-not $env:CUBOT_DB_CONNECTION) {
    $env:CUBOT_DB_CONNECTION = 'Host=localhost;Port=5434;Database=cubot_nails_dev;Username=cubot;Password=postgres'
}
$env:ASPNETCORE_ENVIRONMENT = 'Development'
$env:ASPNETCORE_URLS        = $Url

Write-Host "==> CUBOT.nails: cargando en $Url" -ForegroundColor Cyan

# 1) Infraestructura local (Postgres) via docker.
if (-not $SkipDocker -and (Test-Path (Join-Path $DockerDir 'docker-compose.yml'))) {
    Write-Host "==> Levantando infraestructura (docker compose up -d)..." -ForegroundColor DarkCyan
    Push-Location $DockerDir
    try { docker compose up -d | Out-Null }
    catch { Write-Warning "Docker no disponible o ya esta arriba: $($_.Exception.Message)" }
    finally { Pop-Location }
}

# 2) Detener cualquier instancia previa en el puerto (para compilar y arrancar limpio).
$existing = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
    Select-Object -First 1 -ExpandProperty OwningProcess
if ($existing) {
    Write-Host "==> Deteniendo instancia previa en el puerto $Port (PID $existing)..." -ForegroundColor DarkYellow
    Stop-Process -Id $existing -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# 3) Compilar.
if (-not $SkipBuild) {
    Write-Host "==> Compilando la solucion..." -ForegroundColor DarkCyan
    dotnet build $Solution -clp:ErrorsOnly
    if ($LASTEXITCODE -ne 0) {
        Write-Error "La compilacion fallo. No se levanta el servicio."
        exit 1
    }
}

# 4) Arrancar la consola en su propia ventana (muestra logs; se cierra con Ctrl+C o con stop-cubot.ps1).
Write-Host "==> Iniciando la consola (CubotNails.SuperAdmin)..." -ForegroundColor DarkCyan
$runArgs = @('run', '--project', $AppProj, '--no-launch-profile', '--urls', $Url)
if (-not $SkipBuild) { $runArgs += '--no-build' }
$app = Start-Process -FilePath 'dotnet' -ArgumentList $runArgs -WorkingDirectory $Backend -PassThru

# Guardar el PID para que stop-cubot.ps1 lo pueda detener aunque cambie el puerto.
$app.Id | Out-File -FilePath $PidFile -Encoding ascii

# 5) Esperar a que responda y abrir el navegador.
Write-Host "==> Esperando a que el servicio responda..." -ForegroundColor DarkCyan
$ready = $false
for ($i = 0; $i -lt 90; $i++) {
    Start-Sleep -Seconds 1
    try {
        $r = Invoke-WebRequest -Uri "$Url/login" -UseBasicParsing -TimeoutSec 3
        if ($r.StatusCode -ge 200) { $ready = $true; break }
    } catch { }
}

if ($ready) {
    Write-Host "==> CUBOT.nails arriba en $Url  (PID $($app.Id))" -ForegroundColor Green
    Write-Host "    Para detenerlo:  .\stop-cubot.ps1" -ForegroundColor DarkGray
    if (-not $NoBrowser) { Start-Process $Url }
} else {
    Write-Warning "El servicio no respondio a tiempo. Revisa la ventana de la app para ver el error."
}
