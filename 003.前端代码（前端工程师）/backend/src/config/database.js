/**
 * 数据库连接配置
 */
const mysql = require('mysql2/promise');
const config = require('./index');

// 创建连接池
const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: config.db.waitForConnections,
  connectionLimit: config.db.connectionLimit,
  queueLimit: config.db.queueLimit,
  timezone: '+08:00', // 东八区时区
  dateStrings: true  // 返回日期字符串而不是Date对象
});

// 测试连接
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ 数据库连接成功');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message);
    return false;
  }
}

module.exports = {
  pool,
  testConnection
};
