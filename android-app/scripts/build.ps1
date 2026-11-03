param([ValidateSet('Debug', 'Release')][string]$Variant = 'Debug')
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$repositoryRoot = Split-Path $projectRoot -Parent
$tools = Join-Path $repositoryRoot '.android-tools'
if (Test-Path (Join-Path $tools 'jdk')) {
    $env:JAVA_HOME = (Get-ChildItem (Join-Path $tools 'jdk') -Directory | Select-Object -First 1).FullName
}
if (Test-Path (Join-Path $tools 'sdk')) { $env:ANDROID_HOME = Join-Path $tools 'sdk' }
if ($Variant -eq 'Release' -and !(Test-Path (Join-Path $projectRoot 'signing.properties'))) {
    throw 'Create/import release signing files first. See README.md.'
}
& (Join-Path $projectRoot 'gradlew.bat') -p $projectRoot ":app:assemble$Variant" ":app:lint$Variant" --no-daemon
if ($LASTEXITCODE -ne 0) { throw 'Android build failed.' }
$flavor = $Variant.ToLowerInvariant()
$apk = Join-Path $projectRoot "app/build/outputs/apk/$flavor/app-$flavor.apk"
if ($Variant -eq 'Release') {
    $downloads = Join-Path $repositoryRoot 'public/downloads'
    New-Item -ItemType Directory -Path $downloads -Force | Out-Null
    Copy-Item -LiteralPath $apk -Destination (Join-Path $downloads 'zov-oceana.apk')
    Write-Host 'Signed release copied to public/downloads/zov-oceana.apk for the frontend build.'
}
Write-Host "APK: $apk"
