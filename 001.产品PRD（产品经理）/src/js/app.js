/**
 * 轻记账 - 主应用逻辑
 */

// 全局状态
let currentTab = 'home';
let currentRecordType = 'expense';
let currentFilterType = 'all';
let currentFilterDate = '';
let currentStatsYear = new Date().getFullYear();
let currentDetailPage = 1;
let currentDetailYear = new Date().getFullYear();
let currentDetailMonth = new Date().getMonth() + 1;
let editingRecordId = null;
let selectedCategoryId = null;
let categories = [];
let homeData = null; // 缓存首页数据

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    init();
});

async function init() {
    // 检查登录状态
    const token = localStorage.getItem('token');
    if (!token) {
        showToast('请先登录');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
        return;
    }

    // 设置默认日期为今天
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('record-date').value = today;

    // 加载数据
    await loadHomeData();
    await updateUserInfo();
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

async function loadHomeData() {
    try {
        // 显示加载状态
        document.getElementById('month-income').textContent = '...';
        document.getElementById('month-expense').textContent = '...';
        document.getElementById('month-profit').textContent = '...';

        // 调用后端API获取首页数据
        const res = await API.Transaction.getHomeData();
        homeData = res.data;

        const now = new Date();
        const year = homeData.year;
        const month = homeData.month;

        // 更新月份显示
        const monthLabel = document.querySelector('.month-label');
        if (monthLabel) {
            monthLabel.textContent = `${year}年${month}月`;
        }

        // 更新月度统计
        document.getElementById('month-income').textContent = formatMoney(homeData.totalIncome);
        document.getElementById('month-expense').textContent = formatMoney(homeData.totalExpense);
        document.getElementById('month-profit').textContent = formatMoney(homeData.netProfit);

        // 渲染分类支出（最多3个）
        renderTopExpenseCategories(homeData.topExpenseCategories || []);

        // 渲染最近记账记录（最多3条）
        renderRecentRecords(homeData.recentTransactions || []);

    } catch (err) {
        console.error('加载首页数据失败:', err);
        showToast('加载数据失败');

        // 如果API失败，使用本地数据
        loadHomeDataLocal();
    }
}

// 本地存储版本的数据加载（备用）
function loadHomeDataLocal() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    // 加载月度统计
    const stats = storage.getMonthStats(year, month);
    document.getElementById('month-income').textContent = formatMoney(stats.income);
    document.getElementById('month-expense').textContent = formatMoney(stats.expense);
    document.getElementById('month-profit').textContent = formatMoney(stats.profit);

    // 加载最近记录
    const records = storage.getRecords().slice(0, 3);
    renderRecentRecords(records);
}

// 渲染分类支出
function renderTopExpenseCategories(categories) {
    const container = document.getElementById('top-categories');
    if (!container) {
        // 如果没有容器，创建一个
        const overviewCard = document.querySelector('.overview-card');
        if (overviewCard) {
            const categoriesSection = document.createElement('div');
            categoriesSection.className = 'top-categories-section';
            categoriesSection.id = 'top-categories';
            overviewCard.insertBefore(categoriesSection, overviewCard.querySelector('.quick-actions'));
        }
    }

    const catContainer = document.getElementById('top-categories');
    if (!catContainer) return;

    if (categories.length === 0) {
        catContainer.innerHTML = `
            <div class="section-header">
                <h3>分类支出</h3>
            </div>
            <div class="empty-hint">暂无支出数据</div>
        `;
        return;
    }

    catContainer.innerHTML = `
        <div class="section-header">
            <h3>分类支出</h3>
        </div>
        <div class="category-bars">
            ${categories.slice(0, 3).map(cat => `
                <div class="category-bar-item">
                    <div class="category-bar-info">
                        <span class="category-bar-icon">${cat.category_icon || '📌'}</span>
                        <span class="category-bar-name">${cat.category_name}</span>
                    </div>
                    <div class="category-bar-value">¥${formatMoney(cat.total)}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// 渲染最近记录
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
        const isExpense = record.type === 1;

        return `
            <div class="record-item" onclick="editRecord(${record.id})">
                <div class="record-icon ${isExpense ? 'expense' : 'income'}">${record.category_icon || '📌'}</div>
                <div class="record-info">
                    <div class="record-category">${record.category_name || '未分类'}</div>
                    <div class="record-remark">${record.remark || formatDate(record.date)}</div>
                </div>
                <div>
                    <div class="record-amount ${isExpense ? 'expense' : 'income'}">
                        ${isExpense ? '-' : '+'}${formatMoney(record.amount)}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ========== 记录面板 ==========

async function showRecordPanel(type) {
    const panel = document.getElementById('record-panel');
    panel.classList.add('active');

    // 设置默认类型
    if (type) {
        setRecordType(type);
    }

    // 重置表单
    resetRecordForm();

    // 加载分类
    await loadCategorySelector();
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

async function loadCategorySelector() {
    const container = document.getElementById('category-selector');

    try {
        // 从后端获取分类
        const typeValue = currentRecordType === 'expense' ? 1 : 2;
        const res = await API.Category.getList(typeValue);
        categories = res.data || [];
    } catch (err) {
        // 降级到本地分类
        categories = currentRecordType === 'expense'
            ? storage.getExpenseCategories()
            : storage.getIncomeCategories();
    }

    container.innerHTML = categories.map(cat => `
        <button class="category-btn ${selectedCategoryId === cat.id ? 'selected' : ''}"
                onclick="selectCategory(${cat.id})"
                data-id="${cat.id}">
            <span class="category-btn-icon">${cat.icon || '📌'}</span>
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
        btn.classList.toggle('selected', parseInt(btn.dataset.id) === categoryId);
    });
}

