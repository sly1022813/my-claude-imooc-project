/**
 * 轻记账 - API 模块
 * 与后端服务通信
 */

const API_BASE = 'http://localhost:3000/api';

// 获取 token
function getToken() {
    return localStorage.getItem('token');
}

// API 请求封装
async function apiRequest(url, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE}${url}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                // Token 过期，跳转登录
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'login.html';
            }
            throw new Error(data.message || '请求失败');
        }

        return data;
    } catch (err) {
        console.error('API 请求失败:', err);
        throw err;
    }
}

// ========== 认证相关 ==========

const AuthAPI = {
    async login(username, password) {
        return await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    },

    async register(data) {
        return await apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async getCurrentUser() {
        return await apiRequest('/auth/me');
    },

    async checkUsername(username) {
        return await apiRequest(`/auth/check-username?username=${encodeURIComponent(username)}`);
    }
};

// ========== 收支记录相关 ==========

const TransactionAPI = {
    // 获取列表（支持分页）
    async getList(params = {}) {
        const query = new URLSearchParams();
        if (params.page) query.set('page', params.page);
        if (params.pageSize) query.set('pageSize', params.pageSize);
        if (params.type) query.set('type', params.type);
        if (params.startDate) query.set('startDate', params.startDate);
        if (params.endDate) query.set('endDate', params.endDate);
        if (params.keyword) query.set('keyword', params.keyword);

        return await apiRequest(`/transactions?${query.toString()}`);
    },

    // 获取单条记录
    async getById(id) {
        return await apiRequest(`/transactions/${id}`);
    },

    // 创建记录
    async create(data) {
        return await apiRequest('/transactions', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // 更新记录
    async update(id, data) {
        return await apiRequest(`/transactions/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    // 删除记录
    async delete(id) {
        return await apiRequest(`/transactions/${id}`, {
            method: 'DELETE'
        });
    },

    // 获取首页数据
    async getHomeData(year, month) {
        const query = year && month ? `?year=${year}&month=${month}` : '';
        return await apiRequest(`/transactions/home${query}`);
    },

    // 获取月度统计
    async getMonthlyStats(yearMonth) {
        return await apiRequest(`/transactions/stats/monthly?yearMonth=${yearMonth}`);
    },

    // 获取年度统计
    async getYearlyStats(year) {
        return await apiRequest(`/transactions/stats/yearly?year=${year}`);
    },

    // 获取年度月度趋势
    async getYearlyMonthlyTrend(year) {
        return await apiRequest(`/transactions/stats/yearly-monthly?year=${year}`);
    },

    // 获取年度记录列表（按月份）
    async getYearlyList(year, page = 1, pageSize = 20, type = null) {
        let query = `?year=${year}&page=${page}&pageSize=${pageSize}`;
        if (type) query += `&type=${type}`;
        return await apiRequest(`/transactions/yearly-list${query}`);
    },

    // 获取待收/待付列表
    async getPending(type = 2) {
        return await apiRequest(`/transactions/pending?type=${type}`);
    },

    // 收讫处理
    async settle(id) {
        return await apiRequest(`/transactions/${id}/settle`, {
            method: 'POST'
        });
    }
};

// ========== 分类相关 ==========

const CategoryAPI = {
    async getList(type = null) {
        const query = type ? `?type=${type}` : '';
        return await apiRequest(`/categories${query}`);
    },

    async getById(id) {
        return await apiRequest(`/categories/${id}`);
    },

    async create(data) {
        return await apiRequest('/categories', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async update(id, data) {
        return await apiRequest(`/categories/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async delete(id) {
        return await apiRequest(`/categories/${id}`, {
            method: 'DELETE'
        });
    }
};

// ========== 账户相关 ==========

const AccountAPI = {
    async getProfile() {
        return await apiRequest('/accounts/profile');
    },

    async updateProfile(data) {
        return await apiRequest('/accounts/profile', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async changePassword(oldPassword, newPassword) {
        return await apiRequest('/accounts/password', {
            method: 'PUT',
            body: JSON.stringify({ oldPassword, newPassword })
        });
    },

    async uploadAvatar(file) {
        const formData = new FormData();
        formData.append('avatar', file);

        const token = getToken();
        const response = await fetch(`${API_BASE}/accounts/avatar`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        return await response.json();
    },

    async getAccounts() {
        return await apiRequest('/accounts');
    },

    async createAccount(data) {
        return await apiRequest('/accounts', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async updateAccount(id, data) {
        return await apiRequest(`/accounts/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async deleteAccount(id) {
        return await apiRequest(`/accounts/${id}`, {
            method: 'DELETE'
        });
    }
};

// ========== 客户相关 ==========

const CustomerAPI = {
    async getList(params = {}) {
        const query = new URLSearchParams();
        if (params.page) query.set('page', params.page);
        if (params.pageSize) query.set('pageSize', params.pageSize);
        if (params.keyword) query.set('keyword', params.keyword);

        return await apiRequest(`/customers?${query.toString()}`);
    },

    async getById(id) {
        return await apiRequest(`/customers/${id}`);
    },

    async create(data) {
        return await apiRequest('/customers', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async update(id, data) {
        return await apiRequest(`/customers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async delete(id) {
        return await apiRequest(`/customers/${id}`, {
            method: 'DELETE'
        });
    }
};

// ========== 供应商相关 ==========

const SupplierAPI = {
    async getList(params = {}) {
        const query = new URLSearchParams();
        if (params.page) query.set('page', params.page);
        if (params.pageSize) query.set('pageSize', params.pageSize);
        if (params.keyword) query.set('keyword', params.keyword);

        return await apiRequest(`/suppliers?${query.toString()}`);
    },

    async getById(id) {
        return await apiRequest(`/suppliers/${id}`);
    },

    async create(data) {
        return await apiRequest('/suppliers', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    async update(id, data) {
        return await apiRequest(`/suppliers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async delete(id) {
        return await apiRequest(`/suppliers/${id}`, {
            method: 'DELETE'
        });
    }
};

// 导出所有 API
window.API = {
    Auth: AuthAPI,
    Transaction: TransactionAPI,
    Category: CategoryAPI,
    Account: AccountAPI,
    Customer: CustomerAPI,
    Supplier: SupplierAPI,
    baseUrl: API_BASE
};
