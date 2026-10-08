/**
 * 客户控制器
 */
const { validationResult } = require('express-validator');
const CustomerModel = require('../models/CustomerModel');
const { success, businessError, validationError, notFound } = require('../utils/response');

/**
 * 创建客户
 * POST /api/customers
 */
async function create(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationError(res, '参数验证失败', errors.array());
    }

    const userId = req.user.id;
    const { name, phone, address, customerType, creditLimit, remark } = req.body;

    const customer = await CustomerModel.create(userId, {
      name, phone, address, customerType, creditLimit, remark
    });

    return success(res, customer, '创建成功', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * 获取客户列表
 * GET /api/customers
 */
async function getList(req, res, next) {
  try {
    const userId = req.user.id;
    const params = {
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 20,
      keyword: req.query.keyword || '',
      status: req.query.status !== undefined ? parseInt(req.query.status) : null,
      hasOutstanding: req.query.hasOutstanding
    };

    const result = await CustomerModel.getList(userId, params);

    return success(res, {
      list: result.list,
      pagination: {
        total: result.total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages: Math.ceil(result.total / params.pageSize)
      }
    }, '获取成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 获取客户详情
 * GET /api/customers/:id
 */
async function getById(req, res, next) {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id);

    const customer = await CustomerModel.findById(id, userId);
    if (!customer) {
      return notFound(res, '客户不存在');
    }

    return success(res, customer, '获取成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 更新客户
 * PUT /api/customers/:id
 */
async function update(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationError(res, '参数验证失败', errors.array());
    }

    const userId = req.user.id;
    const id = parseInt(req.params.id);
    const { name, phone, address, customerType, creditLimit, remark, status } = req.body;

    const customer = await CustomerModel.update(id, userId, {
      name, phone, address, customerType, creditLimit, remark, status
    });

    if (!customer) {
      return notFound(res, '客户不存在');
    }

    return success(res, customer, '更新成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 删除客户
 * DELETE /api/customers/:id
 */
async function remove(req, res, next) {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id);

    const customer = await CustomerModel.findById(id, userId);
    if (!customer) {
      return notFound(res, '客户不存在');
    }

    await CustomerModel.delete(id, userId);

    return success(res, null, '删除成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 获取客户交易明细
 * GET /api/customers/:id/transactions
 */
async function getTransactions(req, res, next) {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id);
    const params = {
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 20
    };

    const customer = await CustomerModel.findById(id, userId);
    if (!customer) {
      return notFound(res, '客户不存在');
    }

    const result = await CustomerModel.getTransactions(id, userId, params);

    return success(res, {
      customer: {
        id: customer.id,
        name: customer.name,
        totalTransaction: customer.total_transaction,
        outstandingAmount: customer.outstanding_amount
      },
      list: result.list,
      pagination: {
        total: result.total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages: Math.ceil(result.total / params.pageSize)
      }
    }, '获取成功');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  create,
  getList,
  getById,
  update,
  remove,
  getTransactions
};
