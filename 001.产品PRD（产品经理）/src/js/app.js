/**
 * 轻记账 - 主应用逻辑
 */

// 全局状态
let currentTab = 'home';
let currentRecordType = 'expense';
let currentFilterType = 'all';
let currentFilterDate = '';
let currentStatsMonth = new Date();
let editingRecordId = null;
let selectedCategoryId = null;

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    // 设置默认日期为今天
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('record-date').value = today;

    // 加载首页数据
    loadHomeData();

    // 更新用户信息
    updateUserInfo();
}

// ========== 页面导航 ==========

function switchTab(tab) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // 更新导航状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // 显示目标页面
    const targetPage = document.getElementById(`page-${tab}`);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    const navItem = document.querySelector(`.nav-item[data-page="${tab}"]`);
    if (navItem) {
        navItem.classList.add('active');
    }

    currentTab = tab;

    // 加载页面数据
    switch (tab) {
        case 'home':
            loadHomeData();
            break;
        case 'records':
            loadRecordsData();
            break;
        case 'stats':
            loadStatsData();
            break;
        case 'profile':
            updateUserInfo();
            loadDebtReminder();
            break;
    }
}

// ========== 首页数据加载 ==========

function loadHomeData() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // 加载月度统计
    const stats = storage.getMonthStats(year, month);
    document.getElementById('month-income').textContent = formatMoney(stats.income);
    document.getElementById('month-expense').textContent = formatMoney(stats.expense);
    document.getElementById('month-profit').textContent = formatMoney(stats.profit);

    // 更新月份显示
    const monthLabel = document.querySelector('.month-switch');
    if (monthLabel) {
        monthLabel.textContent = `${year}.${String(month + 1).padStart(2, '0')}`;
    }

    // 加载最近记录
    const records = storage.getRecords().slice(0, 5);
    renderRecentRecords(records);

    // 加载欠款提醒
    loadDebtReminder();
}

