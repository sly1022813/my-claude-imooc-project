/**
 * 分类路由
 */
const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');
const { verifyToken } = require('../middlewares/auth');
const { asyncHandler } = require('../middlewares/errorHandler');
const { createCategoryRules, updateCategoryRules } = require('./validators_business');

// 所有路由需要认证
router.use(verifyToken);

/**
 * @route   GET /api/categories
 * @desc    获取分类列表
 * @access  Private
 */
router.get('/', asyncHandler(CategoryController.getList));

/**
 * @route   GET /api/categories/:id
 * @desc    获取分类详情
 * @access  Private
 */
router.get('/:id', asyncHandler(CategoryController.getById));

/**
 * @route   POST /api/categories
 * @desc    创建自定义分类
 * @access  Private
 */
router.post('/', createCategoryRules, asyncHandler(CategoryController.create));

/**
 * @route   PUT /api/categories/:id
 * @desc    更新分类
 * @access  Private
 */
router.put('/:id', updateCategoryRules, asyncHandler(CategoryController.update));

/**
 * @route   DELETE /api/categories/:id
 * @desc    删除分类
 * @access  Private
 */
router.delete('/:id', asyncHandler(CategoryController.remove));

module.exports = router;
