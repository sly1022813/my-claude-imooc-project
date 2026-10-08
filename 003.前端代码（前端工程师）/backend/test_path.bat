@echo off
chcp 65001 >nul
echo 测试 MySQL...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -proot -e "SELECT '成功' as result"
pause
