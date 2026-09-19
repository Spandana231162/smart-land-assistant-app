@echo off
title Cloudflare Tunnel - BhoomiSeva
cd /d "%~dp0"
echo ==========================================================
echo Starting Official Cloudflare Tunnel (Stable, No Expiry)...
echo (Make sure start_server.bat is running on port 5000)
echo ==========================================================
echo.
echo Look below for your link ending in .trycloudflare.com:
echo.
cloudflared.exe tunnel --url http://localhost:5000
pause
