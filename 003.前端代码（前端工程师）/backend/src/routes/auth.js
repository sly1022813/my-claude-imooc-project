/**
 * 认证路由
 * 处理登录、注册等认证相关请求
 */
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { verifyToken } = require('../middlewares/auth');
const { asyncHandler } = require('../middlewares/errorHandler');
const { loginRules, registerRules, changePasswordRules, checkUsernameRules } = require('./validators');

/**
 * @route   POST /api/auth/register
 * @desc    用户注册
 * @access  Public
 */
router.post('/register', registerRules, asyncHandler(AuthController.register));

/**
 * @route   POST /api/auth/login
 * @desc    用户登录
 * @access  Public
 */
router.post('/login', loginRules, asyncHandler(AuthController.login));

/**
 * @route   GET /api/auth/check-username
 * @desc    检查用户名是否可用
 * @access  Public
 */
router.get('/check-username', checkUsernameRules, asyncHandler(AuthController.checkUsername));

/**
 * @route   GET /api/auth/me
 * @desc    获取当前用户信息
 * @access  Private
 */
router.get('/me', verifyToken, asyncHandler(AuthController.getCurrentUser));

/**
 * @route   POST /api/auth/change-password
 * @desc    修改密码
 * @access  Private
 */
router.post('/change-password', verifyToken, changePasswordRules, asyncHandler(AuthController.changePassword));

module.exports = router;
