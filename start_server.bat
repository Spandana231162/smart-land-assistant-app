@echo off
title BhoomiSeva Smart Land Server
cd /d "%~dp0server"
echo =======================================================
echo Starting BhoomiSeva Smart Land Server on Port 5000...
echo =======================================================
node index.js
pause
