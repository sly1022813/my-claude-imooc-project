/**
 * 客户路由
 */
const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/CustomerController');
const { verifyToken } = require('../middlewares/auth');
const { asyncHandler } = require('../middlewares/errorHandler');
const { createCustomerRules, updateCustomerRules } = require('./validators_business');

// 所有路由需要认证
router.use(verifyToken);

/**
 * @route   GET /api/customers
 * @desc    获取客户列表
 * @access  Private
 */
router.get('/', asyncHandler(CustomerController.getList));

/**
 * @route   GET /api/customers/:id
 * @desc    获取客户详情
 * @access  Private
 */
router.get('/:id', asyncHandler(CustomerController.getById));

/**
 * @route   GET /api/customers/:id/transactions
 * @desc    获取客户交易明细
 * @access  Private
 */
router.get('/:id/transactions', asyncHandler(CustomerController.getTransactions));

/**
 * @route   POST /api/customers
 * @desc    创建客户
 * @access  Private
 */
router.post('/', createCustomerRules, asyncHandler(CustomerController.create));

/**
 * @route   PUT /api/customers/:id
 * @desc    更新客户
 * @access  Private
 */
router.put('/:id', updateCustomerRules, asyncHandler(CustomerController.update));

/**
 * @route   DELETE /api/customers/:id
 * @desc    删除客户
 * @access  Private
 */
router.delete('/:id', asyncHandler(CustomerController.remove));

module.exports = router;
