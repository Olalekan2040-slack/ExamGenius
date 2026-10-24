@echo off
title EduLab ExamPrep Launcher
cd /d "%~dp0"

echo Starting EduLab ExamPrep backend (FastAPI)...
start "EduLab ExamPrep Backend" cmd /k "venv\Scripts\python.exe main.py"

echo Starting EduLab ExamPrep frontend (Vite)...
start "EduLab ExamPrep Frontend" cmd /k "cd frontend && npm run dev"

echo Waiting for servers to boot...
timeout /t 5 /nobreak >nul

echo Opening browser...
start "" "http://localhost:5173"

exit
