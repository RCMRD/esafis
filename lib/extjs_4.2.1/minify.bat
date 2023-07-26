@ECHO off
set PATH="C:\Program Files (x86)\Microsoft\Microsoft Ajax Minifier\";%PATH%
setlocal enabledelayedexpansion
for /f %%f in ('dir /b /s^|findstr /r ".*\.js$ .*\.css$"') do (
 set "N=%%f"
 if "!N:.min%%~xf=!"=="!N!" (
 @ajaxmin -clobber %%f -o %%~npf%%~xf
 )
)
pause