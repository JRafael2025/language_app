@echo off
echo ==============================
echo Git Auto Update - language_app
echo ==============================

REM Go to the folder where this .bat is located
cd /d %~dp0

echo.
echo Current status:
git status

echo.
echo Adding all changes...
git add .

echo.
set /p msg=Enter commit message: 

if "%msg%"=="" (
    echo Commit message cannot be empty.
    pause
    exit /b
)

echo.
echo Committing changes...
git commit -m "%msg%"

echo.
echo Pushing to remote repository...
git push

echo.
echo ✅ Done!
pause