function renderRecentRecords(records) {
    const container = document.getElementById('recent-list');
    const emptyState = document.getElementById('empty-recent');

    if (records.length === 0) {
        container.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    container.style.display = 'block';
    emptyState.style.display = 'none';

    container.innerHTML = records.map(record => {
        const categories = storage.getCategories();
        const category = categories.find(c => c.id === record.categoryId) || { icon: '📌', name: record.categoryName };
        const isExpense = record.type === 'expense';

        return `
            <div class="record-item" onclick="editRecord('${record.id}')">
                <div class="record-icon ${record.type}">${category.icon}</div>
                <div class="record-info">
                    <div class="record-category">${category.name}</div>
                    <div class="record-remark">${record.remark || formatDate(record.date)}</div>
                </div>
                <div>
                    <div class="record-amount ${record.type}">
                        ${isExpense ? '-' : '+'}${formatMoney(record.amount)}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ========== 记录面板 ==========

function showRecordPanel(type) {
    const panel = document.getElementById('record-panel');
    panel.classList.add('active');

    // 设置默认类型
    if (type) {
        setRecordType(type);
    }

    // 重置表单
    resetRecordForm();

    // 加载分类
    loadCategorySelector();
}

function hideRecordPanel() {
    const panel = document.getElementById('record-panel');
    panel.classList.remove('active');

    // 重置状态
    editingRecordId = null;
    selectedCategoryId = null;
}

function setRecordType(type) {
    currentRecordType = type;

    // 更新标签状态
    document.querySelectorAll('.panel-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.type === type);
    });

    // 更新标题
    const title = document.getElementById('panel-title');
    title.textContent = type === 'expense' ? '记支出' : '记收入';

    // 更新提交按钮
    const submitBtn = document.getElementById('btn-submit');
    submitBtn.textContent = type === 'expense' ? '💕 保存支出' : '💕 保存收入';

    // 重新加载分类
    loadCategorySelector();
}

function loadCategorySelector() {
    const container = document.getElementById('category-selector');
    const categories = currentRecordType === 'expense'
        ? storage.getExpenseCategories()
        : storage.getIncomeCategories();

    container.innerHTML = categories.map(cat => `
        <button class="category-btn ${selectedCategoryId === cat.id ? 'selected' : ''}"
                onclick="selectCategory('${cat.id}')"
                data-id="${cat.id}">
            <span class="category-btn-icon">${cat.icon}</span>
            <span class="category-btn-name">${cat.name}</span>
        </button>
    `).join('');

    // 默认选择第一个
    if (!selectedCategoryId && categories.length > 0) {
        selectCategory(categories[0].id);
    }
}

function selectCategory(categoryId) {
    selectedCategoryId = categoryId;

    // 更新选中状态
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.id === categoryId);
    });
}

function resetRecordForm() {
    document.getElementById('record-amount').value = '';
    document.getElementById('record-remark').value = '';
    document.getElementById('record-counterparty').value = '';
    document.getElementById('record-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('record-method').value = 'wechat';
    selectedCategoryId = null;
    editingRecordId = null;
}

function submitRecord() {
    const amount = document.getElementById('record-amount').value.trim();
    const date = document.getElementById('record-date').value;
    const method = document.getElementById('record-method').value;
    const remark = document.getElementById('record-remark').value.trim();
    const counterparty = document.getElementById('record-counterparty').value.trim();

    // 验证
    if (!amount || parseFloat(amount) <= 0) {
        showToast('请输入正确的金额');
        return;
    }

    if (!selectedCategoryId) {
        showToast('请选择分类');
        return;
    }

    // 获取分类信息
    const categories = storage.getCategories();
    const category = categories.find(c => c.id === selectedCategoryId);

    const record = {
        type: currentRecordType,
        amount: parseFloat(amount),
        categoryId: selectedCategoryId,
        categoryName: category ? category.name : '',
        date: date || new Date().toISOString().split('T')[0],
        method: method,
        remark: remark,
        counterparty: counterparty
    };

    if (editingRecordId) {
        storage.updateRecord(editingRecordId, record);
        showToast('✨ 记录已更新');
    } else {
        storage.addRecord(record);
        showToast('💕 已记录');
    }

    hideRecordPanel();
    loadHomeData();
}

function editRecord(id) {
    const records = storage.getRecords();
    const record = records.find(r => r.id === id);

    if (!record) return;

    editingRecordId = id;

    // 显示面板
    showRecordPanel(record.type);

    // 填充表单
    document.getElementById('record-amount').value = record.amount;
    document.getElementById('record-date').value = record.date;
    document.getElementById('record-method').value = record.method || 'wechat';
    document.getElementById('record-remark').value = record.remark || '';
    document.getElementById('record-counterparty').value = record.counterparty || '';

    // 设置类型和分类
    setRecordType(record.type);
    selectCategory(record.categoryId);
}

// ========== 记录列表 ==========

function loadRecordsData() {
    const records = storage.getRecords();
    renderRecordsList(records);
}

function renderRecordsList(records) {
    const container = document.getElementById('records-list');
    const emptyState = document.getElementById('empty-records');

    // 应用筛选
    let filtered = records;

    if (currentFilterType !== 'all') {
        filtered = filtered.filter(r => r.type === currentFilterType);
    }

    if (currentFilterDate) {
        filtered = filtered.filter(r => r.date === currentFilterDate);
    }

    if (filtered.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    // 按日期分组
    const grouped = {};
    filtered.forEach(record => {
        if (!grouped[record.date]) {
            grouped[record.date] = [];
        }
        grouped[record.date].push(record);
    });

    // 渲染
    container.innerHTML = Object.entries(grouped)
        .sort((a, b) => new Date(b[0]) - new Date(a[0]))
        .map(([date, records]) => {
            const total = records.reduce((sum, r) => {
                const amount = parseFloat(r.amount);
                return sum + (r.type === 'expense' ? -amount : amount);
            }, 0);

            return `
                <div class="date-group">
                    <div class="date-header">
                        ${formatDateFull(date)}
                        <span class="date-total ${total >= 0 ? 'text-income' : 'text-expense'}">
                            ${total >= 0 ? '+' : ''}${formatMoney(total)}
                        </span>
                    </div>
                    ${records.map(record => renderRecordItem(record)).join('')}
                </div>
            `;
        }).join('');
}

function renderRecordItem(record) {
    const categories = storage.getCategories();
    const category = categories.find(c => c.id === record.categoryId) || { icon: '📌', name: record.categoryName };
    const isExpense = record.type === 'expense';

    return `
        <div class="recent-list">
            <div class="record-item" onclick="editRecord('${record.id}')">
                <div class="record-icon ${record.type}">${category.icon}</div>
                <div class="record-info">
                    <div class="record-category">${category.name}</div>
                    <div class="record-remark">${record.remark || ''}</div>
                </div>
                <div>
                    <div class="record-amount ${record.type}">
                        ${isExpense ? '-' : '+'}${formatMoney(record.amount)}
                    </div>
                    <div class="record-date">${formatTime(record.createdAt)}</div>
                </div>
            </div>
        </div>
    `;
}

function filterRecords(type) {
    if (type) {
        currentFilterType = type;
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.type === type);
        });
    }

    loadRecordsData();
}

// ========== 统计页面 ==========

function loadStatsData() {
    const year = currentStatsMonth.getFullYear();
    const month = currentStatsMonth.getMonth();

    // 更新月份显示
    const monthStr = `${year}年${month + 1}月`;
    document.getElementById('stats-current-month').textContent = monthStr;

    // 加载月度统计
    const stats = storage.getMonthStats(year, month);
    document.getElementById('stats-income').textContent = formatMoney(stats.income);
    document.getElementById('stats-expense').textContent = formatMoney(stats.expense);
    document.getElementById('stats-profit').textContent = formatMoney(stats.profit);

    // 加载分类统计
    loadCategoryStats(year, month);

    // 加载趋势图
    loadTrendChart(year, month);
}

function changeStatsMonth(delta) {
    currentStatsMonth.setMonth(currentStatsMonth.getMonth() + delta);
    loadStatsData();
}

function loadCategoryStats(year, month) {
    const stats = storage.getCategoryStats(year, month);
    const total = stats.reduce((sum, s) => sum + s.amount, 0);

    // 只显示支出分类
    const expenseStats = stats.filter(s => s.id.startsWith('expense_'));

    // 渲染分类列表
    const listContainer = document.getElementById('category-list');
    listContainer.innerHTML = expenseStats.slice(0, 5).map(stat => {
        const percent = total > 0 ? ((stat.amount / total) * 100).toFixed(1) : 0;
        const colors = ['#FF8FAB', '#FFB3C6', '#7ED7C1', '#A8E6CF', '#FFD166'];
        const colorIndex = expenseStats.indexOf(stat) % colors.length;

        return `
            <div class="category-item">
                <span class="category-color" style="background: ${colors[colorIndex]}"></span>
                <span class="category-name">${stat.icon} ${stat.name}</span>
                <span class="category-value">${formatMoney(stat.amount)}</span>
                <span class="category-percent">${percent}%</span>
            </div>
        `;
    }).join('');

    // 渲染饼图（简化版）
    const chartContainer = document.getElementById('category-chart');
    if (expenseStats.length === 0) {
        chartContainer.innerHTML = '<div class="empty-state"><p>暂无支出数据</p></div>';
        return;
    }

    chartContainer.innerHTML = `
        <div style="display: flex; align-items: center; gap: 16px;">
            <div style="position: relative; width: 120px; height: 120px;">
                <svg viewBox="0 0 100 100" style="transform: rotate(-90deg);">
                    ${expenseStats.slice(0, 5).reduce((acc, stat, index) => {
                        const percent = (stat.amount / total) * 100;
                        const colors = ['#FF8FAB', '#FFB3C6', '#7ED7C1', '#A8E6CF', '#FFD166'];
                        const prevPercent = expenseStats.slice(0, index).reduce((sum, s) => sum + (s.amount / total) * 100, 0);

                        acc += `
                            <circle
                                cx="50" cy="50" r="40"
                                fill="none"
                                stroke="${colors[index]}"
                                stroke-width="20"
                                stroke-dasharray="${percent * 2.51} ${251 - percent * 2.51}"
                                stroke-dashoffset="${-prevPercent * 2.51}"
                            />
                        `;
                        return acc;
                    }, '')}
                </svg>
            </div>
        </div>
    `;
}

function loadTrendChart(year, month) {
    const container = document.getElementById('trend-chart');

    // 获取本月的日期数据
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dailyData = [];

    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayRecords = storage.getRecordsByDate(dateStr);

        let income = 0;
        let expense = 0;

        dayRecords.forEach(r => {
            const amount = parseFloat(r.amount);
            if (r.type === 'income') {
                income += amount;
            } else {
                expense += amount;
            }
        });

        dailyData.push({ day, income, expense });
    }

    // 找到最大值用于缩放
    const maxValue = Math.max(...dailyData.map(d => Math.max(d.income, d.expense)), 100);
    const chartHeight = 180;

    // 只显示最近14天
    const displayData = dailyData.slice(-14);

    container.innerHTML = `
        <div style="display: flex; align-items: flex-end; justify-content: space-between; height: ${chartHeight}px; padding-bottom: 20px; border-bottom: 1px solid var(--border);">
            ${displayData.map(d => {
                const incomeHeight = maxValue > 0 ? (d.income / maxValue) * chartHeight : 0;
                const expenseHeight = maxValue > 0 ? (d.expense / maxValue) * chartHeight : 0;

                return `
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1;">
                        <div style="display: flex; gap: 2px; align-items: flex-end; height: ${chartHeight}px;">
                            <div style="width: 8px; height: ${Math.max(incomeHeight, 2)}px; background: linear-gradient(180deg, #7ED7C1, #5cb085); border-radius: 4px 4px 0 0;"></div>
                            <div style="width: 8px; height: ${Math.max(expenseHeight, 2)}px; background: linear-gradient(180deg, #FF8FAB, #FF6B9D); border-radius: 4px 4px 0 0;"></div>
                        </div>
                        <span style="font-size: 10px; color: var(--text-muted);">${d.day}</span>
                    </div>
                `;
            }).join('')}
        </div>
        <div style="display: flex; justify-content: center; gap: 24px; margin-top: 12px; font-size: 12px;">
            <span><span style="display: inline-block; width: 10px; height: 10px; background: #7ED7C1; border-radius: 2px; margin-right: 4px;"></span>收入</span>
            <span><span style="display: inline-block; width: 10px; height: 10px; background: #FF8FAB; border-radius: 2px; margin-right: 4px;"></span>支出</span>
        </div>
    `;
}

// ========== 客户管理 ==========

function showCustomers() {
    switchTab('customers');
    loadCustomersData();
}

function loadCustomersData() {
    const customers = storage.getCustomers();
    const container = document.getElementById('customer-list');
    const emptyState = document.getElementById('empty-customers');

    if (customers.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    container.innerHTML = customers.map(customer => `
        <div class="customer-item">
            <div class="customer-avatar">👤</div>
            <div class="customer-info">
                <div class="customer-name">${customer.name}</div>
                <div class="customer-debt ${customer.totalDebt > 0 ? 'unpaid' : 'paid'}">
                    ${customer.totalDebt > 0 ? `待收: ¥${formatMoney(customer.totalDebt)}` : '已结清 ✨'}
                </div>
            </div>
            <div class="customer-actions">
                <button class="action-btn-small secondary" onclick="editCustomer('${customer.id}')">编辑</button>
                <button class="action-btn-small primary" onclick="deleteCustomer('${customer.id}')">删除</button>
            </div>
        </div>
    `).join('');
}

function showAddCustomer() {
    const name = prompt('请输入客户名称：');
    if (!name) return;

    const phone = prompt('请输入联系电话（可选）：') || '';
    const address = prompt('请输入地址（可选）：') || '';

    storage.addCustomer({ name, phone, address });
    showToast('✨ 客户已添加');
    loadCustomersData();
}

function editCustomer(id) {
    const customers = storage.getCustomers();
    const customer = customers.find(c => c.id === id);

    if (!customer) return;

    const name = prompt('请输入客户名称：', customer.name);
    if (!name) return;

    const phone = prompt('请输入联系电话：', customer.phone) || '';
    const address = prompt('请输入地址：', customer.address) || '';

    storage.updateCustomer(id, { name, phone, address });
    showToast('✨ 客户已更新');
    loadCustomersData();
}

function deleteCustomer(id) {
    showModal('确认删除', '确定要删除这个客户吗？', () => {
        storage.deleteCustomer(id);
        showToast('✨ 客户已删除');
        loadCustomersData();
    });
}

function searchCustomers() {
    const keyword = document.getElementById('customer-search').value.toLowerCase();
    const customers = storage.getCustomers();
    const filtered = keyword
        ? customers.filter(c => c.name.toLowerCase().includes(keyword))
        : customers;

    const container = document.getElementById('customer-list');
    const emptyState = document.getElementById('empty-customers');

    if (filtered.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    container.innerHTML = filtered.map(customer => `
        <div class="customer-item">
            <div class="customer-avatar">👤</div>
            <div class="customer-info">
                <div class="customer-name">${customer.name}</div>
                <div class="customer-debt ${customer.totalDebt > 0 ? 'unpaid' : 'paid'}">
                    ${customer.totalDebt > 0 ? `待收: ¥${formatMoney(customer.totalDebt)}` : '已结清 ✨'}
                </div>
            </div>
            <div class="customer-actions">
                <button class="action-btn-small secondary" onclick="editCustomer('${customer.id}')">编辑</button>
                <button class="action-btn-small primary" onclick="deleteCustomer('${customer.id}')">删除</button>
            </div>
        </div>
    `).join('');
}

// ========== 供应商管理 ==========

function showSuppliers() {
    switchTab('suppliers');
    loadSuppliersData();
}

function loadSuppliersData() {
    const suppliers = storage.getSuppliers();
    const container = document.getElementById('supplier-list');
    const emptyState = document.getElementById('empty-suppliers');

    if (suppliers.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';

    container.innerHTML = suppliers.map(supplier => `
        <div class="supplier-item">
            <div class="supplier-avatar">📦</div>
            <div class="supplier-info">
                <div class="supplier-name">${supplier.name}</div>
                <div class="supplier-total">累计采购: ¥${formatMoney(supplier.totalPurchase || 0)}</div>
            </div>
            <div class="supplier-actions">
                <button class="action-btn-small secondary" onclick="editSupplier('${supplier.id}')">编辑</button>
                <button class="action-btn-small primary" onclick="deleteSupplier('${supplier.id}')">删除</button>
            </div>
        </div>
    `).join('');
}

function showAddSupplier() {
    const name = prompt('请输入供应商名称：');
    if (!name) return;

    const phone = prompt('请输入联系电话（可选）：') || '';
    const products = prompt('请输入主营商品（可选）：') || '';

    storage.addSupplier({ name, phone, products });
    showToast('✨ 供应商已添加');
    loadSuppliersData();
}

function editSupplier(id) {
    const suppliers = storage.getSuppliers();
    const supplier = suppliers.find(s => s.id === id);

    if (!supplier) return;

    const name = prompt('请输入供应商名称：', supplier.name);
    if (!name) return;

    const phone = prompt('请输入联系电话：', supplier.phone) || '';
    const products = prompt('请输入主营商品：', supplier.products) || '';

    storage.updateSupplier(id, { name, phone, products });
    showToast('✨ 供应商已更新');
    loadSuppliersData();
}

function deleteSupplier(id) {
    showModal('确认删除', '确定要删除这个供应商吗？', () => {
        storage.deleteSupplier(id);
        showToast('✨ 供应商已删除');
        loadSuppliersData();
    });
}

// ========== 分类管理 ==========

function showCategoryManage() {
    showToast('功能开发中...');
}

// ========== 数据导入导出 ==========

function exportData() {
    const data = storage.exportAllData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `轻记账备份_${new Date().toISOString().split('T')[0]}.json`;
    a.click();

    URL.revokeObjectURL(url);
    showToast('✨ 数据已导出');
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                storage.importData(data);
                showToast('✨ 数据已导入');
                loadHomeData();
            } catch (err) {
                showToast('导入失败，请检查文件格式');
            }
        };
        reader.readAsText(file);
    };

    input.click();
}

// ========== 用户信息 ==========

function updateUserInfo() {
    const settings = storage.getSettings();
    document.getElementById('user-name').textContent = settings.userName;
    document.getElementById('record-count').textContent = storage.getRecordDays();
}

function showSettings() {
    switchTab('profile');
}

function showAbout() {
    showToast('轻记账 v1.0.0 💕');
}

// ========== 欠款提醒 ==========

function loadDebtReminder() {
    const customers = storage.getCustomers().filter(c => c.totalDebt > 0);
    const container = document.getElementById('debt-reminder');
    const listContainer = document.getElementById('debt-list');

    if (customers.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';
    listContainer.innerHTML = customers.slice(0, 3).map(customer => `
        <div class="debt-item">
            <div class="debt-info">
                <div class="debt-avatar">👤</div>
                <div class="debt-name">${customer.name}</div>
            </div>
            <div class="debt-amount">¥${formatMoney(customer.totalDebt)}</div>
        </div>
    `).join('');
}

// ========== Toast 提示 ==========

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.querySelector('.toast-message').textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// ========== Modal 对话框 ==========

function showModal(title, message, onConfirm) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').textContent = message;
    document.getElementById('modal').classList.add('active');

    document.getElementById('modal-confirm').onclick = () => {
        hideModal();
        if (onConfirm) onConfirm();
    };
}

function hideModal() {
    document.getElementById('modal').classList.remove('active');
}

// ========== 工具函数 ==========

function formatMoney(amount) {
    return parseFloat(amount || 0).toFixed(2);
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return '今天';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return '昨天';
    } else {
        return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
}

function formatDateFull(dateStr) {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日 ${weekdays[date.getDay()]}`;
}

const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

function formatTime(isoString) {
    const date = new Date(isoString);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function showMonthPicker() {
    switchTab('stats');
}