@echo off
cd /d "%~dp0.."
npx pm2 resurrect
