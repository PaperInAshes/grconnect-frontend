@echo off
echo ============================================================
echo   GR-Connect — Jalankan Frontend (HTTP Server)
echo ============================================================
echo.
echo Frontend akan berjalan di: http://localhost:5173
echo Tekan Ctrl+C untuk berhenti.
echo.
npx -y serve . -p 5173 --no-clipboard
pause
