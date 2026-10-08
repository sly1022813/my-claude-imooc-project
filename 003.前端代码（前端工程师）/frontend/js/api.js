/**
 * API 配置和请求工具
 * 轻记账前端 API 调用模块
 */

const API_BASE_URL = 'http://localhost:3000';

// Token 存储键
const TOKEN_KEY = 'light_accounting_token';
const USER_KEY = 'light_accounting_user';

/**
 * API 请求封装
 * @param {string} endpoint - API端点
 * @param {Object} options - 请求选项
 * @returns {Promise<Object>} 响应数据
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  // 获取Token
  const token = localStorage.getItem(TOKEN_KEY);

  const defaultHeaders = {
    'Content-Type': 'application/json'
  };

  // 如果有Token，添加到请求头
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    // 如果是401未授权，清除登录状态
    if (response.status === 401) {
      clearAuth();
      window.location.href = 'login.html';
      throw new Error('登录已过期，请重新登录');
    }

    // 如果业务代码表示失败，抛出错误
    if (data.code !== 0) {
      throw new Error(data.message || '请求失败');
    }

    return data;
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
}

/**
 * GET 请求
 */
function get(endpoint, params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${endpoint}?${queryString}` : endpoint;
  return request(url, { method: 'GET' });
}

/**
 * POST 请求
 */
function post(endpoint, data = {}) {
  return request(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * PUT 请求
 */
function put(endpoint, data = {}) {
  return request(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

/**
 * DELETE 请求
 */
function del(endpoint) {
  return request(endpoint, { method: 'DELETE' });
}

// ============ 认证 API ============

const AuthAPI = {
  // 用户注册
  register: (data) => post('/api/auth/register', data),

  // 用户登录
  login: (data) => post('/api/auth/login', data),

  // 检查用户名
  checkUsername: (username) => get('/api/auth/check-username', { username }),

  // 获取当前用户
  getCurrentUser: () => get('/api/auth/me'),

  // 修改密码
  changePassword: (data) => post('/api/auth/change-password', data)
};

// ============ 分类 API ============

const CategoryAPI = {
  // 获取分类列表
  getList: (type) => get('/api/categories', type ? { type } : {}),

  // 获取分类详情
  getById: (id) => get(`/api/categories/${id}`),

  // 创建分类
  create: (data) => post('/api/categories', data),

  // 更新分类
  update: (id, data) => put(`/api/categories/${id}`, data),

  // 删除分类
  delete: (id) => del(`/api/categories/${id}`)
};

// ============ 收支记录 API ============

const TransactionAPI = {
  // 获取列表
  getList: (params) => get('/api/transactions', params),

  // 获取详情
  getById: (id) => get(`/api/transactions/${id}`),

  // 创建记录
  create: (data) => post('/api/transactions', data),

  // 更新记录
  update: (id, data) => put(`/api/transactions/${id}`, data),

  // 删除记录
  delete: (id) => del(`/api/transactions/${id}`),

  // 月度统计
  getMonthlyStats: (yearMonth) => get('/api/transactions/stats/monthly', { yearMonth }),

  // 每日趋势
  getDailyTrend: (days) => get('/api/transactions/stats/daily-trend', { days }),

  // 待收/待付列表
  getPending: (type) => get('/api/transactions/pending', { type }),

  // 收讫处理
  settle: (id) => post(`/api/transactions/${id}/settle`),

  // 首页数据
  getHomeData: (year, month) => get('/api/transactions/home', { year, month }),

  // 年度统计
  getYearlyStats: (year) => get('/api/transactions/stats/yearly', { year }),

  // 年度月度趋势
  getYearlyMonthlyTrend: (year) => get('/api/transactions/stats/yearly-monthly', { year }),

  // 年度收支记录列表
  getYearlyList: (year, params) => get('/api/transactions/yearly-list', { year, ...params })
};

// ============ 客户 API ============

const CustomerAPI = {
  // 获取列表
  getList: (params) => get('/api/customers', params),

  // 获取详情
  getById: (id) => get(`/api/customers/${id}`),

  // 获取交易明细
  getTransactions: (id, params) => get(`/api/customers/${id}/transactions`, params),

  // 创建客户
  create: (data) => post('/api/customers', data),

  // 更新客户
  update: (id, data) => put(`/api/customers/${id}`, data),

  // 删除客户
  delete: (id) => del(`/api/customers/${id}`)
};

// ============ 供应商 API ============

const SupplierAPI = {
  // 获取列表
  getList: (params) => get('/api/suppliers', params),

  // 获取详情
  getById: (id) => get(`/api/suppliers/${id}`),

  // 获取交易明细
  getTransactions: (id, params) => get(`/api/suppliers/${id}/transactions`, params),

  // 创建供应商
  create: (data) => post('/api/suppliers', data),

  // 更新供应商
  update: (id, data) => put(`/api/suppliers/${id}`, data),

  // 删除供应商
  delete: (id) => del(`/api/suppliers/${id}`)
};

// ============ 认证状态管理 ============

/**
 * 保存认证信息
 */
function saveAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * 获取当前用户
 */
function getCurrentUser() {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

/**
 * 获取Token
 */
function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * 检查是否已登录
 */
function isLoggedIn() {
  return !!getToken();
}

/**
 * 清除认证信息
 */
function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * 跳转到登录页（如果未登录）
 */
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

// 导出API
window.API = {
  Auth: AuthAPI,
  Category: CategoryAPI,
  Transaction: TransactionAPI,
  Customer: CustomerAPI,
  Supplier: SupplierAPI,
  isLoggedIn,
  getCurrentUser,
  getToken,
  saveAuth,
  clearAuth,
  requireAuth
};
