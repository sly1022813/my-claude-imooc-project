@echo off
chcp 65001 >nul
echo ===========================================
echo   轻记账 - 数据库初始化脚本
echo ===========================================
echo.

:: 请在这里设置你的 MySQL 密码
set MYSQL_PASSWORD=你的MySQL密码

echo 请在下面输入你的 MySQL root 密码:
echo 注意：输入时看不到字符是正常的
echo.
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p -e "SHOW DATABASES;"
pause
