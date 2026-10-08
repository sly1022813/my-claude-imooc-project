@echo off
chcp 65001 >nul
title 轻记账后端服务

:: 进入目录
cd /d "%~dp0"

:: 测试 MySQL
echo 测试 MySQL 连接...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot -e "SELECT 1" >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] MySQL 连接失败
    pause
    exit 1
)

echo MySQL 连接成功，正在启动服务...
echo.

:: 启动 Node
npm run dev
