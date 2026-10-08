/**
 * 认证控制器
 * 处理登录、注册、登出等认证相关操作
 */
const { validationResult } = require('express-validator');
const UserModel = require('../models/UserModel');
const LoginLogModel = require('../models/LoginLogModel');
const { generateToken } = require('../middlewares/auth');
const { success, error, businessError, validationError, unauthorized } = require('../utils/response');

// 登录失败锁定次数
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCK_MINUTES = 30;

/**
 * 用户登录
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    // 验证参数
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationError(res, '参数验证失败', errors.array());
    }

    const { username, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || '';

    // 检查登录失败次数
    const recentFails = await LoginLogModel.getRecentFailCount(username, LOGIN_LOCK_MINUTES);
    if (recentFails >= MAX_LOGIN_ATTEMPTS) {
      await LoginLogModel.create({
        username,
        loginStatus: 0,
        failReason: '登录失败次数过多，账号被临时锁定',
        ipAddress,
        userAgent
      });
      return businessError(res, `登录失败次数过多，请 ${LOGIN_LOCK_MINUTES} 分钟后再试`, 1003);
    }

    // 查找用户
    const user = await UserModel.findByUsername(username);
    if (!user) {
      // 记录登录失败
      await LoginLogModel.create({
        username,
        loginStatus: 0,
        failReason: '用户不存在',
        ipAddress,
        userAgent
      });
      return businessError(res, '用户名或密码错误', 1001);
    }

    // 验证密码
    const isPasswordValid = await UserModel.verifyPassword(password, user.password_hash);
    if (!isPasswordValid) {
      // 记录登录失败
      await LoginLogModel.create({
        userId: user.id,
        username,
        loginStatus: 0,
        failReason: '密码错误',
        ipAddress,
        userAgent
      });
      return businessError(res, '用户名或密码错误', 1001);
    }

    // 检查账号状态
    if (user.status === 0) {
      await LoginLogModel.create({
        userId: user.id,
        username,
        loginStatus: 0,
        failReason: '账号已被禁用',
        ipAddress,
        userAgent
      });
      return businessError(res, '账号已被禁用，请联系管理员', 1002);
    }

    // 更新最后登录信息
    await UserModel.updateLastLogin(user.id, ipAddress);

    // 记录登录成功
    await LoginLogModel.create({
      userId: user.id,
      username,
      loginStatus: 1,
      ipAddress,
      userAgent
    });

    // 生成Token
    const token = generateToken({
      id: user.id,
      username: user.username,
      userType: user.user_type
    });

    // 返回用户信息（不含密码）
    const userInfo = {
      id: user.id,
      username: user.username,
      userType: user.user_type,
      nickname: user.nickname,
      phone: user.phone,
      email: user.email,
      avatarUrl: user.avatar_url,
      businessName: user.business_name
    };

    return success(res, { token, user: userInfo }, '登录成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 用户注册
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    // 验证参数
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationError(res, '参数验证失败', errors.array());
    }

    const { username, password, confirmPassword, userType, nickname, phone } = req.body;

    // 验证密码确认
    if (password !== confirmPassword) {
      return businessError(res, '两次输入的密码不一致', 2003);
    }

    // 检查用户名是否存在
    const exists = await UserModel.existsByUsername(username);
    if (exists) {
      return businessError(res, '该用户名已被注册', 2001);
    }

    // 创建用户
    const user = await UserModel.create({
      username,
      password,
      userType: parseInt(userType) || 1,
      nickname: nickname || username,
      phone
    });

    // 生成Token（注册后自动登录）
    const token = generateToken({
      id: user.id,
      username: user.username,
      userType: user.user_type
    });

    // 返回用户信息
    const userInfo = {
      id: user.id,
      username: user.username,
      userType: user.user_type,
      nickname: user.nickname,
      phone: user.phone
    };

    return success(res, { token, user: userInfo }, '注册成功', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * 获取当前用户信息
 * GET /api/auth/me
 */
async function getCurrentUser(req, res, next) {
  try {
    const userId = req.user.id;
    const user = await UserModel.findById(userId);

    if (!user) {
      return unauthorized(res, '用户不存在或已被删除');
    }

    const userInfo = {
      id: user.id,
      username: user.username,
      userType: user.user_type,
      nickname: user.nickname,
      phone: user.phone,
      email: user.email,
      avatarUrl: user.avatar_url,
      businessName: user.business_name,
      lastLoginAt: user.last_login_at
    };

    return success(res, userInfo, '获取成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 修改密码
 * POST /api/auth/change-password
 */
async function changePassword(req, res, next) {
  try {
    // 验证参数
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationError(res, '参数验证失败', errors.array());
    }

    const userId = req.user.id;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // 验证新密码确认
    if (newPassword !== confirmPassword) {
      return businessError(res, '两次输入的新密码不一致', 3003);
    }

    // 验证新密码不能与旧密码相同
    if (oldPassword === newPassword) {
      return businessError(res, '新密码不能与旧密码相同', 3004);
    }

    // 获取用户信息
    const user = await UserModel.findById(userId);
    if (!user) {
      return unauthorized(res, '用户不存在');
    }

    // 验证旧密码
    const isOldPasswordValid = await UserModel.verifyPassword(oldPassword, user.password_hash);
    if (!isOldPasswordValid) {
      return businessError(res, '原密码错误', 3001);
    }

    // 更新密码
    await UserModel.updatePassword(userId, newPassword);

    return success(res, null, '密码修改成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 检查用户名是否可用
 * GET /api/auth/check-username
 */
async function checkUsername(req, res, next) {
  try {
    const { username } = req.query;

    if (!username) {
      return businessError(res, '用户名不能为空', 4001);
    }

    const exists = await UserModel.existsByUsername(username);

    return success(res, { available: !exists }, exists ? '用户名已被占用' : '用户名可用');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login,
  register,
  getCurrentUser,
  changePassword,
  checkUsername
};
