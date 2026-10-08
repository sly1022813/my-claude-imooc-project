/**
 * 轻记账 - 数据存储模块
 * 使用 localStorage 实现本地数据持久化
 */

// 存储键名
const STORAGE_KEYS = {
    USERS: 'light记账_users',
    CURRENT_USER: 'light记账_current_user',
    RECORDS: 'light记账_records_',
    CUSTOMERS: 'light记账_customers_',
    SUPPLIERS: 'light记账_suppliers_',
    CATEGORIES: 'light记账_categories_',
    SETTINGS: 'light记账_settings_'
};

// 默认支出分类
const DEFAULT_EXPENSE_CATEGORIES = [
    { id: 'expense_food', name: '餐饮', icon: '🍜', color: '#FF8FAB' },
    { id: 'expense_shopping', name: '购物', icon: '🛒', color: '#FFB3C6' },
    { id: 'expense_transport', name: '交通', icon: '🚗', color: '#7ED7C1' },
    { id: 'expense_entertainment', name: '娱乐', icon: '🎮', color: '#96CEB4' },
    { id: 'expense_housing', name: '居住', icon: '🏠', color: '#FFEAA7' },
    { id: 'expense_medical', name: '医疗', icon: '💊', color: '#DDA0DD' },
    { id: 'expense_education', name: '教育', icon: '📚', color: '#98D8C8' },
    { id: 'expense_communication', name: '通讯', icon: '📱', color: '#F7DC6F' },
    { id: 'expense_clothing', name: '服饰', icon: '👕', color: '#BB8FCE' },
    { id: 'expense_supplies', name: '进货成本', icon: '📦', color: '#85C1E9' },
    { id: 'expense_utilities', name: '房租水电', icon: '💡', color: '#82E0AA' },
    { id: 'expense_other', name: '其他', icon: '📌', color: '#BDC3C7' }
];

// 默认收入分类
const DEFAULT_INCOME_CATEGORIES = [
    { id: 'income_sales', name: '销售收入', icon: '💰', color: '#7ED7C1' },
    { id: 'income_service', name: '服务收入', icon: '🛠️', color: '#A8E6CF' },
    { id: 'income_other', name: '其他收入', icon: '💵', color: '#98D8C8' }
];

class Storage {
    constructor() {
        this.init();
    }

