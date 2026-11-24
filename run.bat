@echo off
setlocal enabledelayedexpansion
title VERDICT - See beyond the buy
cd /d "%~dp0"

echo =====================================================================
echo    VERDICT -- "See beyond the buy."
echo    Buyer-Side AI Cross-Examination Engine [IST Hackathon Build]
echo =====================================================================
echo.

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not found in PATH.
    echo Please install Node.js v20 or higher from https://nodejs.org
    echo.
    pause
    exit /b 1
)

:: Install dependencies if node_modules is missing
if not exist "node_modules\" (
    echo [*] Installing dependencies...
    call npm install
    if !errorlevel! neq 0 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
)

:: Verify catalog existence
if not exist "data\catalog.json" (
    echo [*] Seeding catalog and review database...
    call npm run derive
)

:: Open browser in background after 3 seconds
echo [*] Opening browser to http://localhost:3000/?demo=1 ...
start "" cmd /c "ping 127.0.0.1 -n 4 >nul & start http://localhost:3000/?demo=1"

echo.
echo =====================================================================
echo    Server starting at http://localhost:3000
echo    Preset demo: http://localhost:3000/?demo=1
echo    Design system: http://localhost:3000/design
echo    Press Ctrl+C to stop the server anytime.
echo =====================================================================
echo.

call npm run dev
pause
