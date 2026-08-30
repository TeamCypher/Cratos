@echo off
echo ===================================================
echo   Starting Cratos Creator Content Intelligence System
echo ===================================================

echo.
echo Starting Backend Server (FastAPI) in a new window...
start "Cratos Backend" cmd /k "cd /d %~dp0 && python -m backend.main"

echo Starting Frontend Server (Next.js) in a new window...
start "Cratos Frontend" cmd /k "cd /d %~dp0\frontend && npm run dev"

echo.
echo Both servers have been launched in separate windows!
echo - Backend API: http://localhost:8000
echo - Frontend UI: http://localhost:3000
echo.
pause
