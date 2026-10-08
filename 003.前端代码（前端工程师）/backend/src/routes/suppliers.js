/**
 * 供应商路由
 */
const express = require('express');
const router = express.Router();
const SupplierController = require('../controllers/SupplierController');
const { verifyToken } = require('../middlewares/auth');
const { asyncHandler } = require('../middlewares/errorHandler');
const { createSupplierRules, updateSupplierRules } = require('./validators_business');

// 所有路由需要认证
router.use(verifyToken);

/**
 * @route   GET /api/suppliers
 * @desc    获取供应商列表
 * @access  Private
 */
router.get('/', asyncHandler(SupplierController.getList));

/**
 * @route   GET /api/suppliers/:id
 * @desc    获取供应商详情
 * @access  Private
 */
router.get('/:id', asyncHandler(SupplierController.getById));

/**
 * @route   GET /api/suppliers/:id/transactions
 * @desc    获取供应商交易明细
 * @access  Private
 */
router.get('/:id/transactions', asyncHandler(SupplierController.getTransactions));

/**
 * @route   POST /api/suppliers
 * @desc    创建供应商
 * @access  Private
 */
router.post('/', createSupplierRules, asyncHandler(SupplierController.create));

/**
 * @route   PUT /api/suppliers/:id
 * @desc    更新供应商
 * @access  Private
 */
router.put('/:id', updateSupplierRules, asyncHandler(SupplierController.update));

/**
 * @route   DELETE /api/suppliers/:id
 * @desc    删除供应商
 * @access  Private
 */
router.delete('/:id', asyncHandler(SupplierController.remove));

module.exports = router;
