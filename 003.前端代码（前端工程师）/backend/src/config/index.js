/**
 * 配置文件
 * 加载环境变量
 */
require('dotenv').config();

module.exports = {
  // 服务器配置
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // 数据库配置
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'light_accounting',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },

  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_key_change_this',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  // CORS配置
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:8080'
  }
};
