@echo off
chcp 65001 > nul
setlocal EnableDelayedExpansion

set PACKAGES=protobufjs-cli

for %%i in (%PACKAGES%) do (
  echo 检查 %%i
  npm ls -g %%i >nul 2>nul
  if %errorlevel% neq 0 (
    echo 全局包 %%i 未安装，正在安装...
    npm install -g %%i
  ) else (
    echo 全局包 %%i 已安装
  )
)
pause
pause