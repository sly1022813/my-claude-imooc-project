/**
 * 收支记录路由
 */
const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/TransactionController');
const { verifyToken } = require('../middlewares/auth');
const { asyncHandler } = require('../middlewares/errorHandler');
const { createTransactionRules, updateTransactionRules } = require('./validators_business');

// 所有路由需要认证
router.use(verifyToken);

/**
 * @route   GET /api/transactions
 * @desc    获取收支记录列表
 * @access  Private
 */
router.get('/', asyncHandler(TransactionController.getList));

/**
 * @route   GET /api/transactions/stats/monthly
 * @desc    获取月度统计
 * @access  Private
 */
router.get('/stats/monthly', asyncHandler(TransactionController.getMonthlyStats));

/**
 * @route   GET /api/transactions/stats/daily-trend
 * @desc    获取每日趋势
 * @access  Private
 */
router.get('/stats/daily-trend', asyncHandler(TransactionController.getDailyTrend));

/**
 * @route   GET /api/transactions/pending
 * @desc    获取待收/待付款列表
 * @access  Private
 */
router.get('/pending', asyncHandler(TransactionController.getPendingList));

/**
 * @route   GET /api/transactions/:id
 * @desc    获取收支记录详情
 * @access  Private
 */
router.get('/:id', asyncHandler(TransactionController.getById));

/**
 * @route   POST /api/transactions
 * @desc    创建收支记录
 * @access  Private
 */
router.post('/', createTransactionRules, asyncHandler(TransactionController.create));

/**
 * @route   PUT /api/transactions/:id
 * @desc    更新收支记录
 * @access  Private
 */
router.put('/:id', updateTransactionRules, asyncHandler(TransactionController.update));

/**
 * @route   DELETE /api/transactions/:id
 * @desc    删除收支记录
 * @access  Private
 */
router.delete('/:id', asyncHandler(TransactionController.remove));

/**
 * @route   POST /api/transactions/:id/settle
 * @desc    收讫处理
 * @access  Private
 */
router.post('/:id/settle', asyncHandler(TransactionController.settle));

module.exports = router;
