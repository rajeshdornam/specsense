# SpecSense - Create distributable zip (excludes node_modules)
$src = "d:\project"
$dest = "d:\project\SpecSense.zip"

if (Test-Path $dest) { Remove-Item $dest -Force }

$tempDir = "$env:TEMP\SpecSense_export"
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Items to copy (top-level)
$items = @("backend", "frontend", "package.json", "README.md")

foreach ($item in $items) {
    $srcPath = Join-Path $src $item
    if (Test-Path $srcPath) {
        $destPath = Join-Path $tempDir $item
        if ((Get-Item $srcPath).PSIsContainer) {
            # Copy directory excluding node_modules
            robocopy $srcPath $destPath /E /XD node_modules .git /NFL /NDL /NJH /NJS /NC /NS | Out-Null
        } else {
            Copy-Item $srcPath $destPath
        }
    }
}

# Zip the temp folder
Compress-Archive -Path "$tempDir\*" -DestinationPath $dest -Force

# Cleanup
Remove-Item $tempDir -Recurse -Force

$size = [math]::Round((Get-Item $dest).Length / 1MB, 2)
Write-Host "✅ SpecSense.zip created at: $dest ($size MB)"
