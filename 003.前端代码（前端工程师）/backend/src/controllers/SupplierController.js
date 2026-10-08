/**
 * 供应商控制器
 */
const { validationResult } = require('express-validator');
const SupplierModel = require('../models/SupplierModel');
const { success, businessError, validationError, notFound } = require('../utils/response');

/**
 * 创建供应商
 * POST /api/suppliers
 */
async function create(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationError(res, '参数验证失败', errors.array());
    }

    const userId = req.user.id;
    const { name, phone, address, contactPerson, products, settlementType, remark } = req.body;

    const supplier = await SupplierModel.create(userId, {
      name, phone, address, contactPerson, products, settlementType, remark
    });

    return success(res, supplier, '创建成功', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * 获取供应商列表
 * GET /api/suppliers
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

    const result = await SupplierModel.getList(userId, params);

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
 * 获取供应商详情
 * GET /api/suppliers/:id
 */
async function getById(req, res, next) {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id);

    const supplier = await SupplierModel.findById(id, userId);
    if (!supplier) {
      return notFound(res, '供应商不存在');
    }

    return success(res, supplier, '获取成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 更新供应商
 * PUT /api/suppliers/:id
 */
async function update(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationError(res, '参数验证失败', errors.array());
    }

    const userId = req.user.id;
    const id = parseInt(req.params.id);
    const { name, phone, address, contactPerson, products, settlementType, remark, status } = req.body;

    const supplier = await SupplierModel.update(id, userId, {
      name, phone, address, contactPerson, products, settlementType, remark, status
    });

    if (!supplier) {
      return notFound(res, '供应商不存在');
    }

    return success(res, supplier, '更新成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 删除供应商
 * DELETE /api/suppliers/:id
 */
async function remove(req, res, next) {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id);

    const supplier = await SupplierModel.findById(id, userId);
    if (!supplier) {
      return notFound(res, '供应商不存在');
    }

    await SupplierModel.delete(id, userId);

    return success(res, null, '删除成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 获取供应商交易明细
 * GET /api/suppliers/:id/transactions
 */
async function getTransactions(req, res, next) {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id);
    const params = {
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 20
    };

    const supplier = await SupplierModel.findById(id, userId);
    if (!supplier) {
      return notFound(res, '供应商不存在');
    }

    const result = await SupplierModel.getTransactions(id, userId, params);

    return success(res, {
      supplier: {
        id: supplier.id,
        name: supplier.name,
        totalPurchase: supplier.total_purchase,
        outstandingAmount: supplier.outstanding_amount
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
