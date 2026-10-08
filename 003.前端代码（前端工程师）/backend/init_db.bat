@echo off
chcp 65001 >nul
echo ===========================================
echo   轻记账 - 数据库初始化
echo ===========================================
echo.
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot < init.sql
echo.
echo 完成！按任意键退出...
pause >nul
