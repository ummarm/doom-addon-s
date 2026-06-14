$ErrorActionPreference = "Stop"

$taskName = "Doom-addon-S auto update"
$scriptPath = "C:\server\Doom-addon-S\scripts\update-windows.ps1"

$taskRun = "powershell.exe -NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`""

C:\Windows\System32\schtasks.exe /Create `
  /TN "$taskName" `
  /TR "$taskRun" `
  /SC HOURLY `
  /MO 10 `
  /RU SYSTEM `
  /RL HIGHEST `
  /F

Write-Host "Registered scheduled task: $taskName"
