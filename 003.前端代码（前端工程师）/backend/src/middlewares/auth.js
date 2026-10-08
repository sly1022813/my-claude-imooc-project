/**
 * JWT认证中间件
 */
const jwt = require('jsonwebtoken');
const config = require('../config');
const { unauthorized, error } = require('../utils/response');

/**
 * 验证JWT Token
 */
function verifyToken(req, res, next) {
  try {
    // 从请求头获取Token
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return unauthorized(res, '未提供认证令牌');
    }

    // 检查格式
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return unauthorized(res, '令牌格式错误，应为: Bearer <token>');
    }

    const token = parts[1];

    // 验证Token
    const decoded = jwt.verify(token, config.jwt.secret);

    // 将用户信息挂载到req对象
    req.user = {
      id: decoded.id,
      username: decoded.username,
      userType: decoded.userType
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return unauthorized(res, '令牌已过期，请重新登录');
    }
    if (err.name === 'JsonWebTokenError') {
      return unauthorized(res, '无效的令牌');
    }
    return error(res, '认证失败', 500);
  }
}

/**
 * 生成JWT Token
 * @param {Object} user - 用户信息
 * @returns {string} JWT Token
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      userType: user.userType
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}

module.exports = {
  verifyToken,
  generateToken
};
