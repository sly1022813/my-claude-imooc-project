@echo off
chcp 65001 >nul
echo ===========================================
echo   轻记账 - MySQL 连接测试
echo ===========================================
echo.
echo 请输入你的 MySQL root 密码（输入时看不到字符是正常的）:
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p -e "SELECT '连接成功!' as result; SHOW DATABASES;"
pause
