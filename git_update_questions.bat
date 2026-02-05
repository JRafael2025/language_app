@echo off
echo ==================================
echo Git Auto Update - QUESTIONS ONLY
echo ==================================

REM Go to the folder where this .bat is located
cd /d %~dp0

echo.
echo Current status (questions files only):
git status --short questions*

echo.
echo Adding questions files only...
git add questions*

echo.
set /p msg=Enter commit message for questions update: 

if "%msg%"=="" (
    echo Commit message cannot be empty.
    pause
    exit /b
)

echo.
echo Committing questions files...
git commit -m "%msg%"

echo.
echo Pushing to remote repository...
git push

echo.
echo ✅ Questions updated successfully!
pause
