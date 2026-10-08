@echo off
chcp 65001 >nul
echo ========================================
echo   轻记账 - 前后端对接测试
echo ========================================
echo.

:: 检查后端是否运行
echo [1/3] 检查后端服务状态...
curl -s http://localhost:3000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo   ✓ 后端服务已运行 (http://localhost:3000)
) else (
    echo   ✗ 后端服务未运行
    echo.
    echo   请先启动后端服务：
    echo   cd backend
    echo   npm run dev
    echo.
    pause
    exit /b 1
)

:: 检查前端文件
echo [2/3] 检查前端文件...
if exist "frontend\index.html" (
    echo   ✓ index.html 存在
) else (
    echo   ✗ index.html 不存在
)

if exist "frontend\pages\records.html" (
    echo   ✓ records.html 存在
) else (
    echo   ✗ records.html 不存在
)

if exist "frontend\pages\customers.html" (
    echo   ✓ customers.html 存在
) else (
    echo   ✗ customers.html 不存在
)

if exist "frontend\pages\mine.html" (
    echo   ✓ mine.html 存在
) else (
    echo   ✗ mine.html 不存在
)

:: 打开浏览器
echo [3/3] 打开前端页面...
echo.
echo   启动完成！
echo.
echo   请访问以下地址测试：
echo   - 登录页: http://localhost:8080/frontend/login.html
echo   - 首页:   http://localhost:8080/frontend/index.html
echo.
start "" "http://localhost:8080/frontend/login.html"

echo 按任意键退出...
pause >nul
