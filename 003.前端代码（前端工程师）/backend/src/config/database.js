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
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  timezone: '+08:00',
  dateStrings: true,
  namedPlaceholders: true
});

// 测试连接
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ 数据库连接成功');
    connection.release();
    return true;
  } catch (err) {
    console.error('❌ 数据库连接失败:', err.message);
    return false;
  }
}

module.exports = {
  pool,
  testConnection
};
