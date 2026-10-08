/**
 * 收支记录控制器
 */
const { validationResult } = require('express-validator');
const TransactionModel = require('../models/TransactionModel');
const CategoryModel = require('../models/CategoryModel');
const { success, error, businessError, validationError, notFound } = require('../utils/response');

/**
 * 创建收支记录
 * POST /api/transactions
 */
async function create(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationError(res, '参数验证失败', errors.array());
    }

    const userId = req.user.id;
    const {
      type, amount, categoryId, date, time,
      paymentMethod, counterparty, counterpartyType, counterpartyId,
      status, remark
    } = req.body;

    // 验证分类
    const category = await CategoryModel.findById(categoryId, userId);
    if (!category) {
      return businessError(res, '分类不存在', 4001);
    }

    // 验证分类类型匹配
    if (category.type !== type) {
      return businessError(res, '分类类型与记录类型不匹配', 4002);
    }

    // 创建记录
    const transaction = await TransactionModel.create({
      userId, type, amount, categoryId, date, time,
      paymentMethod, counterparty, counterpartyType, counterpartyId,
      status, remark
    });

    return success(res, transaction, '创建成功', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * 获取收支记录列表
 * GET /api/transactions
 */
async function getList(req, res, next) {
  try {
    const userId = req.user.id;
    const params = {
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 20,
      type: req.query.type ? parseInt(req.query.type) : null,
      categoryId: req.query.categoryId ? parseInt(req.query.categoryId) : null,
      status: req.query.status !== undefined ? parseInt(req.query.status) : null,
      counterpartyType: req.query.counterpartyType ? parseInt(req.query.counterpartyType) : null,
      startDate: req.query.startDate || null,
      endDate: req.query.endDate || null,
      keyword: req.query.keyword || null
    };

    const result = await TransactionModel.getList(userId, params);

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
 * 获取收支记录详情
 * GET /api/transactions/:id
 */
async function getById(req, res, next) {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id);

    const transaction = await TransactionModel.findById(id, userId);
    if (!transaction) {
      return notFound(res, '记录不存在');
    }

    return success(res, transaction, '获取成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 更新收支记录
 * PUT /api/transactions/:id
 */
async function update(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return validationError(res, '参数验证失败', errors.array());
    }

    const userId = req.user.id;
    const id = parseInt(req.params.id);
    const {
      amount, categoryId, date, time,
      paymentMethod, counterparty, counterpartyType, counterpartyId,
      status, remark
    } = req.body;

    // 验证分类（如果提供）
    if (categoryId) {
      const category = await CategoryModel.findById(categoryId, userId);
      if (!category) {
        return businessError(res, '分类不存在', 4001);
      }
    }

    const transaction = await TransactionModel.update(id, userId, {
      amount, categoryId, date, time,
      paymentMethod, counterparty, counterpartyType, counterpartyId,
      status, remark
    });

    if (!transaction) {
      return notFound(res, '记录不存在');
    }

    return success(res, transaction, '更新成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 删除收支记录
 * DELETE /api/transactions/:id
 */
async function remove(req, res, next) {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id);

    const result = await TransactionModel.delete(id, userId);
    if (!result) {
      return notFound(res, '记录不存在');
    }

    return success(res, null, '删除成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 获取月度统计
 * GET /api/transactions/stats/monthly
 */
async function getMonthlyStats(req, res, next) {
  try {
    const userId = req.user.id;
    const yearMonth = req.query.yearMonth || new Date().toISOString().slice(0, 7);

    const stats = await TransactionModel.getMonthlyStats(userId, yearMonth);

    // 按类型分组分类统计
    const expenseByCategory = (stats.categoryStats || [])
      .filter(c => c.type === 1)
      .map(c => ({
        category_id: c.category_id,
        category_name: c.category_name,
        category_icon: c.category_icon,
        category_color: c.category_color,
        total: c.total_amount
      }));

    const incomeByCategory = (stats.categoryStats || [])
      .filter(c => c.type === 2)
      .map(c => ({
        category_id: c.category_id,
        category_name: c.category_name,
        category_icon: c.category_icon,
        category_color: c.category_color,
        total: c.total_amount
      }));

    return success(res, {
      month: yearMonth,
      totalExpense: stats.total_expense || 0,
      totalIncome: stats.total_income || 0,
      netProfit: stats.net_profit || 0,
      expenseCount: stats.expense_count || 0,
      incomeCount: stats.income_count || 0,
      expenseByCategory,
      incomeByCategory
    }, '获取成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 获取每日趋势
 * GET /api/transactions/stats/daily-trend
 */
async function getDailyTrend(req, res, next) {
  try {
    const userId = req.user.id;
    const days = parseInt(req.query.days) || 7;

    const endDate = new Date().toISOString().slice(0, 10);
    const startDate = new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const trend = await TransactionModel.getDailyTrend(userId, startDate, endDate);

    return success(res, {
      startDate,
      endDate,
      days,
      data: trend
    }, '获取成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 获取待收/待付款列表
 * GET /api/transactions/pending
 */
async function getPendingList(req, res, next) {
  try {
    const userId = req.user.id;
    const type = parseInt(req.query.type) || 2; // 默认待收
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    const result = await TransactionModel.getPendingList(userId, type, { page, pageSize });

    return success(res, {
      list: result.list,
      pagination: {
        total: result.total,
        page,
        pageSize,
        totalPages: Math.ceil(result.total / pageSize)
      }
    }, '获取成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 获取首页数据
 * GET /api/transactions/home
 */
async function getHomeData(req, res, next) {
  try {
    const userId = req.user.id;
    const now = new Date();
    const year = parseInt(req.query.year) || now.getFullYear();
    const month = parseInt(req.query.month) || (now.getMonth() + 1);

    // 当月统计
    const yearMonth = `${year}-${String(month).padStart(2, '0')}`;
    const stats = await TransactionModel.getMonthlyStats(userId, yearMonth);

    // 本月支出最多的3个分类
    const topExpenseCategories = (stats.categoryStats || [])
      .filter(c => c.type === 1)
      .sort((a, b) => parseFloat(b.total_amount) - parseFloat(a.total_amount))
      .slice(0, 3)
      .map(c => ({
        category_id: c.category_id,
        category_name: c.category_name,
        category_icon: c.category_icon,
        category_color: c.category_color,
        total: c.total_amount,
        transaction_count: c.transaction_count
      }));

    // 最近3条记账记录
    const recentTransactions = await TransactionModel.getList(userId, {
      page: 1,
      pageSize: 3,
      startDate: `${yearMonth}-01`,
      endDate: `${yearMonth}-31`
    });

    return success(res, {
      year,
      month,
      yearMonth,
      totalIncome: stats.total_income || 0,
      totalExpense: stats.total_expense || 0,
      netProfit: stats.net_profit || 0,
      topExpenseCategories,
      recentTransactions: recentTransactions.list
    }, '获取成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 获取年度统计
 * GET /api/transactions/stats/yearly
 */
async function getYearlyStats(req, res, next) {
  try {
    const userId = req.user.id;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const stats = await TransactionModel.getYearlyStats(userId, year);

    // 按类型分组分类统计
    const expenseByCategory = (stats.categoryStats || [])
      .filter(c => c.type === 1)
      .map(c => ({
        category_id: c.category_id,
        category_name: c.category_name,
        category_icon: c.category_icon,
        category_color: c.category_color,
        total: c.total_amount
      }));

    const incomeByCategory = (stats.categoryStats || [])
      .filter(c => c.type === 2)
      .map(c => ({
        category_id: c.category_id,
        category_name: c.category_name,
        category_icon: c.category_icon,
        category_color: c.category_color,
        total: c.total_amount
      }));

    return success(res, {
      year,
      totalExpense: stats.total_expense || 0,
      totalIncome: stats.total_income || 0,
      netProfit: stats.net_profit || 0,
      expenseCount: stats.expense_count || 0,
      incomeCount: stats.income_count || 0,
      expenseByCategory,
      incomeByCategory
    }, '获取成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 获取年度月度趋势
 * GET /api/transactions/stats/yearly-monthly
 */
async function getYearlyMonthlyTrend(req, res, next) {
  try {
    const userId = req.user.id;
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const trend = await TransactionModel.getYearlyMonthlyTrend(userId, year);

    return success(res, {
      year,
      data: trend
    }, '获取成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 获取年度收支记录列表
 * GET /api/transactions/yearly-list
 */
async function getYearlyList(req, res, next) {
  try {
    const userId = req.user.id;
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 50;
    const type = req.query.type ? parseInt(req.query.type) : null;

    const result = await TransactionModel.getYearlyList(userId, year, { page, pageSize, type });

    return success(res, {
      year,
      list: result.list,
      pagination: {
        total: result.total,
        page,
        pageSize,
        totalPages: Math.ceil(result.total / pageSize)
      }
    }, '获取成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 收讫处理
 * POST /api/transactions/:id/settle
 */
async function settle(req, res, next) {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id);

    const transaction = await TransactionModel.settle(id, userId);
    if (!transaction) {
      return notFound(res, '记录不存在');
    }

    return success(res, transaction, '收讫成功');
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
  getMonthlyStats,
  getDailyTrend,
  getPendingList,
  settle,
  getHomeData,
  getYearlyStats,
  getYearlyMonthlyTrend,
  getYearlyList
};
