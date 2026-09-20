@echo off
rem Wuxuu bilaabaa website-ka (http://localhost:8443) iyo server-ka AI-ga (http://localhost:8787).
cd /d "%~dp0"
start "FCS Website" cmd /k "npm run dev"
start "FCS AI Server" cmd /k "cd /d ai-company\agent-server && node src\server.js"
echo Website: http://localhost:8443
echo AI:      http://localhost:8787/health
timeout /t 4 >nul
start http://localhost:8443
