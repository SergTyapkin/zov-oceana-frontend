$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$repositoryRoot = Split-Path $projectRoot -Parent
$localJdk = Join-Path $repositoryRoot '.android-tools/jdk'
if (Test-Path $localJdk) {
    $env:JAVA_HOME = (Get-ChildItem $localJdk -Directory | Select-Object -First 1).FullName
}
$keytool = if ($env:JAVA_HOME) { Join-Path $env:JAVA_HOME 'bin/keytool.exe' } else { 'keytool' }
$keyFile = Join-Path $projectRoot 'zovoceana-release.jks'
$properties = Join-Path $projectRoot 'signing.properties'
if ((Test-Path $keyFile) -or (Test-Path $properties)) { throw 'Signing files already exist; refusing to overwrite.' }
$env:ZOV_KEYSTORE_PASSWORD = [Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
try {
    & $keytool -genkeypair -keystore $keyFile -storetype JKS -alias zovoceana `
        -storepass:env ZOV_KEYSTORE_PASSWORD -keypass:env ZOV_KEYSTORE_PASSWORD `
        -keyalg RSA -keysize 3072 -validity 10000 -dname 'CN=Zov Oceana, O=Zov Oceana, C=RU'
    if ($LASTEXITCODE -ne 0) { throw 'Key generation failed.' }
    @"
storeFile=zovoceana-release.jks
storePassword=$env:ZOV_KEYSTORE_PASSWORD
keyAlias=zovoceana
keyPassword=$env:ZOV_KEYSTORE_PASSWORD
"@ | Set-Content -LiteralPath $properties -Encoding utf8NoBOM
} finally {
    Remove-Item Env:ZOV_KEYSTORE_PASSWORD -ErrorAction SilentlyContinue
}
Write-Host 'Signing key created. Back up zovoceana-release.jks and signing.properties privately before distributing the APK.'
