@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    轻记账 Java 后端服务启动脚本
echo ========================================
echo.

cd /d "%~dp0"

REM 检查Java
java -version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到Java环境，请先安装 JDK 17+
    pause
    exit /b 1
)

REM 检查Maven
where mvn >nul 2>&1
if errorlevel 1 (
    echo [提示] 未检测到Maven，将尝试使用 mvnw 或直接运行jar
)

echo [1] 编译并运行 (mvn spring-boot:run)
echo [2] 仅编译 (mvn clean package)
echo [3] 运行已编译的jar
echo [4] 退出
echo.

set /p choice=请选择操作 [1-4]:

if "%choice%"=="1" goto run_dev
if "%choice%"=="2" goto build
if "%choice%"=="3" goto run_jar
if "%choice%"=="4" goto end

:run_dev
echo.
echo 正在启动服务，请稍候...
echo.
mvn spring-boot:run
goto end

:build
echo.
echo 正在编译项目，请稍候...
echo.
mvn clean package
if errorlevel 1 (
    echo.
    echo [错误] 编译失败！
    pause
    exit /b 1
)
echo.
echo 编译成功！jar文件位于 target/light-accounting-backend-1.0.0.jar
pause
goto end

:run_jar
if not exist "target\light-accounting-backend-1.0.0.jar" (
    echo.
    echo [错误] 未找到编译后的jar文件，请先执行编译
    pause
    exit /b 1
)
echo.
echo 正在启动服务，请稍候...
echo.
java -jar target\light-accounting-backend-1.0.0.jar
goto end

:end
pause
