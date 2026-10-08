/**
 * 数据库连接配置
 */
const mysql = require('mysql');
const config = require('./index');

// 创建连接池
const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: 'root',
  password: 'root',
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+08:00',
  dateStrings: true
});

// 测试连接
function testConnection() {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('❌ 数据库连接失败:', err.message);
        resolve(false);
      } else {
        console.log('✅ 数据库连接成功');
        connection.release();
        resolve(true);
      }
    });
  });
}

module.exports = {
  pool,
  testConnection
};
