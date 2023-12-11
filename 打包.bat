@echo off

rem chcp 65001 就是换成UTF-8代码页 
rem chcp 936 可以换回默认的GBK 
rem chcp 437 是美国英语 

chcp 65001
echo,
set PYTHONIOENCODING=UTF-8

@REM 调整窗口大小
set WinCol=80
set WinRow=25
Mode con cols=%WinCol% lines=%WinRow%

@REM @REM 调整窗口位置
@REM set rr="HKCU\Console\%%SystemRoot%%_system32_cmd.exe"
@REM reg delete %rr% /f>nul
@REM reg add %rr% /v "WindowPosition" /t REG_DWORD /d 0x00240309 /f>nul

@REM 调整字体颜色
@REM 0 = Black       8 = Gray
@REM 1 = Blue        9 = Light Blue
@REM 2 = Green       A = Light Green
@REM 3 = Aqua        B = Light Aqua
@REM 4 = Red         C = Light Red
@REM 5 = Purple      D = Light Purple
@REM 6 = Yellow      E = Light Yellow
@REM 7 = White       F = Bright White
@REM 前一位是背景颜色，后一位是字体颜色，两者相同视为无效
COLOR 06

@REM 调整标题
TITLE 快捷工具

@REM 切到当前目录
cd %~dp0
rem set pyName=%~n0
cd public/gui
set pyName=gui
python %pyName%.py

if %errorlevel% == 0 (
exit
) else (
pause
)
