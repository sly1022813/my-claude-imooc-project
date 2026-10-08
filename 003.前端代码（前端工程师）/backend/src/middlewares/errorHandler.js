/**
 * 全局错误处理中间件
 */
const { error } = require('../utils/response');

/**
 * 404处理
 */
function notFoundHandler(req, res) {
  res.status(404).json({
    code: 404,
    success: false,
    message: `路由 ${req.method} ${req.path} 不存在`
  });
}

/**
 * 全局错误处理
 */
function errorHandler(err, req, res, next) {
  console.error('========== 错误日志 ==========');
  console.error('时间:', new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }));
  console.error('请求:', req.method, req.path);
  console.error('错误:', err.message);
  console.error('堆栈:', err.stack);
  console.error('==============================');

  // MySQL错误处理
  if (err.code === 'ER_DUP_ENTRY') {
    return error(res, '数据已存在，请勿重复添加', 409);
  }

  // JWT错误
  if (err.name === 'JsonWebTokenError') {
    return error(res, '无效的认证令牌', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return error(res, '认证令牌已过期', 401);
  }

  // 验证器错误
  if (err.name === 'ValidationError') {
    return error(res, err.message, 400);
  }

  // 默认错误响应
  const statusCode = err.statusCode || 500;
  const message = err.expose ? err.message : '服务器内部错误';

  error(res, message, statusCode);
}

/**
 * 异步处理器包装
 * 捕获async函数中的错误
 */
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = {
  notFoundHandler,
  errorHandler,
  asyncHandler
};
