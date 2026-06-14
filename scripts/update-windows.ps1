$ErrorActionPreference = "Stop"

$repoPath = "C:\server\Doom-addon-S"

Set-Location $repoPath
git pull --ff-only
docker compose up -d --build --remove-orphans
