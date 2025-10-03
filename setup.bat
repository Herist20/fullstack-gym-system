@echo off
REM Gym System - Setup Script for Windows
REM This script helps you setup the project quickly

echo ================================
echo Gym Management System - Setup
echo ================================
echo.

REM Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found!
    echo Please install Node.js v18+ from https://nodejs.org
    exit /b 1
)
echo [OK] Node.js installed
node -v
echo.

REM Check pnpm
where pnpm >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] pnpm not found. Installing...
    call npm install -g pnpm
    echo [OK] pnpm installed
) else (
    echo [OK] pnpm installed
    pnpm -v
)
echo.

REM Check Supabase CLI
where supabase >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Supabase CLI not found. Installing...
    call npm install -g supabase
    echo [OK] Supabase CLI installed
) else (
    echo [OK] Supabase CLI installed
    supabase --version
)
echo.

echo ================================
echo Step 1: Installing dependencies
echo ================================
call pnpm install
echo [OK] Dependencies installed!
echo.

echo ================================
echo Step 2: Environment Setup
echo ================================
if not exist .env.local (
    copy .env.example .env.local
    echo [OK] .env.local created
    echo.
    echo [INFO] Please edit .env.local with your Supabase credentials
    echo.
    echo To get Supabase credentials:
    echo   1. Go to https://app.supabase.com
    echo   2. Create a new project or use existing
    echo   3. Go to Settings ^> API
    echo   4. Copy Project URL and API keys
    echo.
    pause
    notepad .env.local
) else (
    echo [INFO] .env.local already exists
)
echo.

echo ================================
echo Step 3: Supabase Setup
echo ================================
echo Choose option:
echo   1) Link to existing Supabase project (Cloud)
echo   2) Start local Supabase
echo   3) Skip this step
echo.
set /p CHOICE="Enter choice (1/2/3): "

if "%CHOICE%"=="1" (
    echo.
    echo [INFO] Linking to Supabase project...
    set /p PROJECT_REF="Enter your project ref: "
    call supabase login
    call supabase link --project-ref %PROJECT_REF%
    echo [OK] Linked to Supabase!
    echo.
    echo [INFO] Pushing migrations...
    call pnpm db:push
    echo [OK] Migrations completed!
)

if "%CHOICE%"=="2" (
    echo.
    echo [INFO] Starting local Supabase...
    call supabase start
    echo [OK] Local Supabase started!
    echo.
    echo [INFO] Running migrations...
    call supabase db reset
    echo [OK] Migrations completed!
)

if "%CHOICE%"=="3" (
    echo [INFO] Skipping Supabase setup
)
echo.

echo ================================
echo Step 4: Seed Data (Optional)
echo ================================
set /p SEED="Seed database with sample data? (y/n): "
if /i "%SEED%"=="y" (
    echo.
    echo [INFO] To seed data:
    echo   1. Open Supabase Dashboard
    echo   2. Go to SQL Editor
    echo   3. Copy paste from: supabase/seed.sql
    echo   4. Click RUN
    echo.
    echo [WARNING] Create auth users first!
    pause
    echo [OK] Seed data loaded!
)
echo.

echo ================================
echo Setup Complete!
echo ================================
echo.
echo [SUCCESS] Your Gym Management System is ready!
echo.
echo Next steps:
echo   1. Run: pnpm dev
echo   2. Open: http://localhost:3001 (User WebApp)
echo   3. Open: http://localhost:3002 (Admin Dashboard)
echo.
echo Documentation:
echo   - RUN_PROJECT.md - Panduan lengkap (Bahasa Indonesia)
echo   - QUICKSTART.md - Quick start guide
echo   - PROJECT_SUMMARY.md - Project overview
echo.
echo Useful commands:
echo   - pnpm dev - Start development
echo   - pnpm db:push - Push migrations
echo   - pnpm types:generate - Generate types
echo.
echo Happy coding!
pause
