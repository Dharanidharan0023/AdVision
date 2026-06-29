# Dharanix Studio - Copy Frontend to D: Drive
# Run this script in PowerShell to copy the frontend

$source = "C:\Users\Adyan\.gemini\antigravity\scratch\DharanixStudio\frontend"
$destination = "D:\Project\Antigravity\trial\DharanixStudio\frontend"

Write-Host "Copying Dharanix Studio Frontend..." -ForegroundColor Cyan
Write-Host "From: $source" -ForegroundColor Yellow
Write-Host "To: $destination" -ForegroundColor Yellow

# Copy the entire frontend directory
robocopy $source $destination /E /XD node_modules dist .git /NFL /NDL

if ($LASTEXITCODE -le 7) {
    Write-Host "`nFrontend copied successfully!" -ForegroundColor Green
    Write-Host "`nNext steps:" -ForegroundColor Cyan
    Write-Host "1. cd D:\Project\Antigravity\trial\DharanixStudio\backend-node" -ForegroundColor White
    Write-Host "2. npm install" -ForegroundColor White
    Write-Host "3. npx prisma generate" -ForegroundColor White
    Write-Host "4. npx prisma db push" -ForegroundColor White
    Write-Host "5. node seed.js" -ForegroundColor White
    Write-Host "6. npm run dev (in backend-node)" -ForegroundColor White
    Write-Host "`nThen in a new terminal:" -ForegroundColor Cyan
    Write-Host "1. cd D:\Project\Antigravity\trial\DharanixStudio\frontend" -ForegroundColor White
    Write-Host "2. npm install" -ForegroundColor White
    Write-Host "3. npm run dev" -ForegroundColor White
} else {
    Write-Host "`nCopy failed with error code: $LASTEXITCODE" -ForegroundColor Red
}