    // 初始化存储
    init() {
        // 确保用户表存在
        if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]));
        }
    }

    // 获取当前用户ID
    getCurrentUserId() {
        const currentUser = this.getCurrentUser();
        return currentUser ? currentUser.id : null;
    }

    // 获取用户专属的存储键
    getUserKey(baseKey) {
        const userId = this.getCurrentUserId();
        return userId ? `${baseKey}${userId}` : null;
    }

    // ========== 用户认证 ==========

    // 获取所有用户
    getUsers() {
        const data = localStorage.getItem(STORAGE_KEYS.USERS);
        return data ? JSON.parse(data) : [];
    }

    // 保存用户列表
    saveUsers(users) {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }

    // 注册用户
    register(username, password) {
        const users = this.getUsers();

        // 检查用户名是否已存在
        if (users.some(u => u.username === username)) {
            return { success: false, message: '用户名已存在' };
        }

        // 验证用户名
        if (username.length < 2 || username.length > 20) {
            return { success: false, message: '用户名需要2-20个字符' };
        }

        // 验证密码
        if (password.length < 6 || password.length > 20) {
            return { success: false, message: '密码需要6-20个字符' };
        }

        // 创建用户
        const user = {
            id: Date.now().toString(),
            username: username,
            password: this.hashPassword(password), // 简单哈希
            createdAt: new Date().toISOString()
        };

        users.push(user);
        this.saveUsers(users);

        // 自动登录
        this.loginUser(user);

        return { success: true, message: '注册成功' };
    }

    // 简单密码哈希
    hashPassword(password) {
        // 简单的哈希，实际项目中应使用更安全的方式
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(16);
    }

    // 用户登录
    login(username, password) {
        const users = this.getUsers();
        const hashedPassword = this.hashPassword(password);

        const user = users.find(u =>
            u.username === username && u.password === hashedPassword
        );

        if (user) {
            this.loginUser(user);
            return { success: true, message: '登录成功' };
        }

        return { success: false, message: '用户名或密码错误' };
    }

    // 设置当前登录用户
    loginUser(user) {
        // 不保存密码到本地存储
        const safeUser = {
            id: user.id,
            username: user.username,
            createdAt: user.createdAt
        };
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));

        // 确保该用户的数据存储键存在
        this.ensureUserData(user.id);
    }

    // 获取当前登录用户
    getCurrentUser() {
        const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        return data ? JSON.parse(data) : null;
    }

    // 检查是否已登录
    isLoggedIn() {
        return this.getCurrentUser() !== null;
    }

    // 退出登录
    logout() {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }

    // 确保用户数据存储键存在
    ensureUserData(userId) {
        const categoriesKey = `${STORAGE_KEYS.CATEGORIES}${userId}`;
        const settingsKey = `${STORAGE_KEYS.SETTINGS}${userId}`;

        if (!localStorage.getItem(categoriesKey)) {
            localStorage.setItem(categoriesKey, JSON.stringify([...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES]));
        }
        if (!localStorage.getItem(settingsKey)) {
            localStorage.setItem(settingsKey, JSON.stringify({
                userName: '轻记账用户',
                createdAt: new Date().toISOString()
            }));
        }
    }

    // ========== 记录操作 ==========

    getRecords() {
        const key = this.getUserKey(STORAGE_KEYS.RECORDS);
        if (!key) return [];
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }

    saveRecords(records) {
        const key = this.getUserKey(STORAGE_KEYS.RECORDS);
        if (!key) return;
        localStorage.setItem(key, JSON.stringify(records));
    }

    addRecord(record) {
        const records = this.getRecords();
        record.id = Date.now().toString();
        record.createdAt = new Date().toISOString();
        records.unshift(record);
        this.saveRecords(records);
        return record;
    }

    updateRecord(id, updates) {
        const records = this.getRecords();
        const index = records.findIndex(r => r.id === id);
        if (index !== -1) {
            records[index] = { ...records[index], ...updates, updatedAt: new Date().toISOString() };
            this.saveRecords(records);
            return records[index];
        }
        return null;
    }

    deleteRecord(id) {
        const records = this.getRecords();
        const filtered = records.filter(r => r.id !== id);
        this.saveRecords(filtered);
        return filtered;
    }

    getRecordsByMonth(year, month) {
        const records = this.getRecords();
        return records.filter(r => {
            const date = new Date(r.date);
            return date.getFullYear() === year && date.getMonth() === month;
        });
    }

    getRecordsByDate(dateStr) {
        const records = this.getRecords();
        return records.filter(r => r.date === dateStr);
    }

    // ========== 客户操作 ==========

    getCustomers() {
        const key = this.getUserKey(STORAGE_KEYS.CUSTOMERS);
        if (!key) return [];
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }

    saveCustomers(customers) {
        const key = this.getUserKey(STORAGE_KEYS.CUSTOMERS);
        if (!key) return;
        localStorage.setItem(key, JSON.stringify(customers));
    }

    addCustomer(customer) {
        const customers = this.getCustomers();
        customer.id = Date.now().toString();
        customer.createdAt = new Date().toISOString();
        customer.totalPaid = 0;
        customer.totalDebt = 0;
        customers.push(customer);
        this.saveCustomers(customers);
        return customer;
    }

    updateCustomer(id, updates) {
        const customers = this.getCustomers();
        const index = customers.findIndex(c => c.id === id);
        if (index !== -1) {
            customers[index] = { ...customers[index], ...updates };
            this.saveCustomers(customers);
            return customers[index];
        }
        return null;
    }

    deleteCustomer(id) {
        const customers = this.getCustomers();
        const filtered = customers.filter(c => c.id !== id);
        this.saveCustomers(filtered);
        return filtered;
    }

    // ========== 供应商操作 ==========

    getSuppliers() {
        const key = this.getUserKey(STORAGE_KEYS.SUPPLIERS);
        if (!key) return [];
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }

    saveSuppliers(suppliers) {
        const key = this.getUserKey(STORAGE_KEYS.SUPPLIERS);
        if (!key) return;
        localStorage.setItem(key, JSON.stringify(suppliers));
    }

    addSupplier(supplier) {
        const suppliers = this.getSuppliers();
        supplier.id = Date.now().toString();
        supplier.createdAt = new Date().toISOString();
        supplier.totalPurchase = 0;
        suppliers.push(supplier);
        this.saveSuppliers(suppliers);
        return supplier;
    }

    updateSupplier(id, updates) {
        const suppliers = this.getSuppliers();
        const index = suppliers.findIndex(s => s.id === id);
        if (index !== -1) {
            suppliers[index] = { ...suppliers[index], ...updates };
            this.saveSuppliers(suppliers);
            return suppliers[index];
        }
        return null;
    }

    deleteSupplier(id) {
        const suppliers = this.getSuppliers();
        const filtered = suppliers.filter(s => s.id !== id);
        this.saveSuppliers(filtered);
        return filtered;
    }

    // ========== 分类操作 ==========

    getCategories() {
        const key = this.getUserKey(STORAGE_KEYS.CATEGORIES);
        if (!key) return [...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES];
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES];
    }

    getExpenseCategories() {
        return this.getCategories().filter(c => c.id.startsWith('expense_'));
    }

    getIncomeCategories() {
        return this.getCategories().filter(c => c.id.startsWith('income_'));
    }

    saveCategories(categories) {
        const key = this.getUserKey(STORAGE_KEYS.CATEGORIES);
        if (!key) return;
        localStorage.setItem(key, JSON.stringify(categories));
    }

    // ========== 设置操作 ==========

    getSettings() {
        const key = this.getUserKey(STORAGE_KEYS.SETTINGS);
        if (!key) return { userName: '轻记账用户' };
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : { userName: '轻记账用户' };
    }

    saveSettings(settings) {
        const key = this.getUserKey(STORAGE_KEYS.SETTINGS);
        if (!key) return;
        localStorage.setItem(key, JSON.stringify(settings));
    }

    updateSettings(updates) {
        const settings = this.getSettings();
        const updated = { ...settings, ...updates };
        this.saveSettings(updated);
        return updated;
    }

    // ========== 数据统计 ==========

    getMonthStats(year, month) {
        const records = this.getRecordsByMonth(year, month);
        let income = 0;
        let expense = 0;

        records.forEach(r => {
            const amount = parseFloat(r.amount);
            if (r.type === 'income') {
                income += amount;
            } else {
                expense += amount;
            }
        });

        return {
            income,
            expense,
            profit: income - expense,
            count: records.length
        };
    }

    getCategoryStats(year, month) {
        const records = this.getRecordsByMonth(year, month);
        const categories = this.getCategories();
        const stats = {};

        records.forEach(r => {
            if (!stats[r.categoryId]) {
                const category = categories.find(c => c.id === r.categoryId);
                stats[r.categoryId] = {
                    id: r.categoryId,
                    name: category ? category.name : r.categoryName,
                    icon: category ? category.icon : '📌',
                    amount: 0,
                    count: 0
                };
            }
            stats[r.categoryId].amount += parseFloat(r.amount);
            stats[r.categoryId].count++;
        });

        return Object.values(stats).sort((a, b) => b.amount - a.amount);
    }

    // ========== 数据导入导出 ==========

    exportAllData() {
        return {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            records: this.getRecords(),
            customers: this.getCustomers(),
            suppliers: this.getSuppliers(),
            categories: this.getCategories(),
            settings: this.getSettings()
        };
    }

    importData(data) {
        if (data.records) this.saveRecords(data.records);
        if (data.customers) this.saveCustomers(data.customers);
        if (data.suppliers) this.saveSuppliers(data.suppliers);
        if (data.categories) this.saveCategories(data.categories);
        if (data.settings) this.saveSettings(data.settings);
    }

    // 获取记账天数
    getRecordDays() {
        const records = this.getRecords();
        if (records.length === 0) return 0;

        const dates = new Set(records.map(r => r.date));
        return dates.size;
    }
}

// 创建全局实例
const storage = new Storage();