@echo off
chcp 65001 >nul
title 轻记账后端服务
echo ===========================================
echo   轻记账 - 后端服务启动
echo ===========================================
echo.

:: 检查 MySQL 连接
echo [1/3] 检查 MySQL 连接...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot -e "SELECT 'OK';" >nul 2>&1
if %errorlevel% neq 0 (
    echo [失败] MySQL 连接失败
    echo.
    echo 请确保 MySQL 服务正在运行且密码为 root
    pause
    exit /b 1
)
echo [成功] MySQL 连接正常

:: 检查端口占用
echo [2/3] 检查端口 3000...
netstat -ano | findstr ":3000" >nul 2>&1
if %errorlevel% equ 0 (
    echo [警告] 端口 3000 已被占用，尝试关闭占用进程...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
        taskkill /F /PID %%a >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
)
echo [成功] 端口检查完成

:: 启动服务
echo [3/3] 启动 Node.js 服务...
echo.
cd /d "%~dp0"
start "轻记账后端" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

:: 测试服务
echo.
echo 测试服务连接...
curl -s http://localhost:3000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo ═════════════════════════════════════════════
    echo   ✅ 服务启动成功！
    echo ═════════════════════════════════════════════
    echo.
    echo   服务地址: http://localhost:3000
    echo   API文档:  http://localhost:3000/health
    echo.
    echo   测试账号: root / Root1234
    echo.
    echo   按任意键打开浏览器测试...
    pause >nul
    start http://localhost:3000/health
) else (
    echo.
    echo ❌ 服务启动失败，请检查控制台输出
    pause
)
