@echo off
chcp 65001 >nul
echo ===========================================
echo   轻记账 - MySQL 连接测试
echo ===========================================
echo.
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot -e "SELECT '连接成功!' as result; SHOW DATABASES;"
pause
