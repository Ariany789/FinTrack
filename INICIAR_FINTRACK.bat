@echo off
setlocal

set "ROOT=%~dp0"
set "BACKEND=%ROOT%backend"
set "FRONTEND=%ROOT%frontend"

for /d %%D in ("%FRONTEND%\.node\node-v*-win-x64") do set "PATH=%%~fD;%PATH%"

where python >nul 2>nul
if errorlevel 1 (
  echo Python nao foi encontrado. Instale o Python 3.12 ou superior e execute este arquivo novamente.
  pause
  exit /b 1
)

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao foi encontrado. Instale a versao LTS do Node.js e execute este arquivo novamente.
  pause
  exit /b 1
)

if not exist "%BACKEND%\.venv\Scripts\python.exe" (
  echo Preparando o backend pela primeira vez...
  python -m venv "%BACKEND%\.venv"
  call "%BACKEND%\.venv\Scripts\python.exe" -m pip install -r "%BACKEND%\requirements.txt"
)

if not exist "%FRONTEND%\node_modules" (
  echo Preparando o frontend pela primeira vez...
  pushd "%FRONTEND%"
  call npm install --no-audit --no-fund
  popd
)

pushd "%BACKEND%"
call ".venv\Scripts\python.exe" -m alembic upgrade head
call ".venv\Scripts\python.exe" -m app.seed
popd

echo Iniciando o FinTrack...
start "FinTrack API" /min /d "%BACKEND%" "%ComSpec%" /c ".venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000"
start "FinTrack Interface" /min /d "%FRONTEND%" "%ComSpec%" /c "npm run dev -- --host 127.0.0.1 --port 5173"

timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:5173"

echo FinTrack aberto no navegador.
endlocal
