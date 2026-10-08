/**
 * 轻记账后端服务入口
 */
const express = require('express');
const cors = require('cors');
const config = require('./config');
const { testConnection } = require('./config/database');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

// 导入路由
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const transactionRoutes = require('./routes/transactions');
const customerRoutes = require('./routes/customers');
const supplierRoutes = require('./routes/suppliers');

// 创建Express应用
const app = express();

// ==================== 中间件配置 ====================

// 解析JSON请求体
app.use(express.json({ limit: '10mb' }));

// 解析URL编码请求体
app.use(express.urlencoded({ extended: true }));

// CORS跨域配置
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 请求日志中间件
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// ==================== API路由 ====================

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    code: 0,
    success: true,
    message: '服务运行正常',
    data: {
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }
  });
});

// API路由
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/suppliers', supplierRoutes);

// ==================== 错误处理 ====================

// 404处理
app.use(notFoundHandler);

// 全局错误处理
app.use(errorHandler);

// ==================== 启动服务器 ====================

async function startServer() {
  try {
    // 测试数据库连接
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('❌ 数据库连接失败，无法启动服务');
      process.exit(1);
    }

    // 启动服务器
    app.listen(config.port, () => {
      console.log('');
      console.log('╔════════════════════════════════════════════════════════════╗');
      console.log('║                                                            ║');
      console.log('║           🎀 轻记账后端服务启动成功！ 🎀                   ║');
      console.log('║                                                            ║');
      console.log(`║   服务地址: http://localhost:${config.port}                         ║`);
      console.log(`║   环境: ${config.nodeEnv.padEnd(43)}║`);
      console.log(`║   数据库: ${config.db.database.padEnd(42)}║`);
      console.log('║                                                            ║');
      console.log('║   API接口:                                                ║');
      console.log('║   认证模块:                                              ║');
      console.log('║   POST /api/auth/register      - 用户注册                  ║');
      console.log('║   POST /api/auth/login         - 用户登录                  ║');
      console.log('║   GET  /api/auth/me            - 获取当前用户             ║');
      console.log('║   收支记录:                                              ║');
      console.log('║   GET/POST /api/transactions   - 收支记录CRUD            ║');
      console.log('║   GET /api/transactions/stats - 统计接口                ║');
      console.log('║   分类管理:                                              ║');
      console.log('║   GET/POST /api/categories    - 分类CRUD                 ║');
      console.log('║   客户管理:                                              ║');
      console.log('║   GET/POST /api/customers     - 客户CRUD                 ║');
      console.log('║   供应商管理:                                            ║');
      console.log('║   GET/POST /api/suppliers     - 供应商CRUD               ║');
      console.log('║                                                            ║');
      console.log('╚════════════════════════════════════════════════════════════╝');
      console.log('');
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
}

// 启动服务
startServer();

// 优雅退出
process.on('SIGTERM', () => {
  console.log('SIGTERM信号接收，正在关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT信号接收，正在关闭服务器...');
  process.exit(0);
});
