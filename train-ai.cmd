@echo off
rem Tababaraha AI-ga: su'aal waydii, sax jawaabta.
cd /d "%~dp0ai-company\agent-server"
node scripts\train.js
pause
