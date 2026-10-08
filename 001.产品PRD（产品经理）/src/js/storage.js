/**
 * 轻记账 - 数据存储模块
 * 使用 localStorage 实现本地数据持久化
 */

const STORAGE_KEYS = {
    RECORDS: 'light记账_records',
    CUSTOMERS: 'light记账_customers',
    SUPPLIERS: 'light记账_suppliers',
    CATEGORIES: 'light记账_categories',
    SETTINGS: 'light记账_settings'
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
        if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
            this.saveCategories([...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES]);
        }
        if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
            this.saveSettings({
                userName: '轻记账用户',
                createdAt: new Date().toISOString()
            });
        }
    }

    // ========== 记录操作 ==========

    getRecords() {
        const data = localStorage.getItem(STORAGE_KEYS.RECORDS);
        return data ? JSON.parse(data) : [];
    }

    saveRecords(records) {
        localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
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
        const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
        return data ? JSON.parse(data) : [];
    }

    saveCustomers(customers) {
        localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
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
        const data = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
        return data ? JSON.parse(data) : [];
    }

    saveSuppliers(suppliers) {
        localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
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
        const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
        return data ? JSON.parse(data) : [...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES];
    }

    getExpenseCategories() {
        return this.getCategories().filter(c => c.id.startsWith('expense_'));
    }

    getIncomeCategories() {
        return this.getCategories().filter(c => c.id.startsWith('income_'));
    }

    saveCategories(categories) {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    }

    // ========== 设置操作 ==========

    getSettings() {
        const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        return data ? JSON.parse(data) : { userName: '轻记账用户' };
    }

    saveSettings(settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
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

    clearAllData() {
        Object.values(STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        this.init();
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