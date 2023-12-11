@echo off
chcp 65001 > nul
setlocal EnableDelayedExpansion

echo 开始执行 build-proto.bat
call ./public/build-proto.bat

echo 开始执行 build-proto.js
node ./public/build-proto.js

echo 完成
pause