function resetRecordForm() {
    document.getElementById('record-amount').value = '';
    document.getElementById('record-remark').value = '';
    document.getElementById('record-counterparty').value = '';
    document.getElementById('record-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('record-method').value = '2'; // 微信
    selectedCategoryId = null;
    editingRecordId = null;
}

async function submitRecord() {
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

    const typeValue = currentRecordType === 'expense' ? 1 : 2;
    const recordData = {
        type: typeValue,
        amount: parseFloat(amount),
        categoryId: selectedCategoryId,
        date: date || new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 8),
        paymentMethod: parseInt(method) || 2,
        remark: remark,
        counterparty: counterparty,
        status: 1 // 已收讫
    };

    try {
        if (editingRecordId) {
            await API.Transaction.update(editingRecordId, recordData);
            showToast('✨ 记录已更新');
        } else {
            await API.Transaction.create(recordData);
            showToast('💕 已记录');
        }

        hideRecordPanel();
        loadHomeData();
    } catch (err) {
        console.error('保存失败:', err);
        showToast(err.message || '保存失败');

        // 降级到本地存储
        saveRecordLocal();
    }
}

// 本地存储版本的保存（备用）
function saveRecordLocal() {
    const amount = document.getElementById('record-amount').value.trim();
    const date = document.getElementById('record-date').value;
    const method = document.getElementById('record-method').value;
    const remark = document.getElementById('record-remark').value.trim();

    const category = categories.find(c => c.id === selectedCategoryId);

    const record = {
        type: currentRecordType,
        amount: parseFloat(amount),
        categoryId: selectedCategoryId,
        categoryName: category ? category.name : '',
        date: date || new Date().toISOString().split('T')[0],
        method: method,
        remark: remark
    };

    if (editingRecordId) {
        storage.updateRecord(editingRecordId, record);
        showToast('✨ 记录已更新');
    } else {
        storage.addRecord(record);
        showToast('💕 已记录');
    }

    hideRecordPanel();
    loadHomeDataLocal();
}

async function editRecord(id) {
    try {
        const res = await API.Transaction.getById(id);
        const record = res.data;

        if (!record) return;

        editingRecordId = id;

        // 显示面板
        const recordType = record.type === 1 ? 'expense' : 'income';
        showRecordPanel(recordType);

        // 填充表单
        document.getElementById('record-amount').value = record.amount;
        document.getElementById('record-date').value = record.date;
        document.getElementById('record-method').value = record.payment_method || '2';
        document.getElementById('record-remark').value = record.remark || '';
        document.getElementById('record-counterparty').value = record.counterparty || '';

        // 设置类型和分类
        setRecordType(recordType);
        selectCategory(record.category_id);

    } catch (err) {
        // 降级到本地
        const records = storage.getRecords();
        const record = records.find(r => r.id == id);

        if (!record) return;

        editingRecordId = id;
        showRecordPanel(record.type);

        document.getElementById('record-amount').value = record.amount;
        document.getElementById('record-date').value = record.date;
        document.getElementById('record-method').value = record.method || 'wechat';
        document.getElementById('record-remark').value = record.remark || '';
        document.getElementById('record-counterparty').value = record.counterparty || '';

        setRecordType(record.type);
        selectCategory(record.categoryId);
    }
}

