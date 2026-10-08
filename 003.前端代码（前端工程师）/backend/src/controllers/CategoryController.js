/**
 * 分类控制器
 */
const { validationResult } = require('express-validator');
const CategoryModel = require('../models/CategoryModel');
const { success, businessError, validationError, notFound } = require('../utils/response');

/**
 * 获取分类列表
 * GET /api/categories
 */
async function getList(req, res, next) {
  try {
    const userId = req.user.id;
    const type = req.query.type ? parseInt(req.query.type) : null;

    const categories = await CategoryModel.getList(userId, type);

    // 格式化返回数据
    const formatted = categories.map(c => ({
      id: c.id,
      userId: c.user_id,
      type: c.type,
      name: c.name,
      icon: c.icon,
      color: c.color,
      isSystem: c.is_system === 1,
      sortOrder: c.sort_order,
      status: c.status
    }));

    return success(res, formatted, '获取成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 获取分类详情
 * GET /api/categories/:id
 */
async function getById(req, res, next) {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id);

    const category = await CategoryModel.findById(id, userId);
    if (!category) {
      return notFound(res, '分类不存在');
    }

    return success(res, {
      id: category.id,
      userId: category.user_id,
      type: category.type,
      name: category.name,
      icon: category.icon,
      color: category.color,
      isSystem: category.is_system === 1,
      sortOrder: category.sort_order,
      status: category.status
    }, '获取成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 创建自定义分类
 * POST /api/categories
 */
async function create(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationError(res, '参数验证失败', errors.array());
    }

    const userId = req.user.id;
    const { type, name, icon, color } = req.body;

    const category = await CategoryModel.create({
      userId, type, name, icon, color
    });

    return success(res, {
      id: category.id,
      userId: category.user_id,
      type: category.type,
      name: category.name,
      icon: category.icon,
      color: category.color,
      isSystem: false,
      sortOrder: category.sort_order,
      status: category.status
    }, '创建成功', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * 更新分类
 * PUT /api/categories/:id
 */
async function update(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationError(res, '参数验证失败', errors.array());
    }

    const userId = req.user.id;
    const id = parseInt(req.params.id);
    const { name, icon, color, sortOrder, status } = req.body;

    const category = await CategoryModel.update(id, userId, {
      name, icon, color, sortOrder, status
    });

    if (!category) {
      return businessError(res, '分类不存在或不能修改系统分类', 4001);
    }

    return success(res, {
      id: category.id,
      userId: category.user_id,
      type: category.type,
      name: category.name,
      icon: category.icon,
      color: category.color,
      isSystem: category.is_system === 1,
      sortOrder: category.sort_order,
      status: category.status
    }, '更新成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 删除分类
 * DELETE /api/categories/:id
 */
async function remove(req, res, next) {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id);

    const category = await CategoryModel.findById(id, userId);
    if (!category) {
      return notFound(res, '分类不存在');
    }

    if (category.is_system === 1) {
      return businessError(res, '系统分类不能删除', 4002);
    }

    await CategoryModel.delete(id, userId);

    return success(res, null, '删除成功');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getList,
  getById,
  create,
  update,
  remove
};
