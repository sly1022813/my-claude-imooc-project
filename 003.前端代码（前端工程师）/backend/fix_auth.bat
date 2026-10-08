@echo off
chcp 65001 >nul
echo ===========================================
echo   修复 MySQL 认证问题
echo ===========================================
echo.

:: 尝试多个可能的 MySQL 安装路径
set MYSQL_BIN=

if exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" (
    set MYSQL_BIN=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
) else if exist "C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe" (
    set MYSQL_BIN=C:\Program Files (x86)\MySQL\MySQL Server 8.0\bin\mysql.exe
) else if exist "C:\MySQL\MySQL Server 8.0\bin\mysql.exe" (
    set MYSQL_BIN=C:\MySQL\MySQL Server 8.0\bin\mysql.exe
) else if exist "mysql.exe" (
    set MYSQL_BIN=mysql.exe
) else (
    echo 错误：找不到 mysql.exe
    echo 请确保 MySQL 已安装
    pause
    exit /b 1
)

echo 使用 MySQL: %MYSQL_BIN%
echo.

echo 正在修改 root 用户认证方式...
"%MYSQL_BIN%" -u root -proot -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';"
if errorlevel 1 (
    echo 修改认证失败，请检查密码是否正确
    pause
    exit /b 1
)
echo.
echo 正在刷新权限...
"%MYSQL_BIN%" -u root -proot -e "FLUSH PRIVILEGES;"
echo.
echo 验证修改结果：
"%MYSQL_BIN%" -u root -proot -e "SELECT user, host, plugin FROM mysql.user WHERE user='root';"
echo.
echo 完成！
pause
