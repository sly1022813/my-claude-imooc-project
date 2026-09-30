/**
 * 轻记账 - 本地存储管理
 */

const Storage = {
  // Storage Keys
  KEYS: {
    USER: 'light_account_user',
    RECORDS: 'light_account_records',
    CUSTOMERS: 'light_account_customers',
    SUPPLIERS: 'light_account_suppliers',
    CATEGORIES: 'light_account_categories',
    SETTINGS: 'light_account_settings',
    LAST_LOGIN: 'light_account_last_login'
  },

  // 默认支出分类
  DEFAULT_EXPENSE_CATEGORIES: [
    { id: 'exp_1', name: '进货成本', icon: '📦' },
    { id: 'exp_2', name: '餐饮成本', icon: '🍜' },
    { id: 'exp_3', name: '房租水电', icon: '💡' },
    { id: 'exp_4', name: '员工工资', icon: '💼' },
    { id: 'exp_5', name: '运营费用', icon: '📊' },
    { id: 'exp_6', name: '交通物流', icon: '🚚' },
    { id: 'exp_7', name: '办公用品', icon: '📎' },
    { id: 'exp_8', name: '税费支出', icon: '🧾' },
    { id: 'exp_9', name: '社交应酬', icon: '☕' },
    { id: 'exp_10', name: '其他支出', icon: '✨' }
  ],

  // 默认收入分类
  DEFAULT_INCOME_CATEGORIES: [
    { id: 'inc_1', name: '销售收入', icon: '💰' },
    { id: 'inc_2', name: '服务收入', icon: '🛒' },
    { id: 'inc_3', name: '其他收入', icon: '🎁' }
  ],

  // 默认设置
  DEFAULT_SETTINGS: {
    currency: '¥',
    defaultPaymentMethod: 'wechat',
    autoGenerateId: true,
    dailyReminder: true,
    reminderTime: '22:30',
    theme: 'light'
  },

  /**
   * 初始化存储 (如果不存在则创建)
   */
  init() {
    if (!localStorage.getItem(this.KEYS.CATEGORIES)) {
      this.setCategories({
        expense: this.DEFAULT_EXPENSE_CATEGORIES,
        income: this.DEFAULT_INCOME_CATEGORIES
      });
    }
    if (!localStorage.getItem(this.KEYS.SETTINGS)) {
      this.setSettings(this.DEFAULT_SETTINGS);
    }
    if (!localStorage.getItem(this.KEYS.RECORDS)) {
      this.setRecords([]);
    }
    if (!localStorage.getItem(this.KEYS.CUSTOMERS)) {
      this.setCustomers([]);
    }
    if (!localStorage.getItem(this.KEYS.SUPPLIERS)) {
      this.setSuppliers([]);
    }
  },

  // ============ 用户管理 ============

  /**
   * 获取当前登录用户
   */
  getUser() {
    return Utils.storage.get(this.KEYS.USER, null);
  },

  /**
   * 设置当前用户
   */
  setUser(user) {
    return Utils.storage.set(this.KEYS.USER, user);
  },

  /**
   * 清除当前用户 (登出)
   */
  clearUser() {
    return Utils.storage.remove(this.KEYS.USER);
  },

  /**
   * 检查是否已登录
   */
  isLoggedIn() {
    return this.getUser() !== null;
  },

  /**
   * 用户注册
   */
  register(username, password, userType = 'personal') {
    // 检查用户名是否已存在
    const users = this.getAllUsers();
    if (users.find(u => u.username === username)) {
      return { success: false, message: '用户名已存在' };
    }

    const newUser = {
      id: Utils.generateId(),
      username,
      passwordHash: Utils.simpleHash(password),
      userType,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    users.push(newUser);
    Utils.storage.set(this.KEYS.LAST_LOGIN, users);

    // 设置当前用户
    this.setUser({
      id: newUser.id,
      username: newUser.username,
      userType: newUser.userType
    });

    return { success: true, message: '注册成功' };
  },

  /**
   * 用户登录
   */
  login(username, password) {
    const users = Utils.storage.get(this.KEYS.LAST_LOGIN, []);
    const user = users.find(u => u.username === username);

    if (!user) {
      return { success: false, message: '用户不存在' };
    }

    if (user.passwordHash !== Utils.simpleHash(password)) {
      return { success: false, message: '密码错误' };
    }

    // 更新最后登录时间
    user.lastLogin = new Date().toISOString();
    Utils.storage.set(this.KEYS.LAST_LOGIN, users);

    // 设置当前用户
    this.setUser({
      id: user.id,
      username: user.username,
      userType: user.userType
    });

    return { success: true, message: '登录成功' };
  },

  /**
   * 获取所有用户
   */
  getAllUsers() {
    return Utils.storage.get(this.KEYS.LAST_LOGIN, []);
  },

  /**
   * 修改密码
   */
  changePassword(oldPassword, newPassword) {
    const user = this.getUser();
    if (!user) {
      return { success: false, message: '请先登录' };
    }

    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === user.id);

    if (userIndex === -1) {
      return { success: false, message: '用户不存在' };
    }

    if (users[userIndex].passwordHash !== Utils.simpleHash(oldPassword)) {
      return { success: false, message: '原密码错误' };
    }

    users[userIndex].passwordHash = Utils.simpleHash(newPassword);
    Utils.storage.set(this.KEYS.LAST_LOGIN, users);

    return { success: true, message: '密码修改成功' };
  },

  // ============ 记录管理 ============

  /**
   * 获取所有记录
   */
  getRecords() {
    return Utils.storage.get(this.KEYS.RECORDS, []);
  },

  /**
   * 设置记录
   */
  setRecords(records) {
    return Utils.storage.set(this.KEYS.RECORDS, records);
  },

  /**
   * 添加记录
   */
  addRecord(record) {
    const records = this.getRecords();
    const newRecord = {
      ...record,
      id: record.id || Utils.generateId(),
      createdAt: record.createdAt || new Date().toISOString()
    };
    records.unshift(newRecord);
    this.setRecords(records);
    return newRecord;
  },

  /**
   * 更新记录
   */
  updateRecord(id, updates) {
    const records = this.getRecords();
    const index = records.findIndex(r => r.id === id);
    if (index !== -1) {
      records[index] = { ...records[index], ...updates, updatedAt: new Date().toISOString() };
      this.setRecords(records);
      return records[index];
    }
    return null;
  },

  /**
   * 删除记录
   */
  deleteRecord(id) {
    const records = this.getRecords();
    const filtered = records.filter(r => r.id !== id);
    this.setRecords(filtered);
    return filtered.length < records.length;
  },

  /**
   * 按类型获取记录
   */
  getRecordsByType(type) {
    return this.getRecords().filter(r => r.type === type);
  },

  /**
   * 按日期范围获取记录
   */
  getRecordsByDateRange(startDate, endDate) {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return this.getRecords().filter(r => {
      const date = new Date(r.createdAt).getTime();
      return date >= start && date <= end;
    });
  },

  /**
   * 获取本月记录
   */
  getMonthRecords() {
    const monthStart = Utils.getMonthStart();
    return this.getRecords().filter(r => new Date(r.createdAt) >= monthStart);
  },

  /**
   * 获取今日记录
   */
  getTodayRecords() {
    const todayStart = Utils.getTodayStart();
    return this.getRecords().filter(r => new Date(r.createdAt) >= todayStart);
  },

  /**
   * 计算统计数据
   */
  getStatistics() {
    const records = this.getRecords();
    const monthRecords = this.getMonthRecords();

    const totalIncome = monthRecords
      .filter(r => r.type === 'income')
      .reduce((sum, r) => sum + parseFloat(r.amount), 0);

    const totalExpense = monthRecords
      .filter(r => r.type === 'expense')
      .reduce((sum, r) => sum + parseFloat(r.amount), 0);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      monthRecordCount: monthRecords.length,
      totalRecordCount: records.length
    };
  },

  // ============ 分类管理 ============

  /**
   * 获取所有分类
   */
  getCategories() {
    return Utils.storage.get(this.KEYS.CATEGORIES, {
      expense: this.DEFAULT_EXPENSE_CATEGORIES,
      income: this.DEFAULT_INCOME_CATEGORIES
    });
  },

  /**
   * 设置分类
   */
  setCategories(categories) {
    return Utils.storage.set(this.KEYS.CATEGORIES, categories);
  },

  /**
   * 添加分类
   */
  addCategory(type, category) {
    const categories = this.getCategories();
    const newCategory = {
      ...category,
      id: category.id || `${type}_${Date.now()}`
    };
    categories[type].push(newCategory);
    this.setCategories(categories);
    return newCategory;
  },

  /**
   * 删除分类
   */
  deleteCategory(type, id) {
    const categories = this.getCategories();
    categories[type] = categories[type].filter(c => c.id !== id);
    this.setCategories(categories);
    return true;
  },

  // ============ 客户管理 ============

  /**
   * 获取所有客户
   */
  getCustomers() {
    return Utils.storage.get(this.KEYS.CUSTOMERS, []);
  },

  /**
   * 添加客户
   */
  addCustomer(customer) {
    const customers = this.getCustomers();
    const newCustomer = {
      ...customer,
      id: customer.id || Utils.generateId(),
      createdAt: new Date().toISOString()
    };
    customers.push(newCustomer);
    Utils.storage.set(this.KEYS.CUSTOMERS, customers);
    return newCustomer;
  },

  /**
   * 更新客户
   */
  updateCustomer(id, updates) {
    const customers = this.getCustomers();
    const index = customers.findIndex(c => c.id === id);
    if (index !== -1) {
      customers[index] = { ...customers[index], ...updates };
      Utils.storage.set(this.KEYS.CUSTOMERS, customers);
      return customers[index];
    }
    return null;
  },

  /**
   * 删除客户
   */
  deleteCustomer(id) {
    const customers = this.getCustomers();
    const filtered = customers.filter(c => c.id !== id);
    Utils.storage.set(this.KEYS.CUSTOMERS, filtered);
    return filtered.length < customers.length;
  },

  // ============ 设置管理 ============

  /**
   * 获取设置
   */
  getSettings() {
    return Utils.storage.get(this.KEYS.SETTINGS, this.DEFAULT_SETTINGS);
  },

  /**
   * 保存设置
   */
  setSettings(settings) {
    return Utils.storage.set(this.KEYS.SETTINGS, settings);
  },

  /**
   * 更新单个设置
   */
  updateSetting(key, value) {
    const settings = this.getSettings();
    settings[key] = value;
    return this.setSettings(settings);
  },

  // ============ 数据导出/导入 ============

  /**
   * 导出所有数据
   */
  exportData() {
    return {
      version: '1.0',
      exportDate: new Date().toISOString(),
      user: this.getUser(),
      records: this.getRecords(),
      customers: this.getCustomers(),
      categories: this.getCategories(),
      settings: this.getSettings()
    };
  },

  /**
   * 导入数据
   */
  importData(data) {
    try {
      if (data.records) this.setRecords(data.records);
      if (data.customers) Utils.storage.set(this.KEYS.CUSTOMERS, data.customers);
      if (data.categories) this.setCategories(data.categories);
      if (data.settings) this.setSettings(data.settings);
      return { success: true, message: '数据导入成功' };
    } catch (e) {
      return { success: false, message: '数据导入失败: ' + e.message };
    }
  },

  // ============ 供应商管理 ============

  /**
   * 获取所有供应商
   */
  getSuppliers() {
    return Utils.storage.get(this.KEYS.SUPPLIERS, []);
  },

  /**
   * 添加供应商
   */
  addSupplier(supplier) {
    const suppliers = this.getSuppliers();
    const newSupplier = {
      ...supplier,
      id: supplier.id || Utils.generateId(),
      createdAt: new Date().toISOString()
    };
    suppliers.push(newSupplier);
    Utils.storage.set(this.KEYS.SUPPLIERS, suppliers);
    return newSupplier;
  },

  /**
   * 更新供应商
   */
  updateSupplier(id, updates) {
    const suppliers = this.getSuppliers();
    const index = suppliers.findIndex(s => s.id === id);
    if (index !== -1) {
      suppliers[index] = { ...suppliers[index], ...updates };
      Utils.storage.set(this.KEYS.SUPPLIERS, suppliers);
      return suppliers[index];
    }
    return null;
  },

  /**
   * 删除供应商
   */
  deleteSupplier(id) {
    const suppliers = this.getSuppliers();
    const filtered = suppliers.filter(s => s.id !== id);
    Utils.storage.set(this.KEYS.SUPPLIERS, filtered);
    return filtered.length < suppliers.length;
  },

  /**
   * 清空所有数据
   */
  clearAllData() {
    Utils.storage.remove(this.KEYS.RECORDS);
    Utils.storage.remove(this.KEYS.CUSTOMERS);
    Utils.storage.remove(this.KEYS.SUPPLIERS);
    Utils.storage.remove(this.KEYS.CATEGORIES);
    this.init();
    return true;
  }
};

// 初始化存储
Storage.init();

// 导出到全局
window.Storage = Storage;