// ========== 记录列表（明细页）==========

async function loadRecordsData() {
    currentDetailPage = 1;
    const container = document.getElementById('records-list');

    // 显示加载状态
    container.innerHTML = '<div class="loading-state">加载中...</div>';

    try {
        // 获取年月
        const yearMonth = `${currentDetailYear}-${String(currentDetailMonth).padStart(2, '0')}`;
        const startDate = `${yearMonth}-01`;
        const endDate = `${yearMonth}-31`;

        let params = {
            page: currentDetailPage,
            pageSize: 20,
            startDate: startDate,
            endDate: endDate
        };

        if (currentFilterType !== 'all') {
            params.type = currentFilterType === 'expense' ? 1 : 2;
        }

        const res = await API.Transaction.getList(params);
        const list = res.data?.list || [];
        const total = res.data?.pagination?.total || 0;

        renderRecordsList(list, total);

    } catch (err) {
        console.error('加载记录失败:', err);
        loadRecordsDataLocal();
    }
}

// 本地存储版本
function loadRecordsDataLocal() {
    const records = storage.getRecords();
    let filtered = records;

    if (currentFilterType !== 'all') {
        filtered = filtered.filter(r => r.type === currentFilterType);
    }

    renderRecordsList(filtered, filtered.length);
}

function renderRecordsList(records, total) {
    const container = document.getElementById('records-list');
    const emptyState = document.getElementById('empty-records');

    if (records.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        document.getElementById('load-more-btn')?.remove();
        return;
    }

    emptyState.style.display = 'none';

    // 按日期分组
    const grouped = {};
    records.forEach(record => {
        if (!grouped[record.date]) {
            grouped[record.date] = [];
        }
        grouped[record.date].push(record);
    });

    // 渲染
    container.innerHTML = Object.entries(grouped)
        .sort((a, b) => new Date(b[0]) - new Date(a[0]))
        .map(([date, dayRecords]) => {
            const totalAmount = dayRecords.reduce((sum, r) => {
                const amount = parseFloat(r.amount);
                return sum + (r.type === 1 ? -amount : amount);
            }, 0);

            return `
                <div class="date-group">
                    <div class="date-header">
                        ${formatDateFull(date)}
                        <span class="date-total ${totalAmount >= 0 ? 'text-income' : 'text-expense'}">
                            ${totalAmount >= 0 ? '+' : ''}${formatMoney(Math.abs(totalAmount))}
                        </span>
                    </div>
                    ${dayRecords.map(record => renderRecordItem(record)).join('')}
                </div>
            `;
        }).join('');

    // 添加加载更多按钮
    if (total > currentDetailPage * 20) {
        const loadMoreBtn = document.createElement('button');
        loadMoreBtn.id = 'load-more-btn';
        loadMoreBtn.className = 'load-more-btn';
        loadMoreBtn.textContent = '加载更多';
        loadMoreBtn.onclick = loadMoreRecords;
        container.appendChild(loadMoreBtn);
    }
}

function renderRecordItem(record) {
    const isExpense = record.type === 1;

    return `
        <div class="record-item" onclick="editRecord(${record.id})">
            <div class="record-icon ${isExpense ? 'expense' : 'income'}">${record.category_icon || record.categoryIcon || '📌'}</div>
            <div class="record-info">
                <div class="record-category">${record.category_name || record.categoryName || '未分类'}</div>
                <div class="record-remark">${record.remark || ''}</div>
            </div>
            <div>
                <div class="record-amount ${isExpense ? 'expense' : 'income'}">
                    ${isExpense ? '-' : '+'}${formatMoney(record.amount)}
                </div>
                <div class="record-date">${record.time ? record.time.slice(0, 5) : ''}</div>
            </div>
        </div>
    `;
}

