# VERDICT 1-Click PowerShell Launcher
Set-Location -Path $PSScriptRoot
$Host.UI.RawUI.WindowTitle = "VERDICT - See beyond the buy"

Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "   VERDICT -- 'See beyond the buy.'" -ForegroundColor White
Write-Host "   Buyer-Side AI Cross-Examination Engine [IST Hackathon Build]" -ForegroundColor DarkGray
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

# Check node
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not found. Please install Node.js >= 20." -ForegroundColor Red
    Read-Host "Press Enter to exit..."
    exit 1
}

# Check node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "[*] Installing project dependencies..." -ForegroundColor Yellow
    npm install
}

# Check catalog
if (-not (Test-Path "data/catalog.json")) {
    Write-Host "[*] Seeding catalog..." -ForegroundColor Yellow
    npm run derive
}

# Open browser in background after 3s
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 3
    Start-Process "http://localhost:3000/?demo=1"
} | Out-Null

Write-Host "[*] Launching browser to http://localhost:3000/?demo=1 ..." -ForegroundColor Green
Write-Host "[*] Starting Next.js development server..." -ForegroundColor Green
Write-Host ""

npm run dev
