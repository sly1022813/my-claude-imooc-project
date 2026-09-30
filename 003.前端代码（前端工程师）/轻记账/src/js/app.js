/**
 * 轻记账 - 主应用逻辑
 * 整合所有页面模块，统一管理路由和全局事件
 */

const App = {
  // 应用状态
  state: {
    currentPage: 'login',
    isLoading: false,
    user: null,
    filters: {
      recordsType: 'all',
      recordsCategory: '',
      recordsChannel: '',
      customerFilter: 'all',
      customerSearch: '',
      supplierFilter: 'all',
      supplierSearch: ''
    }
  },

  /**
   * 初始化应用
   */
  init() {
    // 初始化存储
    Storage.init();

    // 设置路由守卫
    Router.setGuard((path) => {
      if (path === 'login' || path === 'register') {
        if (Storage.isLoggedIn()) {
          Router.navigate('dashboard');
          return false;
        }
        return true;
      }

      if (!Storage.isLoggedIn()) {
        Router.navigate('login');
        return false;
      }

      return true;
    });

    // 注册路由
    this.registerRoutes();

    // 初始化路由
    Router.init();

    // 绑定全局事件
    this.bindGlobalEvents();
  },

  /**
   * 注册所有路由
   */
  registerRoutes() {
    Router.register('login', () => this.renderLoginPage());
    Router.register('register', () => this.renderRegisterPage());
    Router.register('dashboard', () => this.renderDashboardPage());
    Router.register('records', () => this.renderRecordsPage());
    Router.register('add', () => this.renderAddPage());
    Router.register('stats', () => this.renderStatsPage());
    Router.register('customers', () => this.renderCustomersPage());
    Router.register('suppliers', () => this.renderSuppliersPage());
    Router.register('settings', () => this.renderSettingsPage());
  },

  // ============ 页面渲染 ============

  /**
   * 渲染登录页
   */
  renderLoginPage() {
    this.state.currentPage = 'login';
    const container = document.getElementById('app');
    container.innerHTML = this.getLoginHTML();
    this.bindLoginEvents();
  },

  /**
   * 渲染注册页
   */
  renderRegisterPage() {
    this.state.currentPage = 'login';
    const container = document.getElementById('app');
    container.innerHTML = this.getLoginHTML();
    this.bindLoginEvents();
    this.showRegister();
  },

  /**
   * 渲染首页
   */
  renderDashboardPage() {
    this.state.currentPage = 'dashboard';
    const container = document.getElementById('app');
    container.innerHTML = this.getAppLayout('dashboard') + '<div id="app-toast" class="toast"></div>';

    const content = document.getElementById('page-content');
    content.innerHTML = this.getDashboardHTML();
    this.updateSidebarStats();
  },

  /**
   * 渲染收支明细页
   */
  renderRecordsPage() {
    this.state.currentPage = 'records';
    const container = document.getElementById('app');
    container.innerHTML = this.getAppLayout('records') + '<div id="app-toast" class="toast"></div>';

    const content = document.getElementById('page-content');
    content.innerHTML = this.getRecordsHTML();
    this.bindRecordsEvents();
  },

  /**
   * 渲染记一笔页
   */
  renderAddPage() {
    this.state.currentPage = 'add';
    const container = document.getElementById('app');
    const type = this.getUrlParam('type') || 'expense';
    container.innerHTML = this.getAppLayout('add') + '<div id="app-toast" class="toast"></div>';

    const content = document.getElementById('page-content');
    content.innerHTML = this.getAddHTML(type);
    this.bindAddRecordEvents();
  },

  /**
   * 渲染统计页
   */
  renderStatsPage() {
    this.state.currentPage = 'stats';
    const container = document.getElementById('app');
    container.innerHTML = this.getAppLayout('stats') + '<div id="app-toast" class="toast"></div>';

    const content = document.getElementById('page-content');
    content.innerHTML = this.getStatsHTML();
  },

  /**
   * 渲染客户页
   */
  renderCustomersPage() {
    this.state.currentPage = 'customers';
    const container = document.getElementById('app');
    container.innerHTML = this.getAppLayout('customers') + '<div id="app-toast" class="toast"></div>';

    const content = document.getElementById('page-content');
    content.innerHTML = this.getCustomersHTML();
    this.bindCustomersEvents();
  },

  /**
   * 渲染供应商页
   */
  renderSuppliersPage() {
    this.state.currentPage = 'suppliers';
    const container = document.getElementById('app');
    container.innerHTML = this.getAppLayout('suppliers') + '<div id="app-toast" class="toast"></div>';

    const content = document.getElementById('page-content');
    content.innerHTML = this.getSuppliersHTML();
    this.bindSuppliersEvents();
  },

  /**
   * 渲染设置页
   */
  renderSettingsPage() {
    this.state.currentPage = 'settings';
    const container = document.getElementById('app');
    container.innerHTML = this.getAppLayout('settings') + '<div id="app-toast" class="toast"></div>';

    const content = document.getElementById('page-content');
    content.innerHTML = this.getSettingsHTML();
  },

  // ============ HTML 模板 ============

  getLoginHTML() {
    return `
      <div class="min-h-screen bg-surface-cream flex flex-col">
        <header class="flex items-center justify-center py-8">
          <div class="flex items-center gap-2">
            <span class="text-2xl">💰</span>
            <span class="text-xl font-semibold text-primary tracking-tight">轻记账</span>
          </div>
        </header>
        <main class="flex-1 flex items-center justify-center px-6">
          <div class="w-full max-w-md">
            <div class="card p-8">
              <div class="segmented-control mb-6">
                <button class="segmented-item active" data-tab="login">账号登录</button>
                <button class="segmented-item" data-tab="register">免费注册</button>
              </div>
              <div id="section-login">
                <div class="mb-6">
                  <h2 class="text-xl font-bold text-on-surface">欢迎回来</h2>
                  <p class="text-sm text-text-muted mt-1">输入账本通行证，即刻开始今天的财务打理</p>
                </div>
                <form id="login-form" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-on-surface-variant mb-1">用户名</label>
                    <div class="relative">
                      <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">person</span>
                      <input type="text" id="login-username" class="input pl-10" placeholder="请输入用户名" required autocomplete="username">
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-on-surface-variant mb-1">账户密码</label>
                    <div class="relative">
                      <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">lock</span>
                      <input type="password" id="login-password" class="input pl-10 pr-10" placeholder="请输入密码" required autocomplete="current-password">
                      <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-on-surface" onclick="App.togglePasswordVisibility('login-password', this)">
                        <span class="material-symbols-outlined text-lg">visibility</span>
                      </button>
                    </div>
                  </div>
                  <div class="flex items-center justify-between text-sm">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" class="accent-primary">
                      <span class="text-text-secondary">7天内自动登录</span>
                    </label>
                    <a href="#" class="text-primary hover:underline" onclick="Utils.showToast('请联系管理员重置密码')">忘记密码？</a>
                  </div>
                  <button type="submit" class="btn btn-primary w-full h-11 mt-2">登 录</button>
                </form>
                <div class="mt-4 text-center">
                  <button onclick="App.showRegister()" class="text-sm text-primary hover:underline">还没有账号？立即注册</button>
                </div>
              </div>
              <div id="section-register" class="hidden">
                <div class="mb-6">
                  <h2 class="text-xl font-bold text-on-surface">创建新账本</h2>
                  <p class="text-sm text-text-muted mt-1">注册只需半分钟，开启井井有条的财务生活</p>
                </div>
                <form id="register-form" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-on-surface-variant mb-1">用户名</label>
                    <div class="relative">
                      <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">badge</span>
                      <input type="text" id="reg-username" class="input pl-10" placeholder="3-20位字母数字，字母开头" required>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-on-surface-variant mb-1">设置密码</label>
                    <div class="relative">
                      <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">lock</span>
                      <input type="password" id="reg-password" class="input pl-10 pr-10" placeholder="6-20位字符" required>
                      <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-on-surface" onclick="App.togglePasswordVisibility('reg-password', this)">
                        <span class="material-symbols-outlined text-lg">visibility</span>
                      </button>
                    </div>
                    <div class="mt-2">
                      <div class="flex gap-1 h-1.5 w-full bg-surface-cream rounded-full overflow-hidden">
                        <div id="strength-1" class="flex-1 rounded-full bg-gray-300"></div>
                        <div id="strength-2" class="flex-1 rounded-full bg-gray-300"></div>
                        <div id="strength-3" class="flex-1 rounded-full bg-gray-300"></div>
                      </div>
                      <p id="strength-text" class="text-xs text-text-muted mt-1">安全强度</p>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-on-surface-variant mb-1">确认密码</label>
                    <div class="relative">
                      <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">lock</span>
                      <input type="password" id="reg-confirm-password" class="input pl-10" placeholder="请再次输入相同密码" required>
                    </div>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-on-surface-variant mb-2">用户类型</label>
                    <div class="grid grid-cols-3 gap-2">
                      <button type="button" class="user-type-btn p-3 rounded-lg bg-surface-cream text-center transition-all border-2 border-transparent selected" data-type="personal">
                        <span class="material-symbols-outlined text-xl block">person</span>
                        <span class="text-xs mt-1 block">个人记账</span>
                      </button>
                      <button type="button" class="user-type-btn p-3 rounded-lg bg-surface-cream text-center transition-all border-2 border-transparent" data-type="merchant">
                        <span class="material-symbols-outlined text-xl block">store</span>
                        <span class="text-xs mt-1 block">个体商户</span>
                      </button>
                      <button type="button" class="user-type-btn p-3 rounded-lg bg-surface-cream text-center transition-all border-2 border-transparent" data-type="enterprise">
                        <span class="material-symbols-outlined text-xl block">domain</span>
                        <span class="text-xs mt-1 block">小微企业</span>
                      </button>
                    </div>
                  </div>
                  <button type="submit" class="btn btn-primary w-full h-11 mt-2">立即注册并进入系统</button>
                  <p class="text-xs text-text-muted text-center">注册即代表您同意《用户服务协议》与《隐私保护政策》</p>
                </form>
                <div class="mt-4 text-center">
                  <button onclick="App.showLogin()" class="text-sm text-primary hover:underline">已有账号？立即登录</button>
                </div>
              </div>
              <div class="mt-6 pt-4 border-t border-border-soft flex items-center justify-center gap-4 text-xs text-text-muted">
                <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm text-income-mint">lock</span>AES-256 数据加密</span>
                <span>·</span>
                <span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm text-income-mint">cloud_done</span>本地安全存储</span>
              </div>
            </div>
          </div>
        </main>
        <footer class="py-6 text-center text-xs text-text-muted">
          <a href="#" class="hover:text-primary">服务条款</a>
          <span class="mx-2">·</span>
          <a href="#" class="hover:text-primary">隐私权政策</a>
          <span class="mx-2">·</span>
          <span>轻记账 v1.0.1</span>
        </footer>
      </div>
    `;
  },

  getAppLayout(activePage) {
    const user = Storage.getUser();
    const stats = Storage.getStatistics();

    return `
      <div class="flex min-h-screen">
        <aside class="sidebar-nav hidden md:flex flex-col">
          <div class="flex items-center gap-2 mb-6">
            <span class="text-2xl">💰</span>
            <div class="flex flex-col">
              <span class="font-semibold text-primary tracking-tight">轻记账</span>
              <span class="text-xs text-text-secondary">${user?.userType === 'merchant' ? '商户财务工作台' : '个人财务管家'}</span>
            </div>
          </div>
          <nav class="space-y-1 flex-1">
            <a href="#dashboard" class="nav-item ${activePage === 'dashboard' ? 'active' : ''}"><span class="material-symbols-outlined">grid_view</span><span>首页概览</span></a>
            <a href="#records" class="nav-item ${activePage === 'records' ? 'active' : ''}"><span class="material-symbols-outlined">receipt_long</span><span>收支明细</span></a>
            <a href="#add" class="nav-item ${activePage === 'add' ? 'active' : ''}"><span class="material-symbols-outlined">edit_square</span><span>记一笔</span></a>
            <a href="#stats" class="nav-item ${activePage === 'stats' ? 'active' : ''}"><span class="material-symbols-outlined">analytics</span><span>统计分析</span></a>
            <a href="#customers" class="nav-item ${activePage === 'customers' ? 'active' : ''}"><span class="material-symbols-outlined">group</span><span>客户账本</span></a>
            <a href="#suppliers" class="nav-item ${activePage === 'suppliers' ? 'active' : ''}"><span class="material-symbols-outlined">local_shipping</span><span>供应商</span></a>
            <a href="#settings" class="nav-item ${activePage === 'settings' ? 'active' : ''}"><span class="material-symbols-outlined">settings</span><span>系统设置</span></a>
          </nav>
          <div class="card mt-auto">
            <div class="flex items-center justify-between text-sm text-text-secondary">
              <span>今日净收</span>
              <span class="w-2 h-2 rounded-full bg-income-mint"></span>
            </div>
            <div class="flex items-baseline justify-between mt-2">
              <span class="text-xs text-text-secondary">净结余</span>
              <span id="sidebar-balance" class="amount-md text-primary font-bold">¥${stats.balance >= 0 ? '+' : ''}${stats.balance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </aside>
        <main class="main-content flex-1">
          <header class="app-header -mx-4 -mt-4 mb-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4 flex-1 max-w-lg">
                <div class="relative flex-1">
                  <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg text-text-muted">search</span>
                  <input type="text" class="input pl-10 pr-4" placeholder="搜索订单号、备注...">
                </div>
                <div class="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-cream text-sm">
                  <span class="material-symbols-outlined text-base text-primary">calendar_today</span>
                  <span class="text-text-secondary">${Utils.formatDate(new Date(), 'full')}</span>
                </div>
              </div>
              <div class="flex items-center gap-4">
                <button class="btn btn-primary" onclick="Router.navigate('add')">
                  <span class="material-symbols-outlined">add</span>
                  <span class="hidden sm:inline">记一笔</span>
                </button>
                <div class="flex items-center gap-2 pl-2">
                  <div class="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center">
                    <span class="text-sm font-semibold text-on-secondary-container">${user?.username?.charAt(0).toUpperCase() || 'U'}</span>
                  </div>
                  <div class="hidden lg:flex flex-col">
                    <span class="text-sm font-semibold">${user?.username || '用户'}</span>
                    <span class="text-xs text-text-secondary">${user?.userType === 'merchant' ? '商户' : '个人'}</span>
                  </div>
                  <button id="logout-btn" class="ml-2 p-1 rounded hover:bg-surface-container text-text-muted" title="退出登录">
                    <span class="material-symbols-outlined text-lg">logout</span>
                  </button>
                </div>
              </div>
            </div>
          </header>
          <div id="page-content" class="page"></div>
        </main>
        <nav class="bottom-nav">
          <a href="#dashboard" class="bottom-nav-item ${activePage === 'dashboard' ? 'active' : ''}"><span class="material-symbols-outlined">grid_view</span><span>首页</span></a>
          <a href="#records" class="bottom-nav-item ${activePage === 'records' ? 'active' : ''}"><span class="material-symbols-outlined">receipt_long</span><span>明细</span></a>
          <a href="#add" class="bottom-nav-item ${activePage === 'add' ? 'active' : ''}"><span class="material-symbols-outlined">edit_square</span><span>记账</span></a>
          <a href="#stats" class="bottom-nav-item ${activePage === 'stats' ? 'active' : ''}"><span class="material-symbols-outlined">analytics</span><span>统计</span></a>
          <a href="#settings" class="bottom-nav-item ${activePage === 'settings' ? 'active' : ''}"><span class="material-symbols-outlined">settings</span><span>设置</span></a>
        </nav>
      </div>
    `;
  },

  getDashboardHTML() {
    const stats = Storage.getStatistics();
    const records = Storage.getRecords().slice(0, 5);
    const todayIncome = this.getTodayIncome();
    const todayExpense = this.getTodayExpense();

    return `
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div class="kpi-card primary">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-text-secondary flex items-center gap-1"><span class="material-symbols-outlined text-lg text-primary">savings</span>本月净利润</span>
            <span class="badge ${stats.balance >= 0 ? 'badge-income' : 'badge-expense'}">${stats.balance >= 0 ? '盈利中' : '亏损中'}</span>
          </div>
          <div class="amount-display text-primary font-bold tracking-tight">¥${stats.balance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</div>
        </div>
        <div class="kpi-card income">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-text-secondary flex items-center gap-1"><span class="material-symbols-outlined text-lg text-income-mint">arrow_circle_down</span>本月总收入</span>
            <span class="badge badge-primary">${stats.monthRecordCount} 笔</span>
          </div>
          <div class="amount-display text-income-mint font-bold tracking-tight">¥${stats.totalIncome.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</div>
        </div>
        <div class="kpi-card expense">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-text-secondary flex items-center gap-1"><span class="material-symbols-outlined text-lg text-expense-coral">arrow_circle_up</span>本月总支出</span>
            <span class="badge badge-expense">健康受控</span>
          </div>
          <div class="amount-display text-expense-coral font-bold tracking-tight">¥${stats.totalExpense.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</div>
        </div>
        <div class="kpi-card" style="background: var(--color-surface-cream);">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-semibold flex items-center gap-1"><span class="material-symbols-outlined text-lg text-primary">today</span>今日即时净收</span>
          </div>
          <div class="amount-display text-primary font-bold tracking-tight">${(todayIncome - todayExpense) >= 0 ? '+' : '-'}¥${Math.abs(todayIncome - todayExpense).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</div>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="card card-hover">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-expense-coral/15 text-expense-coral flex items-center justify-center"><span class="material-symbols-outlined text-2xl">shopping_cart_checkout</span></div>
              <div><h3 class="font-semibold">记支出</h3><p class="text-xs text-text-muted">进货 / 房租 / 物料</p></div>
            </div>
            <span class="badge badge-expense">快捷录入</span>
          </div>
          <button class="btn w-full bg-expense-coral text-white" onclick="Router.navigate('add?type=expense')"><span class="material-symbols-outlined">remove</span>记一笔支出</button>
        </div>
        <div class="card card-hover">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-income-mint/20 text-on-surface flex items-center justify-center"><span class="material-symbols-outlined text-2xl">point_of_sale</span></div>
              <div><h3 class="font-semibold">记收入</h3><p class="text-xs text-text-muted">营业收入 / 服务收费</p></div>
            </div>
            <span class="badge badge-income">扫码对账</span>
          </div>
          <button class="btn btn-primary w-full" onclick="Router.navigate('add?type=income')"><span class="material-symbols-outlined">add</span>记一笔收入</button>
        </div>
      </div>
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">最近记账记录</h2>
          <a href="#records" class="text-sm text-primary hover:underline flex items-center gap-1">查看全部<span class="material-symbols-outlined text-sm">chevron_right</span></a>
        </div>
        <div id="recent-records" class="space-y-2">
          ${records.length === 0 ? '<div class="empty-state py-8"><span class="material-symbols-outlined text-4xl text-text-muted">receipt_long</span><p class="font-medium mt-4">暂无记账记录</p><p class="text-sm text-text-muted mt-1">点击下方按钮开始记账</p></div>' :
            records.map(r => {
              const isIncome = r.type === 'income';
              return `<div class="transaction-item cursor-pointer" onclick="App.viewRecord('${r.id}')">
                <div class="w-10 h-10 rounded-full bg-surface-cream flex items-center justify-center text-lg">${r.categoryIcon || '💰'}</div>
                <div class="flex-1 min-w-0"><span class="font-medium block">${r.category}</span><span class="text-xs text-text-muted">${Utils.formatDate(r.createdAt, 'datetime')}</span></div>
                <span class="font-mono font-semibold ${isIncome ? 'text-income-mint' : 'text-expense-coral'}">${isIncome ? '+' : '-'}¥${parseFloat(r.amount).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</span>
              </div>`;
            }).join('')}
        </div>
        <button class="btn btn-secondary w-full mt-4" onclick="Router.navigate('add')"><span class="material-symbols-outlined">add</span>新增记账</button>
      </div>
    `;
  },

  getTodayIncome() {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return Storage.getRecords().filter(r => new Date(r.createdAt) >= today && r.type === 'income').reduce((sum, r) => sum + parseFloat(r.amount), 0);
  },

  getTodayExpense() {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return Storage.getRecords().filter(r => new Date(r.createdAt) >= today && r.type === 'expense').reduce((sum, r) => sum + parseFloat(r.amount), 0);
  },

  getRecordsHTML() {
    const records = Storage.getRecords();
    const stats = Storage.getStatistics();
    const categories = Storage.getCategories();

    return `
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 class="text-xl font-bold">收支明细流水</h1>
          <p class="text-sm text-text-secondary mt-1">查看与管理全部收支流水账目</p>
        </div>
        <div class="flex items-center gap-2">
          <button class="btn btn-ghost" onclick="App.exportRecords()"><span class="material-symbols-outlined">file_download</span>导出</button>
          <button class="btn btn-primary" onclick="Router.navigate('add')"><span class="material-symbols-outlined">add</span>记一笔</button>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="kpi-card expense"><div class="flex items-center justify-between"><span class="text-sm text-text-secondary">本月累计支出</span></div><div class="amount-lg text-expense-coral font-bold mt-2">-¥${stats.totalExpense.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</div></div>
        <div class="kpi-card income"><div class="flex items-center justify-between"><span class="text-sm text-text-secondary">本月累计收入</span></div><div class="amount-lg text-income-mint font-bold mt-2">+¥${stats.totalIncome.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</div></div>
        <div class="kpi-card primary"><div class="flex items-center justify-between"><span class="text-sm font-semibold">本期净利润</span></div><div class="amount-lg text-primary font-bold mt-2">¥${stats.balance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</div></div>
      </div>
      <div class="card mb-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div class="segmented-control" id="records-filter">
            <button class="segmented-item active" data-filter="all">全部</button>
            <button class="segmented-item" data-filter="expense">支出</button>
            <button class="segmented-item" data-filter="income">收入</button>
          </div>
          <div class="flex items-center gap-4">
            <select id="category-filter" class="input w-auto"><option value="">全部分类</option>${[...categories.expense, ...categories.income].map(c => `<option value="${c.id}">${c.icon} ${c.name}</option>`).join('')}</select>
            <select id="channel-filter" class="input w-auto"><option value="">全部渠道</option><option value="wechat">微信</option><option value="alipay">支付宝</option><option value="cash">现金</option></select>
          </div>
        </div>
      </div>
      <div class="card">
        <div id="records-list">
          ${records.length === 0 ? '<div class="empty-state py-8"><span class="material-symbols-outlined text-4xl text-text-muted">receipt_long</span><p class="font-medium mt-4">暂无收支记录</p></div>' :
            records.map(r => this.getRecordItemHTML(r)).join('')
          }
        </div>
      </div>
    `;
  },

  getRecordItemHTML(record) {
    const isIncome = record.type === 'income';
    const channelLabels = { wechat: '微信', alipay: '支付宝', cash: '现金', bank: '银行卡' };
    return `<div class="p-4 hover:bg-surface-cream/50 transition-colors flex items-center gap-4 cursor-pointer" onclick="App.viewRecord('${record.id}')">
      <div class="w-12 h-12 rounded-full bg-surface-cream flex items-center justify-center text-xl">${record.categoryIcon || '💰'}</div>
      <div class="flex-1 min-w-0"><div class="font-medium">${record.category}</div><div class="text-sm text-text-muted">${record.note || '无备注'} · ${channelLabels[record.channel] || '微信'}</div></div>
      <div class="text-right"><div class="font-mono font-semibold ${isIncome ? 'text-income-mint' : 'text-expense-coral'}">${isIncome ? '+' : '-'}¥${parseFloat(record.amount).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</div></div>
    </div>`;
  },

  getAddHTML(initialType = 'expense') {
    const categories = Storage.getCategories();
    const cats = categories[initialType] || [];
    const channelLabels = { wechat: '💬 微信支付', alipay: '💙 支付宝', cash: '💵 现金', bank: '🏦 银行卡' };

    return `
      <div class="mb-6"><h1 class="text-xl font-bold">记一笔账目</h1><p class="text-sm text-text-secondary mt-1">支持快速录入支出与营业收入</p></div>
      <form id="add-record-form" class="space-y-6">
        <div class="segmented-control max-w-md" id="type-toggle">
          <button type="button" class="segmented-item ${initialType === 'expense' ? 'active' : ''}" data-type="expense">记支出 💸</button>
          <button type="button" class="segmented-item ${initialType === 'income' ? 'active' : ''}" data-type="income">记收入 💰</button>
        </div>
        <div class="card">
          <div class="flex items-baseline gap-2 pb-4 border-b border-border-soft">
            <span id="currency-symbol" class="text-2xl font-bold ${initialType === 'income' ? 'text-income-mint' : 'text-expense-coral'}">¥</span>
            <input type="text" id="amount-input" class="flex-1 text-3xl font-mono font-bold bg-transparent outline-none" placeholder="0.00" value="0.00">
          </div>
          <div class="flex flex-wrap gap-2 pt-4">
            <span class="text-xs text-text-secondary mr-1">快捷:</span>
            ${[50, 100, 200, 500, 1000].map(a => `<button type="button" class="category-chip" data-amount="${a}">${a.toLocaleString()}</button>`).join('')}
          </div>
        </div>
        <div class="card">
          <div class="flex items-center justify-between mb-4"><h2 class="font-semibold">分类</h2><span class="text-sm text-text-secondary">当前: <strong class="text-primary" id="active-cat-label">${cats[0]?.name || ''}</strong></span></div>
          <div id="category-grid" class="grid grid-cols-2 sm:grid-cols-5 gap-2">
            ${cats.map((cat, i) => `<button type="button" class="category-btn flex flex-col items-center justify-center p-3 rounded-lg transition-all ${i === 0 ? 'selected bg-secondary-container text-on-secondary-container' : 'bg-surface-cream hover:bg-surface-container'}" data-category="${cat.name}" data-category-id="${cat.id}" data-icon="${cat.icon}" data-type="${initialType}">
              <span class="text-2xl mb-1">${cat.icon}</span><span class="text-sm font-medium">${cat.name}</span>
            </button>`).join('')}
          </div>
        </div>
        <div class="card">
          <h2 class="font-semibold mb-4">明细</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">日期</label>
              <div class="flex items-center gap-2 bg-surface-cream rounded-lg p-1">
                <button type="button" class="date-btn flex-1 py-1.5 rounded-lg bg-surface-card text-primary font-semibold text-sm shadow-xs">今天</button>
                <button type="button" class="date-btn flex-1 py-1.5 rounded-lg text-text-secondary text-sm">昨天</button>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">渠道</label>
              <select id="payment-channel" class="input">${Object.entries(channelLabels).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium mb-2">备注</label>
              <textarea id="note-input" class="input resize-none" rows="2" placeholder="备注信息..."></textarea>
            </div>
          </div>
        </div>
        <div class="card">
          <h2 class="font-semibold mb-4">预览</h2>
          <div id="preview-card" class="bg-surface-cream rounded-lg p-4">
            <div class="flex justify-between items-baseline">
              <span id="preview-category" class="font-semibold flex items-center gap-1"><span>${cats[0]?.icon || '📦'}</span> ${cats[0]?.name || ''}</span>
              <span id="preview-amount" class="amount-lg ${initialType === 'income' ? 'text-income-mint' : 'text-expense-coral'} font-bold">¥0.00</span>
            </div>
          </div>
        </div>
        <button type="submit" class="btn ${initialType === 'income' ? 'bg-income-mint text-white' : 'btn-primary'} w-full h-12 text-lg"><span class="material-symbols-outlined">save</span>保存账目</button>
      </form>
    `;
  },

  getStatsHTML() {
    const stats = Storage.getStatistics();
    const records = Storage.getRecords();
    const expenseByCategory = {};
    records.filter(r => r.type === 'expense').forEach(r => { expenseByCategory[r.category] = (expenseByCategory[r.category] || 0) + parseFloat(r.amount); });

    return `
      <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-lg bg-surface-cream flex items-center justify-center"><span class="material-symbols-outlined text-2xl text-primary">analytics</span></div>
          <div><h1 class="text-xl font-bold">财务统计分析</h1><p class="text-sm text-text-secondary">多维收支诊断与经营预测</p></div>
        </div>
        <div class="flex items-center gap-2">
          <button class="btn btn-primary" onclick="App.exportReport()"><span class="material-symbols-outlined">file_download</span>导出报表</button>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div class="kpi-card primary"><span class="text-sm text-text-secondary">本月净利润</span><div class="amount-display text-primary font-bold mt-2">¥${stats.balance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</div></div>
        <div class="kpi-card income"><span class="text-sm text-text-secondary">总营业收入</span><div class="amount-display text-income-mint font-bold mt-2">+¥${stats.totalIncome.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</div></div>
        <div class="kpi-card expense"><span class="text-sm text-text-secondary">本月总支出</span><div class="amount-display text-expense-coral font-bold mt-2">-¥${stats.totalExpense.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</div></div>
        <div class="kpi-card"><span class="text-sm text-text-secondary">记录总笔数</span><div class="amount-display text-on-surface font-bold mt-2">${stats.totalRecordCount}</div></div>
      </div>
      <div class="card mb-6">
        <h2 class="font-semibold mb-4">支出分类分析</h2>
        <div class="space-y-3">
          ${Object.entries(expenseByCategory).length === 0 ? '<p class="text-sm text-text-muted text-center py-4">暂无数据</p>' :
            Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]).map(([name, amount]) => {
              const percent = stats.totalExpense > 0 ? ((amount / stats.totalExpense) * 100).toFixed(1) : 0;
              return `<div class="flex items-center gap-3"><div class="flex-1"><div class="flex justify-between text-sm mb-1"><span>${name}</span><span class="font-mono">¥${amount.toLocaleString()}</span></div><div class="progress-bar"><div class="progress-fill" style="width: ${percent}%; background: #FF6B6B"></div></div></div><span class="text-xs text-text-muted w-12 text-right">${percent}%</span></div>`;
            }).join('')}
        </div>
      </div>
      <div class="card">
        <div class="flex items-start gap-3 p-4 bg-surface-cream rounded-lg">
          <div class="w-10 h-10 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center"><span class="material-symbols-outlined">auto_awesome</span></div>
          <div><p class="font-semibold text-primary">AI 经营简评</p><p class="text-sm text-text-secondary mt-1">${records.length === 0 ? '开始记录收支，系统将为您生成分析报告。' : `您的账本已有 ${stats.totalRecordCount} 笔记录，收入 ¥${stats.totalIncome.toLocaleString()}，支出 ¥${stats.totalExpense.toLocaleString()}，净利润 ¥${stats.balance.toLocaleString()}。`}</p></div>
        </div>
      </div>
    `;
  },

  getCustomersHTML() {
    const customers = Storage.getCustomers();
    return `
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div><h1 class="text-xl font-bold">客户账本</h1><p class="text-sm text-text-secondary mt-1">管理客户档案与应收账款</p></div>
        <div class="flex items-center gap-2">
          <button class="btn btn-primary" onclick="App.showAddCustomerModal()"><span class="material-symbols-outlined">person_add</span>新建客户</button>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="kpi-card"><span class="text-sm text-text-secondary">客户总数</span><div class="amount-display text-on-surface font-bold mt-2">${customers.length}</div></div>
        <div class="kpi-card expense"><span class="text-sm text-text-secondary">应收账款</span><div class="amount-display text-expense-coral font-bold mt-2">¥${customers.reduce((s, c) => s + (c.balance || 0), 0).toLocaleString()}</div></div>
        <div class="kpi-card income"><span class="text-sm text-text-secondary">已结清</span><div class="amount-display text-income-mint font-bold mt-2">${customers.filter(c => (c.balance || 0) <= 0).length}</div></div>
      </div>
      <div class="card">
        <div id="customer-list">
          ${customers.length === 0 ? '<div class="empty-state py-8"><span class="material-symbols-outlined text-4xl text-text-muted">group</span><p class="font-medium mt-4">暂无客户</p><p class="text-sm text-text-muted mt-1">点击上方按钮添加</p></div>' :
            `<table class="data-table"><thead><tr><th>客户名称</th><th>联系方式</th><th>当前余额</th><th>操作</th></tr></thead><tbody>
              ${customers.map(c => `<tr><td><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center">${c.name?.charAt(0) || '?'}</div><span class="font-medium">${c.name}</span></div></td><td>${c.phone || '-'}</td><td class="font-mono ${(c.balance || 0) > 0 ? 'text-expense-coral' : 'text-income-mint'}">${(c.balance || 0) > 0 ? '+' : ''}¥${(c.balance || 0).toLocaleString()}</td><td><div class="flex gap-2"><button class="btn btn-ghost text-sm" onclick="App.editCustomer('${c.id}')">编辑</button><button class="btn btn-ghost text-sm text-expense-coral" onclick="App.deleteCustomer('${c.id}')">删除</button></div></td></tr>`).join('')}
            </tbody></table>`
          }
        </div>
      </div>
    `;
  },

  getSuppliersHTML() {
    const suppliers = Storage.getSuppliers();
    return `
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div><h1 class="text-xl font-bold">供应商管理</h1><p class="text-sm text-text-secondary mt-1">管理供应商档案与采购对账</p></div>
        <div class="flex items-center gap-2">
          <button class="btn btn-primary" onclick="App.showAddSupplierModal()"><span class="material-symbols-outlined">add_business</span>新建供应商</button>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="kpi-card"><span class="text-sm text-text-secondary">供应商总数</span><div class="amount-display text-on-surface font-bold mt-2">${suppliers.length}</div></div>
        <div class="kpi-card expense"><span class="text-sm text-text-secondary">应付账款</span><div class="amount-display text-expense-coral font-bold mt-2">¥${suppliers.reduce((s, s2) => s + (s2.balance || 0), 0).toLocaleString()}</div></div>
        <div class="kpi-card"><span class="text-sm text-text-secondary">本月采购</span><div class="amount-display text-on-surface font-bold mt-2">¥0</div></div>
      </div>
      <div class="card">
        <div id="supplier-list">
          ${suppliers.length === 0 ? '<div class="empty-state py-8"><span class="material-symbols-outlined text-4xl text-text-muted">local_shipping</span><p class="font-medium mt-4">暂无供应商</p><p class="text-sm text-text-muted mt-1">点击上方按钮添加</p></div>' :
            `<table class="data-table"><thead><tr><th>供应商名称</th><th>联系方式</th><th>主营商品</th><th>当前余额</th><th>操作</th></tr></thead><tbody>
              ${suppliers.map(s => `<tr><td><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center">${s.name?.charAt(0) || '?'}</div><span class="font-medium">${s.name}</span></div></td><td>${s.phone || '-'}</td><td>${s.products || '-'}</td><td class="font-mono text-pending">¥${(s.balance || 0).toLocaleString()}</td><td><div class="flex gap-2"><button class="btn btn-ghost text-sm" onclick="App.editSupplier('${s.id}')">编辑</button><button class="btn btn-ghost text-sm text-expense-coral" onclick="App.deleteSupplier('${s.id}')">删除</button></div></td></tr>`).join('')}
            </tbody></table>`
          }
        </div>
      </div>
    `;
  },

  getSettingsHTML() {
    const settings = Storage.getSettings();
    const user = Storage.getUser();
    const categories = Storage.getCategories();
    const totalRecords = Storage.getRecords().length;

    return `
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div><h1 class="text-xl font-bold">系统设置</h1><p class="text-sm text-text-secondary mt-1">管理应用配置与数据</p></div>
        <div class="flex items-center gap-2">
          <button class="btn btn-primary" onclick="App.saveSettings()"><span class="material-symbols-outlined">done_all</span>保存设置</button>
        </div>
      </div>
      <div class="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div class="xl:col-span-3">
          <div class="card sticky top-20">
            <nav class="space-y-1">
              <a href="#" class="nav-item active">基本设置</a>
              <a href="#" class="nav-item">分类管理</a>
              <a href="#" class="nav-item">数据备份</a>
              <a href="#" class="nav-item">账户安全</a>
            </nav>
            <div class="mt-6 p-4 bg-surface-cream rounded-lg text-sm">
              <p class="font-semibold text-primary mb-1">轻记账 v1.0.1</p>
              <p class="text-text-secondary text-xs">共 ${totalRecords} 笔记录</p>
            </div>
          </div>
        </div>
        <div class="xl:col-span-9 space-y-6">
          <div class="card">
            <h2 class="font-semibold mb-4">基本信息</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label class="block text-sm font-medium mb-1">店铺名称</label><input type="text" id="setting-shop-name" class="input" placeholder="请输入" value="${settings.shopName || ''}"></div>
              <div><label class="block text-sm font-medium mb-1">联系手机</label><input type="tel" id="setting-phone" class="input" placeholder="请输入" value="${settings.phone || ''}"></div>
            </div>
          </div>
          <div class="card">
            <h2 class="font-semibold mb-4">收支分类</h2>
            <div class="mb-4">
              <h3 class="text-sm font-medium text-expense-coral mb-2">支出分类</h3>
              <div class="flex flex-wrap gap-2">${categories.expense.map(c => `<span class="category-chip selected">${c.icon} ${c.name}</span>`).join('')}</div>
            </div>
            <div>
              <h3 class="text-sm font-medium text-income-mint mb-2">收入分类</h3>
              <div class="flex flex-wrap gap-2">${categories.income.map(c => `<span class="category-chip selected">${c.icon} ${c.name}</span>`).join('')}</div>
            </div>
          </div>
          <div class="card">
            <h2 class="font-semibold mb-4">数据管理</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 bg-surface rounded-lg"><h3 class="font-semibold mb-2">导出备份</h3><p class="text-xs text-text-secondary mb-3">导出所有数据为JSON</p><button class="btn btn-secondary w-full" onclick="App.exportData()"><span class="material-symbols-outlined">download</span>导出数据</button></div>
              <div class="p-4 bg-surface rounded-lg"><h3 class="font-semibold mb-2">导入恢复</h3><p class="text-xs text-text-secondary mb-3">从JSON文件恢复</p><label class="btn btn-secondary w-full cursor-pointer"><span class="material-symbols-outlined">upload</span>选择文件<input type="file" accept=".json" class="hidden" onchange="App.importData(this)"></label></div>
            </div>
          </div>
          <div class="card">
            <h2 class="font-semibold mb-4">账户信息</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label class="block text-sm font-medium mb-1">用户名</label><div class="input bg-surface flex items-center gap-2"><span class="material-symbols-outlined text-text-muted">badge</span>${user?.username || '未登录'}</div></div>
              <div><label class="block text-sm font-medium mb-1">账户类型</label><div class="input bg-surface">${user?.userType === 'merchant' ? '个体商户' : user?.userType === 'enterprise' ? '小微企业' : '个人'}</div></div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // ============ 事件绑定 ============

  bindGlobalEvents() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('#logout-btn')) this.logout();
    });
  },

  bindLoginEvents() {
    // Tab switch
    document.querySelectorAll('.segmented-item').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.segmented-item').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const isLogin = tab.dataset.tab === 'login';
        document.getElementById('section-login').classList.toggle('hidden', !isLogin);
        document.getElementById('section-register').classList.toggle('hidden', isLogin);
      });
    });

    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const result = Storage.login(
          document.getElementById('login-username').value,
          document.getElementById('login-password').value
        );
        if (result.success) {
          Utils.showToast('登录成功');
          Router.navigate('dashboard');
        } else {
          Utils.showToast(result.message);
        }
      });
    }

    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      let selectedUserType = 'personal';
      document.querySelectorAll('.user-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.user-type-btn').forEach(b => { b.classList.remove('selected', 'border-primary'); b.classList.add('border-transparent'); });
          btn.classList.add('selected', 'border-primary');
          btn.classList.remove('border-transparent');
          selectedUserType = btn.dataset.type;
        });
      });

      const passwordInput = document.getElementById('reg-password');
      if (passwordInput) {
        passwordInput.addEventListener('input', () => {
          const result = Utils.validatePassword(passwordInput.value);
          const levels = { weak: 1, medium: 2, strong: 3 };
          const colors = { weak: 'bg-expense-coral', medium: 'bg-pending-amber', strong: 'bg-income-mint' };
          const level = levels[result.strength] || 0;
          ['strength-1', 'strength-2', 'strength-3'].forEach((id, i) => {
            document.getElementById(id).className = `flex-1 rounded-full ${level > i ? colors[result.strength] : 'bg-gray-300'}`;
          });
          document.getElementById('strength-text').textContent = result.message;
        });
      }

      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;

        const usernameResult = Utils.validateUsername(username);
        if (!usernameResult.valid) { Utils.showToast(usernameResult.message); return; }
        if (password !== confirmPassword) { Utils.showToast('两次输入的密码不一致'); return; }

        const result = Storage.register(username, password, selectedUserType);
        if (result.success) {
          Utils.showToast('注册成功');
          Router.navigate('dashboard');
        } else {
          Utils.showToast(result.message);
        }
      });
    }
  },

  bindRecordsEvents() {
    document.querySelectorAll('#records-filter .segmented-item').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#records-filter .segmented-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.filterRecords(btn.dataset.filter);
      });
    });
  },

  bindAddRecordEvents() {
    let currentType = document.querySelector('#type-toggle .segmented-item.active')?.dataset.type || 'expense';
    let currentCategory = document.querySelector('.category-btn')?.dataset.category || '进货成本';
    let currentIcon = document.querySelector('.category-btn')?.dataset.icon || '📦';

    document.querySelectorAll('#type-toggle .segmented-item').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#type-toggle .segmented-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentType = btn.dataset.type;
        this.updateAddPageCategories(currentType);
        const isIncome = currentType === 'income';
        document.getElementById('currency-symbol').className = `text-2xl font-bold ${isIncome ? 'text-income-mint' : 'text-expense-coral'}`;
        document.querySelector('#add-record-form button[type="submit"]').className = `btn ${isIncome ? 'bg-income-mint text-white' : 'btn-primary'} w-full h-12 text-lg`;
      });
    });

    this.bindCategoryEvents();

    document.querySelectorAll('[data-amount]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('amount-input').value = parseFloat(btn.dataset.amount).toFixed(2);
        this.updatePreview();
      });
    });

    document.getElementById('amount-input')?.addEventListener('input', () => this.updatePreview());

    document.getElementById('add-record-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = parseFloat(document.getElementById('amount-input').value) || 0;
      if (amount <= 0) { Utils.showToast('请输入有效金额'); return; }

      Storage.addRecord({
        id: Utils.generateId(),
        type: currentType,
        amount,
        category: currentCategory,
        categoryId: document.querySelector('.category-btn.selected')?.dataset.categoryId || '',
        categoryIcon: currentIcon,
        channel: document.getElementById('payment-channel')?.value || 'wechat',
        note: document.getElementById('note-input')?.value || '',
        createdAt: new Date().toISOString()
      });

      Utils.showToast('记账成功');
      document.getElementById('amount-input').value = '0.00';
      document.getElementById('note-input').value = '';
      this.updatePreview();
    });
  },

  bindCategoryEvents() {
    document.querySelectorAll('.category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.category-btn').forEach(b => { b.classList.remove('selected', 'bg-secondary-container', 'text-on-secondary-container'); b.classList.add('bg-surface-cream'); });
        btn.classList.add('selected', 'bg-secondary-container', 'text-on-secondary-container');
        btn.classList.remove('bg-surface-cream');
        document.getElementById('active-cat-label').textContent = btn.dataset.category;
        this.updatePreview();
      });
    });
  },

  updateAddPageCategories(type) {
    const categories = Storage.getCategories();
    const cats = categories[type] || [];
    const grid = document.getElementById('category-grid');
    if (grid) {
      grid.innerHTML = cats.map((cat, i) => `<button type="button" class="category-btn flex flex-col items-center justify-center p-3 rounded-lg transition-all ${i === 0 ? 'selected bg-secondary-container text-on-secondary-container' : 'bg-surface-cream hover:bg-surface-container'}" data-category="${cat.name}" data-category-id="${cat.id}" data-icon="${cat.icon}" data-type="${type}"><span class="text-2xl mb-1">${cat.icon}</span><span class="text-sm font-medium">${cat.name}</span></button>`).join('');
      this.bindCategoryEvents();
      if (cats[0]) {
        document.getElementById('active-cat-label').textContent = cats[0].name;
        document.getElementById('preview-category').innerHTML = `<span>${cats[0].icon}</span> ${cats[0].name}`;
      }
    }
  },

  bindCustomersEvents() {},
  bindSuppliersEvents() {},

  // ============ 全局方法 ============

  getUrlParam(name) {
    const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
    return params.get(name);
  },

  updateSidebarStats() {
    const stats = Storage.getStatistics();
    const sidebarBalance = document.getElementById('sidebar-balance');
    if (sidebarBalance) sidebarBalance.textContent = `¥${stats.balance >= 0 ? '+' : ''}${stats.balance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`;
  },

  updatePreview() {
    const amount = parseFloat(document.getElementById('amount-input')?.value) || 0;
    const type = document.querySelector('#type-toggle .segmented-item.active')?.dataset.type || 'expense';
    const category = document.querySelector('.category-btn.selected');
    const isIncome = type === 'income';

    const previewAmount = document.getElementById('preview-amount');
    if (previewAmount) {
      previewAmount.textContent = `¥${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`;
      previewAmount.className = `amount-lg ${isIncome ? 'text-income-mint' : 'text-expense-coral'} font-bold`;
    }
    if (category) {
      document.getElementById('preview-category').innerHTML = `<span>${category.dataset.icon}</span> ${category.dataset.category}`;
    }
  },

  togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('.material-symbols-outlined');
    if (input && icon) {
      input.type = input.type === 'password' ? 'text' : 'password';
      icon.textContent = input.type === 'password' ? 'visibility' : 'visibility_off';
    }
  },

  showLogin() {
    document.querySelectorAll('.segmented-item').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.segmented-item')[0].classList.add('active');
    document.getElementById('section-login').classList.remove('hidden');
    document.getElementById('section-register').classList.add('hidden');
  },

  showRegister() {
    document.querySelectorAll('.segmented-item').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.segmented-item')[1].classList.add('active');
    document.getElementById('section-login').classList.add('hidden');
    document.getElementById('section-register').classList.remove('hidden');
  },

  logout() {
    Storage.clearUser();
    Utils.showToast('已退出登录');
    Router.navigate('login');
  },

  filterRecords(type) {
    let records = Storage.getRecords();
    if (type !== 'all') records = records.filter(r => r.type === type);
    const container = document.getElementById('records-list');
    if (container) container.innerHTML = records.length === 0 ? '<div class="empty-state py-8"><p class="text-text-muted">暂无记录</p></div>' : records.map(r => this.getRecordItemHTML(r)).join('');
  },

  viewRecord(id) {
    const record = Storage.getRecords().find(r => r.id === id);
    if (record) Utils.showToast(`${record.category}: ¥${parseFloat(record.amount).toLocaleString()}`);
  },

  exportRecords() {
    const records = Storage.getRecords();
    const csv = ['日期,类型,分类,金额,渠道,备注'].concat(records.map(r => [Utils.formatDate(r.createdAt, 'datetime'), r.type === 'income' ? '收入' : '支出', r.category, r.amount, r.channel, `"${r.note || ''}"`].join(','))).join('\n');
    this.downloadFile(csv, `收支记录_${Utils.formatDate(new Date(), 'date')}.csv`, 'text/csv');
    Utils.showToast('导出成功');
  },

  exportReport() {
    const stats = Storage.getStatistics();
    const report = `轻记账财务报告\n生成时间: ${Utils.formatDate(new Date(), 'full')}\n\n本月总收入: ¥${stats.totalIncome.toLocaleString()}\n本月总支出: ¥${stats.totalExpense.toLocaleString()}\n本月净利润: ¥${stats.balance.toLocaleString()}\n`;
    this.downloadFile(report, `财务报表_${Utils.formatDate(new Date(), 'date')}.txt`, 'text/plain');
    Utils.showToast('报表导出成功');
  },

  showAddCustomerModal(customer = null) {
    const modal = document.createElement('div');
    modal.id = 'modal-container';
    modal.innerHTML = `<div class="modal-overlay show"><div class="modal"><h3 class="text-lg font-semibold mb-4">${customer ? '编辑客户' : '新建客户'}</h3><form class="space-y-4"><div><label class="block text-sm font-medium mb-1">名称</label><input type="text" id="customer-name" class="input" value="${customer?.name || ''}" required></div><div><label class="block text-sm font-medium mb-1">电话</label><input type="tel" id="customer-phone" class="input" value="${customer?.phone || ''}"></div><div><label class="block text-sm font-medium mb-1">地址</label><input type="text" id="customer-address" class="input" value="${customer?.address || ''}"></div><div><label class="block text-sm font-medium mb-1">余额</label><input type="number" id="customer-balance" class="input" value="${customer?.balance || 0}"></div><input type="hidden" id="customer-id" value="${customer?.id || ''}"><div class="flex gap-3 justify-end pt-2"><button type="button" class="btn btn-ghost" onclick="App.closeModal()">取消</button><button type="submit" class="btn btn-primary">保存</button></div></form></div></div>`;
    document.body.appendChild(modal);
    modal.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      const data = { name: document.getElementById('customer-name').value, phone: document.getElementById('customer-phone').value, address: document.getElementById('customer-address').value, balance: parseFloat(document.getElementById('customer-balance').value) || 0 };
      if (!data.name) { Utils.showToast('请输入名称'); return; }
      const id = document.getElementById('customer-id').value;
      if (id) Storage.updateCustomer(id, data); else Storage.addCustomer(data);
      Utils.showToast('保存成功');
      this.closeModal();
      Router.navigate('customers');
    });
  },

  editCustomer(id) {
    const customer = Storage.getCustomers().find(c => c.id === id);
    if (customer) this.showAddCustomerModal(customer);
  },

  deleteCustomer(id) {
    if (confirm('确定删除该客户吗？')) {
      Storage.deleteCustomer(id);
      Utils.showToast('已删除');
      Router.navigate('customers');
    }
  },

  showAddSupplierModal(supplier = null) {
    const modal = document.createElement('div');
    modal.id = 'modal-container';
    modal.innerHTML = `<div class="modal-overlay show"><div class="modal"><h3 class="text-lg font-semibold mb-4">${supplier ? '编辑供应商' : '新建供应商'}</h3><form class="space-y-4"><div><label class="block text-sm font-medium mb-1">名称</label><input type="text" id="supplier-name" class="input" value="${supplier?.name || ''}" required></div><div><label class="block text-sm font-medium mb-1">电话</label><input type="tel" id="supplier-phone" class="input" value="${supplier?.phone || ''}"></div><div><label class="block text-sm font-medium mb-1">主营商品</label><input type="text" id="supplier-products" class="input" value="${supplier?.products || ''}"></div><div><label class="block text-sm font-medium mb-1">余额</label><input type="number" id="supplier-balance" class="input" value="${supplier?.balance || 0}"></div><input type="hidden" id="supplier-id" value="${supplier?.id || ''}"><div class="flex gap-3 justify-end pt-2"><button type="button" class="btn btn-ghost" onclick="App.closeModal()">取消</button><button type="submit" class="btn btn-primary">保存</button></div></form></div></div>`;
    document.body.appendChild(modal);
    modal.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault();
      const data = { name: document.getElementById('supplier-name').value, phone: document.getElementById('supplier-phone').value, products: document.getElementById('supplier-products').value, balance: parseFloat(document.getElementById('supplier-balance').value) || 0 };
      if (!data.name) { Utils.showToast('请输入名称'); return; }
      const id = document.getElementById('supplier-id').value;
      if (id) Storage.updateSupplier(id, data); else Storage.addSupplier(data);
      Utils.showToast('保存成功');
      this.closeModal();
      Router.navigate('suppliers');
    });
  },

  editSupplier(id) {
    const supplier = Storage.getSuppliers().find(s => s.id === id);
    if (supplier) this.showAddSupplierModal(supplier);
  },

  deleteSupplier(id) {
    if (confirm('确定删除该供应商吗？')) {
      Storage.deleteSupplier(id);
      Utils.showToast('已删除');
      Router.navigate('suppliers');
    }
  },

  saveSettings() {
    const settings = {
      shopName: document.getElementById('setting-shop-name')?.value || '',
      phone: document.getElementById('setting-phone')?.value || ''
    };
    Storage.setSettings({ ...Storage.getSettings(), ...settings });
    Utils.showToast('设置已保存');
  },

  exportData() {
    const data = Storage.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `轻记账备份_${Utils.formatDate(new Date(), 'date')}.json`;
    a.click();
    Utils.showToast('数据导出成功');
  },

  importData(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const result = Storage.importData(data);
        Utils.showToast(result.message);
        if (result.success) Router.navigate('dashboard');
      } catch { Utils.showToast('文件格式错误'); }
    };
    reader.readAsText(file);
  },

  closeModal() {
    document.getElementById('modal-container')?.remove();
  },

  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
  }
};

// 初始化
document.addEventListener('DOMContentLoaded', () => App.init());
window.App = App;