async function loadMoreRecords() {
    const btn = document.getElementById('load-more-btn');
    if (!btn) return;

    btn.textContent = '加载中...';
    currentDetailPage++;

    try {
        const yearMonth = `${currentDetailYear}-${String(currentDetailMonth).padStart(2, '0')}`;
        const startDate = `${yearMonth}-01`;
        const endDate = `${yearMonth}-31`;

        let params = {
            page: currentDetailPage,
            pageSize: 20,
            startDate: startDate,
            endDate: endDate
        };

        if (currentFilterType !== 'all') {
            params.type = currentFilterType === 'expense' ? 1 : 2;
        }

        const res = await API.Transaction.getList(params);
        const newRecords = res.data?.list || [];

        if (newRecords.length > 0) {
            const container = document.getElementById('records-list');
            const emptyState = document.getElementById('empty-records');
            emptyState.style.display = 'none';

            // 添加新记录
            const allRecords = [...getAllRecords(), ...newRecords];
            container.innerHTML = renderRecordsGrouped(allRecords);
        }

        btn.textContent = '加载更多';

    } catch (err) {
        currentDetailPage--;
        btn.textContent = '加载失败，点击重试';
    }
}

// 获取已显示的所有记录
function getAllRecords() {
    const items = document.querySelectorAll('.record-item');
    return Array.from(items).map(item => {
        // 从 DOM 提取数据（简化版本）
        return {};
    });
}

