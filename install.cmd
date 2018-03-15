@echo off
setlocal enabledelayedexpansion
pushd %~dp0
FOR /f "delims=" %%i IN ("%~dp0") DO SET "root=%%~fi"
echo MARS 4.1 Installation.
"%root%bin\nodejs\node.exe" "%root%src\server.js"
echo Finished.
endlocal
popd
exit /b %errorlevel%
