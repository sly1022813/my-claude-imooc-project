@echo off
chcp 65001 >nul
echo ===========================================
echo   轻记账 - 创建测试账号
echo ===========================================
echo.
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot < create_user.sql
echo.
echo 创建测试数据...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot light_accounting -e "SELECT * FROM users;"
echo.
pause