function renderRecordsGrouped(records) {
    // 按日期分组
    const grouped = {};
    records.forEach(record => {
        if (!grouped[record.date]) {
            grouped[record.date] = [];
        }
        grouped[record.date].push(record);
    });

    return Object.entries(grouped)
        .sort((a, b) => new Date(b[0]) - new Date(a[0]))
        .map(([date, dayRecords]) => {
            const totalAmount = dayRecords.reduce((sum, r) => {
                const amount = parseFloat(r.amount);
                return sum + (r.type === 1 ? -amount : amount);
            }, 0);

            return `
                <div class="date-group">
                    <div class="date-header">
                        ${formatDateFull(date)}
                        <span class="date-total ${totalAmount >= 0 ? 'text-income' : 'text-expense'}">
                            ${totalAmount >= 0 ? '+' : ''}${formatMoney(Math.abs(totalAmount))}
                        </span>
                    </div>
                    ${dayRecords.map(record => renderRecordItem(record)).join('')}
                </div>
            `;
        }).join('');
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

async function loadStatsData() {
    try {
        // 获取年度统计
        const statsRes = await API.Transaction.getYearlyStats(currentStatsYear);
        const stats = statsRes.data;

        // 更新页面标题
        document.getElementById('stats-current-year').textContent = `${currentStatsYear}年`;

        // 更新统计数据
        document.getElementById('stats-income').textContent = formatMoney(stats.totalIncome);
        document.getElementById('stats-expense').textContent = formatMoney(stats.totalExpense);
        document.getElementById('stats-profit').textContent = formatMoney(stats.netProfit);

        // 渲染支出分类饼图
        renderExpensePieChart(stats.expenseByCategory || []);

        // 获取年度月度趋势
        const trendRes = await API.Transaction.getYearlyMonthlyTrend(currentStatsYear);
        renderYearlyTrendChart(trendRes.data || []);

    } catch (err) {
        console.error('加载统计数据失败:', err);
        showToast('加载统计数据失败');
    }
}

function renderExpensePieChart(categories) {
    const chartContainer = document.getElementById('category-chart');
    const listContainer = document.getElementById('category-list');

    if (categories.length === 0) {
        chartContainer.innerHTML = '<div class="empty-hint">暂无支出数据</div>';
        listContainer.innerHTML = '';
        return;
    }

    const total = categories.reduce((sum, c) => sum + parseFloat(c.total || 0), 0);
    const colors = ['#FF8FAB', '#FFB3C6', '#7ED7C1', '#A8E6CF', '#FFD166', '#85C1E9', '#BB8FCE', '#F7DC6F'];

    // 渲染饼图
    chartContainer.innerHTML = `
        <div style="display: flex; align-items: center; gap: 16px;">
            <div style="position: relative; width: 120px; height: 120px;">
                <svg viewBox="0 0 100 100" style="transform: rotate(-90deg);">
                    ${categories.slice(0, 5).reduce((acc, cat, index) => {
                        const percent = total > 0 ? (parseFloat(cat.total) / total) * 100 : 0;
                        const prevPercent = categories.slice(0, index).reduce((sum, c) =>
                            sum + (total > 0 ? (parseFloat(c.total) / total) * 100 : 0), 0);

                        acc += `
                            <circle
                                cx="50" cy="50" r="40"
                                fill="none"
                                stroke="${colors[index % colors.length]}"
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

    // 渲染分类列表
    listContainer.innerHTML = categories.slice(0, 5).map((cat, index) => {
        const percent = total > 0 ? ((parseFloat(cat.total) / total) * 100).toFixed(1) : 0;
        return `
            <div class="category-item">
                <span class="category-color" style="background: ${colors[index % colors.length]}"></span>
                <span class="category-name">${cat.category_icon} ${cat.category_name}</span>
                <span class="category-value">${formatMoney(cat.total)}</span>
                <span class="category-percent">${percent}%</span>
            </div>
        `;
    }).join('');
}

function renderYearlyTrendChart(data) {
    const container = document.getElementById('trend-chart');

    if (data.length === 0) {
        container.innerHTML = '<div class="empty-hint">暂无趋势数据</div>';
        return;
    }

    const maxValue = Math.max(
        ...data.map(d => Math.max(parseFloat(d.monthly_income || 0), parseFloat(d.monthly_expense || 0))),
        100
    );
    const chartHeight = 180;

    container.innerHTML = `
        <div style="display: flex; align-items: flex-end; justify-content: space-between; height: ${chartHeight}px; padding-bottom: 20px; border-bottom: 1px solid var(--border);">
            ${data.map(d => {
                const incomeHeight = maxValue > 0 ? (parseFloat(d.monthly_income || 0) / maxValue) * chartHeight : 0;
                const expenseHeight = maxValue > 0 ? (parseFloat(d.monthly_expense || 0) / maxValue) * chartHeight : 0;

                return `
                    <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1;">
                        <div style="display: flex; gap: 2px; align-items: flex-end; height: ${chartHeight}px;">
                            <div style="width: 8px; height: ${Math.max(incomeHeight, 2)}px; background: linear-gradient(180deg, #7ED7C1, #5cb085); border-radius: 4px 4px 0 0;"></div>
                            <div style="width: 8px; height: ${Math.max(expenseHeight, 2)}px; background: linear-gradient(180deg, #FF8FAB, #FF6B9D); border-radius: 4px 4px 0 0;"></div>
                        </div>
                        <span style="font-size: 10px; color: var(--text-muted);">${d.month}月</span>
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

function changeStatsYear(delta) {
    currentStatsYear += delta;
    loadStatsData();
}

// ========== 导出Excel ==========

async function exportExcel() {
    try {
        showToast('正在生成Excel...');

        // 获取年度数据
        const statsRes = await API.Transaction.getYearlyStats(currentStatsYear);
        const trendRes = await API.Transaction.getYearlyMonthlyTrend(currentStatsYear);

        const stats = statsRes.data;
        const trend = trendRes.data;

        // 生成CSV格式（Excel可直接打开）
        let csv = '﻿'; // BOM for UTF-8
        csv += `${currentStatsYear}年度财务报表\n\n`;

        // 收支概况
        csv += '收支概况\n';
        csv += '项目,金额\n';
        csv += `总收入,${stats.totalIncome}\n`;
        csv += `总支出,${stats.totalExpense}\n`;
        csv += `结余,${stats.netProfit}\n\n`;

        // 支出分类
        csv += '支出分类明细\n';
        csv += '分类,金额,占比\n';
        stats.expenseByCategory?.forEach(cat => {
            const total = parseFloat(stats.totalExpense) || 1;
            const percent = ((parseFloat(cat.total) / total) * 100).toFixed(1);
            csv += `${cat.category_name},${cat.total},${percent}%\n`;
        });

        csv += '\n';

        // 收入分类
        csv += '收入分类明细\n';
        csv += '分类,金额,占比\n';
        stats.incomeByCategory?.forEach(cat => {
            const total = parseFloat(stats.totalIncome) || 1;
            const percent = ((parseFloat(cat.total) / total) * 100).toFixed(1);
            csv += `${cat.category_name},${cat.total},${percent}%\n`;
        });

        csv += '\n';

        // 月度趋势
        csv += '月度收支趋势\n';
        csv += '月份,收入,支出,结余\n';
        trend.forEach(m => {
            csv += `${m.month}月,${m.monthly_income},${m.monthly_expense},${m.monthly_profit}\n`;
        });

        // 下载
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `轻记账_${currentStatsYear}年统计.csv`;
        a.click();
        URL.revokeObjectURL(url);

        showToast('✨ Excel已导出');

    } catch (err) {
        console.error('导出失败:', err);
        showToast('导出失败');
    }
}

// ========== 客户管理 ==========

async function showCustomers() {
    switchTab('customers');
    await loadCustomersData();
}

async function loadCustomersData() {
    try {
        const res = await API.Customer.getList();
        const customers = res.data?.list || [];
        renderCustomers(customers);
    } catch (err) {
        const customers = storage.getCustomers();
        renderCustomers(customers);
    }
}

function renderCustomers(customers) {
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
                <div class="customer-debt ${customer.outstanding_amount > 0 ? 'unpaid' : 'paid'}">
                    ${customer.outstanding_amount > 0 ? `待收: ¥${formatMoney(customer.outstanding_amount)}` : '已结清 ✨'}
                </div>
            </div>
            <div class="customer-actions">
                <button class="action-btn-small secondary" onclick="editCustomer(${customer.id})">编辑</button>
                <button class="action-btn-small danger" onclick="deleteCustomer(${customer.id})">删除</button>
            </div>
        </div>
    `).join('');
}

async function showAddCustomer() {
    const name = prompt('请输入客户名称：');
    if (!name) return;

    const phone = prompt('请输入联系电话（可选）：') || '';
    const address = prompt('请输入地址（可选）：') || '';

    try {
        await API.Customer.create({ name, phone, address });
        showToast('✨ 客户已添加');
        await loadCustomersData();
    } catch (err) {
        storage.addCustomer({ name, phone, address });
        showToast('✨ 客户已添加');
        await loadCustomersData();
    }
}

async function editCustomer(id) {
    try {
        const res = await API.Customer.getById(id);
        const customer = res.data;

        const name = prompt('请输入客户名称：', customer.name);
        if (!name) return;

        const phone = prompt('请输入联系电话：', customer.phone || '') || '';
        const address = prompt('请输入地址：', customer.address || '') || '';

        await API.Customer.update(id, { name, phone, address });
        showToast('✨ 客户已更新');
        await loadCustomersData();
    } catch (err) {
        const customers = storage.getCustomers();
        const customer = customers.find(c => c.id == id);

        const name = prompt('请输入客户名称：', customer?.name || '');
        if (!name) return;

        const phone = prompt('请输入联系电话：', customer?.phone || '') || '';
        const address = prompt('请输入地址：', customer?.address || '') || '';

        storage.updateCustomer(id, { name, phone, address });
        showToast('✨ 客户已更新');
        await loadCustomersData();
    }
}

async function deleteCustomer(id) {
    showModal('确认删除', '确定要删除这个客户吗？', async () => {
        try {
            await API.Customer.delete(id);
        } catch (err) {
            storage.deleteCustomer(id);
        }
        showToast('✨ 客户已删除');
        await loadCustomersData();
    });
}

function searchCustomers() {
    const keyword = document.getElementById('customer-search').value.toLowerCase();
    const customers = storage.getCustomers();
    const filtered = keyword
        ? customers.filter(c => c.name.toLowerCase().includes(keyword))
        : customers;

    renderCustomers(filtered);
}

// ========== 供应商管理 ==========

async function showSuppliers() {
    switchTab('suppliers');
    await loadSuppliersData();
}

async function loadSuppliersData() {
    try {
        const res = await API.Supplier.getList();
        const suppliers = res.data?.list || [];
        renderSuppliers(suppliers);
    } catch (err) {
        const suppliers = storage.getSuppliers();
        renderSuppliers(suppliers);
    }
}

function renderSuppliers(suppliers) {
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
                <div class="supplier-total">累计采购: ¥${formatMoney(supplier.total_purchase || supplier.totalPurchase || 0)}</div>
            </div>
            <div class="supplier-actions">
                <button class="action-btn-small secondary" onclick="editSupplier(${supplier.id})">编辑</button>
                <button class="action-btn-small danger" onclick="deleteSupplier(${supplier.id})">删除</button>
            </div>
        </div>
    `).join('');
}

async function showAddSupplier() {
    const name = prompt('请输入供应商名称：');
    if (!name) return;

    const phone = prompt('请输入联系电话（可选）：') || '';
    const products = prompt('请输入主营商品（可选）：') || '';

    try {
        await API.Supplier.create({ name, phone, products });
        showToast('✨ 供应商已添加');
        await loadSuppliersData();
    } catch (err) {
        storage.addSupplier({ name, phone, products });
        showToast('✨ 供应商已添加');
        await loadSuppliersData();
    }
}

async function editSupplier(id) {
    try {
        const res = await API.Supplier.getById(id);
        const supplier = res.data;

        const name = prompt('请输入供应商名称：', supplier.name);
        if (!name) return;

        const phone = prompt('请输入联系电话：', supplier.phone || '') || '';
        const products = prompt('请输入主营商品：', supplier.products || '') || '';

        await API.Supplier.update(id, { name, phone, products });
        showToast('✨ 供应商已更新');
        await loadSuppliersData();
    } catch (err) {
        const suppliers = storage.getSuppliers();
        const supplier = suppliers.find(s => s.id == id);

        const name = prompt('请输入供应商名称：', supplier?.name || '');
        if (!name) return;

        const phone = prompt('请输入联系电话：', supplier?.phone || '') || '';
        const products = prompt('请输入主营商品：', supplier?.products || '') || '';

        storage.updateSupplier(id, { name, phone, products });
        showToast('✨ 供应商已更新');
        await loadSuppliersData();
    }
}

async function deleteSupplier(id) {
    showModal('确认删除', '确定要删除这个供应商吗？', async () => {
        try {
            await API.Supplier.delete(id);
        } catch (err) {
            storage.deleteSupplier(id);
        }
        showToast('✨ 供应商已删除');
        await loadSuppliersData();
    });
}

// ========== 分类管理 ==========

function showCategoryManage() {
    window.location.href = 'settings.html';
}

// ========== 数据导入导出 ==========

async function exportData() {
    try {
        const res = await API.Transaction.getList({ pageSize: 99999 });
        const transactions = res.data?.list || [];

        const data = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            transactions
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `轻记账备份_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        showToast('✨ 数据已导出');
    } catch (err) {
        // 降级到本地
        const data = storage.exportAllData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `轻记账备份_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        showToast('✨ 数据已导出');
    }
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

async function updateUserInfo() {
    try {
        const res = await API.Account.getProfile();
        const user = res.data;

        document.getElementById('user-name').textContent = user.nickname || user.username;

        // 更新头像
        const avatarEl = document.getElementById('user-avatar');
        if (avatarEl && user.avatar_url) {
            avatarEl.src = user.avatar_url;
        }

        // 计算记账天数
        const recordDays = user.recordDays || 0;
        document.getElementById('record-count').textContent = recordDays;

    } catch (err) {
        const settings = storage.getSettings();
        document.getElementById('user-name').textContent = settings.userName || '轻记账用户';
        document.getElementById('record-count').textContent = storage.getRecordDays();
    }
}

function showSettings() {
    window.location.href = 'settings.html';
}

function showAbout() {
    showToast('轻记账 v1.0.0 💕');
}

// ========== 欠款提醒 ==========

async function loadDebtReminder() {
    try {
        const res = await API.Transaction.getPending(2); // 待收
        const pending = res.data?.list || [];

        const container = document.getElementById('debt-reminder');
        const listContainer = document.getElementById('debt-list');

        // 按客户分组
        const customerDebts = {};
        pending.forEach(p => {
            if (p.counterparty) {
                if (!customerDebts[p.counterparty]) {
                    customerDebts[p.counterparty] = 0;
                }
                customerDebts[p.counterparty] += parseFloat(p.amount);
            }
        });

        const customers = Object.entries(customerDebts).slice(0, 3);

        if (customers.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'block';
        listContainer.innerHTML = customers.map(([name, amount]) => `
            <div class="debt-item">
                <div class="debt-info">
                    <div class="debt-avatar">👤</div>
                    <div class="debt-name">${name}</div>
                </div>
                <div class="debt-amount">¥${formatMoney(amount)}</div>
            </div>
        `).join('');

    } catch (err) {
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

// 切换明细月份
function changeDetailMonth(delta) {
    currentDetailMonth += delta;

    if (currentDetailMonth > 12) {
        currentDetailMonth = 1;
        currentDetailYear++;
    } else if (currentDetailMonth < 1) {
        currentDetailMonth = 12;
        currentDetailYear--;
    }

    // 更新显示
    document.getElementById('detail-current-month').textContent =
        `${currentDetailYear}年${currentDetailMonth}月`;

    // 重新加载数据
    loadRecordsData();
}
