/**
 * 统一响应格式工具
 */

/**
 * 成功响应
 * @param {Object} res - Express响应对象
 * @param {Object} data - 响应数据
 * @param {string} message - 成功消息
 * @param {number} code - 状态码，默认200
 */
function success(res, data = null, message = '操作成功', code = 200) {
  res.status(code).json({
    code: 0,
    success: true,
    message,
    data
  });
}

/**
 * 分页响应
 * @param {Object} res - Express响应对象
 * @param {Object} result - 分页结果 { list, total, page, pageSize }
 * @param {string} message - 成功消息
 */
function paginate(res, result, message = '查询成功') {
  res.status(200).json({
    code: 0,
    success: true,
    message,
    data: {
      list: result.list || [],
      pagination: {
        total: result.total || 0,
        page: result.page || 1,
        pageSize: result.pageSize || 10,
        totalPages: Math.ceil((result.total || 0) / (result.pageSize || 10))
      }
    }
  });
}

/**
 * 错误响应
 * @param {Object} res - Express响应对象
 * @param {string} message - 错误消息
 * @param {number} code - HTTP状态码
 * @param {number} businessCode - 业务状态码
 */
function error(res, message = '操作失败', code = 500, businessCode = -1) {
  res.status(code).json({
    code: businessCode,
    success: false,
    message
  });
}

/**
 * 业务错误响应
 * @param {Object} res - Express响应对象
 * @param {string} message - 错误消息
 * @param {number} businessCode - 业务状态码
 */
function businessError(res, message = '业务处理失败', businessCode = 400) {
  res.status(200).json({
    code: businessCode,
    success: false,
    message
  });
}

/**
 * 未授权响应
 * @param {Object} res - Express响应对象
 * @param {string} message - 错误消息
 */
function unauthorized(res, message = '未授权，请登录') {
  res.status(401).json({
    code: 401,
    success: false,
    message
  });
}

/**
 * 禁止访问响应
 * @param {Object} res - Express响应对象
 * @param {string} message - 错误消息
 */
function forbidden(res, message = '禁止访问') {
  res.status(403).json({
    code: 403,
    success: false,
    message
  });
}

/**
 * 资源不存在响应
 * @param {Object} res - Express响应对象
 * @param {string} message - 错误消息
 */
function notFound(res, message = '资源不存在') {
  res.status(404).json({
    code: 404,
    success: false,
    message
  });
}

/**
 * 参数验证失败响应
 * @param {Object} res - Express响应对象
 * @param {string} message - 错误消息
 * @param {Array} errors - 验证错误详情
 */
function validationError(res, message = '参数验证失败', errors = []) {
  res.status(200).json({
    code: 422,
    success: false,
    message,
    errors
  });
}

module.exports = {
  success,
  paginate,
  error,
  businessError,
  unauthorized,
  forbidden,
  notFound,
  validationError
};
