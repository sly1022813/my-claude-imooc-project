/**
 * 业务模块路由验证规则
 */
const { body, param, query } = require('express-validator');

// ============ 分类验证规则 ============

const createCategoryRules = [
  body('type')
    .notEmpty()
    .withMessage('分类类型不能为空')
    .isInt({ min: 1, max: 2 })
    .withMessage('分类类型需为1(支出)或2(收入)'),

  body('name')
    .notEmpty()
    .withMessage('分类名称不能为空')
    .isLength({ max: 50 })
    .withMessage('分类名称最多50个字符'),

  body('icon')
    .optional()
    .isLength({ max: 50 })
    .withMessage('图标最多50个字符'),

  body('color')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('颜色值格式错误')
];

const updateCategoryRules = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('分类ID无效'),

  body('name')
    .optional()
    .isLength({ max: 50 })
    .withMessage('分类名称最多50个字符'),

  body('icon')
    .optional()
    .isLength({ max: 50 })
    .withMessage('图标最多50个字符'),

  body('color')
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('颜色值格式错误'),

  body('sortOrder')
    .optional()
    .isInt({ min: 0 })
    .withMessage('排序值需为非负整数'),

  body('status')
    .optional()
    .isInt({ min: 0, max: 1 })
    .withMessage('状态值需为0或1')
];

// ============ 收支记录验证规则 ============

const createTransactionRules = [
  body('type')
    .notEmpty()
    .withMessage('记录类型不能为空')
    .isInt({ min: 1, max: 2 })
    .withMessage('记录类型需为1(支出)或2(收入)'),

  body('amount')
    .notEmpty()
    .withMessage('金额不能为空')
    .isFloat({ min: 0.01, max: 999999999.99 })
    .withMessage('金额需在0.01-999999999.99之间'),

  body('categoryId')
    .notEmpty()
    .withMessage('分类不能为空')
    .isInt({ min: 1 })
    .withMessage('分类ID无效'),

  body('date')
    .optional()
    .isDate()
    .withMessage('日期格式错误'),

  body('time')
    .optional()
    .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
    .withMessage('时间格式错误'),

  body('paymentMethod')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('支付方式需为1-5'),

  body('counterpartyType')
    .optional()
    .isInt({ min: 1, max: 3 })
    .withMessage('对方类型需为1-3'),

  body('counterpartyId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('对方ID无效'),

  body('status')
    .optional()
    .isInt({ min: 1, max: 2 })
    .withMessage('状态需为1(已收付)或2(待收付)'),

  body('remark')
    .optional()
    .isLength({ max: 500 })
    .withMessage('备注最多500个字符')
];

const updateTransactionRules = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('记录ID无效'),

  body('amount')
    .optional()
    .isFloat({ min: 0.01, max: 999999999.99 })
    .withMessage('金额需在0.01-999999999.99之间'),

  body('categoryId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('分类ID无效'),

  body('date')
    .optional()
    .isDate()
    .withMessage('日期格式错误'),

  body('paymentMethod')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('支付方式需为1-5'),

  body('counterpartyType')
    .optional()
    .isInt({ min: 1, max: 3 })
    .withMessage('对方类型需为1-3'),

  body('counterpartyId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('对方ID无效'),

  body('status')
    .optional()
    .isInt({ min: 1, max: 2 })
    .withMessage('状态需为1(已收付)或2(待收付)'),

  body('remark')
    .optional()
    .isLength({ max: 500 })
    .withMessage('备注最多500个字符')
];

// ============ 客户验证规则 ============

const createCustomerRules = [
  body('name')
    .notEmpty()
    .withMessage('客户名称不能为空')
    .isLength({ max: 100 })
    .withMessage('客户名称最多100个字符'),

  body('phone')
    .optional()
    .matches(/^1[3-9]\d{9}$/)
    .withMessage('手机号格式不正确'),

  body('address')
    .optional()
    .isLength({ max: 500 })
    .withMessage('地址最多500个字符'),

  body('customerType')
    .optional()
    .isInt({ min: 1, max: 2 })
    .withMessage('客户类型需为1(个人)或2(企业)'),

  body('creditLimit')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('信用额度需为非负数'),

  body('remark')
    .optional()
    .isLength({ max: 500 })
    .withMessage('备注最多500个字符')
];

const updateCustomerRules = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('客户ID无效'),

  body('name')
    .optional()
    .isLength({ max: 100 })
    .withMessage('客户名称最多100个字符'),

  body('phone')
    .optional()
    .matches(/^1[3-9]\d{9}$/)
    .withMessage('手机号格式不正确'),

  body('address')
    .optional()
    .isLength({ max: 500 })
    .withMessage('地址最多500个字符'),

  body('customerType')
    .optional()
    .isInt({ min: 1, max: 2 })
    .withMessage('客户类型需为1(个人)或2(企业)'),

  body('creditLimit')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('信用额度需为非负数'),

  body('remark')
    .optional()
    .isLength({ max: 500 })
    .withMessage('备注最多500个字符'),

  body('status')
    .optional()
    .isInt({ min: 0, max: 1 })
    .withMessage('状态需为0(禁用)或1(正常)')
];

// ============ 供应商验证规则 ============

const createSupplierRules = [
  body('name')
    .notEmpty()
    .withMessage('供应商名称不能为空')
    .isLength({ max: 100 })
    .withMessage('供应商名称最多100个字符'),

  body('phone')
    .optional()
    .matches(/^1[3-9]\d{9}$/)
    .withMessage('手机号格式不正确'),

  body('address')
    .optional()
    .isLength({ max: 500 })
    .withMessage('地址最多500个字符'),

  body('contactPerson')
    .optional()
    .isLength({ max: 50 })
    .withMessage('联系人姓名最多50个字符'),

  body('products')
    .optional()
    .isLength({ max: 500 })
    .withMessage('主营商品最多500个字符'),

  body('settlementType')
    .optional()
    .isInt({ min: 1, max: 3 })
    .withMessage('结算方式需为1(即时)、2(月结)或3(季结)'),

  body('remark')
    .optional()
    .isLength({ max: 500 })
    .withMessage('备注最多500个字符')
];

const updateSupplierRules = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('供应商ID无效'),

  body('name')
    .optional()
    .isLength({ max: 100 })
    .withMessage('供应商名称最多100个字符'),

  body('phone')
    .optional()
    .matches(/^1[3-9]\d{9}$/)
    .withMessage('手机号格式不正确'),

  body('address')
    .optional()
    .isLength({ max: 500 })
    .withMessage('地址最多500个字符'),

  body('contactPerson')
    .optional()
    .isLength({ max: 50 })
    .withMessage('联系人姓名最多50个字符'),

  body('products')
    .optional()
    .isLength({ max: 500 })
    .withMessage('主营商品最多500个字符'),

  body('settlementType')
    .optional()
    .isInt({ min: 1, max: 3 })
    .withMessage('结算方式需为1(即时)、2(月结)或3(季结)'),

  body('remark')
    .optional()
    .isLength({ max: 500 })
    .withMessage('备注最多500个字符'),

  body('status')
    .optional()
    .isInt({ min: 0, max: 1 })
    .withMessage('状态需为0(禁用)或1(正常)')
];

module.exports = {
  // 分类
  createCategoryRules,
  updateCategoryRules,
  // 收支记录
  createTransactionRules,
  updateTransactionRules,
  // 客户
  createCustomerRules,
  updateCustomerRules,
  // 供应商
  createSupplierRules,
  updateSupplierRules
};
