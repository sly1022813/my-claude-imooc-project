/**
 * 工具函数
 * 轻记账前端工具模块
 */

/**
 * Toast 提示组件
 */
const Toast = {
  container: null,

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 8px;
        pointer-events: none;
      `;
      document.body.appendChild(this.container);
    }
  },

  show(message, type = 'info', duration = 3000) {
    this.init();

    const toast = document.createElement('div');
    const bgColors = {
      success: 'bg-income-mint',
      error: 'bg-expense-coral',
      warning: 'bg-pending-amber',
      info: 'bg-primary'
    };

    toast.className = `${bgColors[type]} text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium transform transition-all duration-300 translate-y-[-20px] opacity-0`;
    toast.textContent = message;

    this.container.appendChild(toast);

    // 动画显示
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-[-20px]', 'opacity-0');
    });

    // 自动移除
    setTimeout(() => {
      toast.classList.add('translate-y-[-20px]', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  success(message) { this.show(message, 'success'); },
  error(message) { this.show(message, 'error'); },
  warning(message) { this.show(message, 'warning'); },
  info(message) { this.show(message, 'info'); }
};

/**
 * 格式化金额
 * @param {number} amount - 金额
 * @param {boolean} showSign - 是否显示正负符号
 * @returns {string} 格式化后的金额
 */
function formatMoney(amount, showSign = false) {
  const num = parseFloat(amount) || 0;
  const formatted = num.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return showSign ? (num >= 0 ? `+¥${formatted}` : `-¥${formatted}`) : `¥${formatted}`;
}

/**
 * 格式化金额（简版，无货币符号）
 */
function formatAmount(amount) {
  const num = parseFloat(amount) || 0;
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * 格式化日期
 * @param {string|Date} date - 日期
 * @param {string} format - 格式
 * @returns {string} 格式化后的日期
 */
function formatDate(date, format = 'YYYY-MM-DD') {
  if (!date) return '';

  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 格式化时间为 HH:mm:ss
 */
function formatTime(time) {
  if (!time) return '';
  if (typeof time === 'string' && time.length <= 8) {
    return time.substring(0, 5);
  }
  const d = new Date(`2000-01-01 ${time}`);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/**
 * 获取相对时间描述
 */
function getRelativeTime(date) {
  const now = new Date();
  const d = new Date(date);
  const diff = now - d;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 7) return `${days}天前`;
  return formatDate(date);
}

/**
 * 获取月份第一天
 */
function getMonthStart(date = new Date()) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

/**
 * 获取今天日期
 */
function getToday() {
  return formatDate(new Date());
}

/**
 * 获取本月
 */
function getCurrentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/**
 * 用户类型映射
 */
const UserTypeMap = {
  1: '个人用户',
  2: '个体户',
  3: '企业'
};

/**
 * 收支类型映射
 */
const TypeMap = {
  1: { name: '支出', color: 'expense-coral', prefix: '-' },
  2: { name: '收入', color: 'income-mint', prefix: '+' }
};

/**
 * 支付方式映射
 */
const PaymentMethodMap = {
  1: '现金',
  2: '微信支付',
  3: '支付宝',
  4: '银行卡',
  5: '其他'
};

/**
 * 对方类型映射
 */
const CounterpartyTypeMap = {
  1: '客户',
  2: '供应商',
  3: '其他'
};

/**
 * 交易状态映射
 */
const TransactionStatusMap = {
  1: { name: '已支付', color: 'income-mint' },
  2: { name: '待收/待付', color: 'pending-amber' }
};

/**
 * 验证用户名格式
 */
function validateUsername(username) {
  if (!username) return '用户名不能为空';
  if (username.length < 3) return '用户名至少3个字符';
  if (username.length > 20) return '用户名最多20个字符';
  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(username)) {
    return '用户名需以字母开头，可包含字母、数字和下划线';
  }
  return null;
}

/**
 * 验证密码强度
 */
function validatePassword(password) {
  if (!password) return '密码不能为空';
  if (password.length < 6) return '密码至少6个字符';
  if (password.length > 20) return '密码最多20个字符';
  return null;
}

/**
 * 验证手机号
 */
function validatePhone(phone) {
  if (!phone) return null; // 选填
  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return '手机号格式不正确';
  }
  return null;
}

/**
 * 防抖函数
 */
function debounce(fn, delay = 300) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * 节流函数
 */
function throttle(fn, delay = 300) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn.apply(this, args);
    }
  };
}

/**
 * 加载状态组件
 */
function showLoading(text = '加载中...') {
  let loader = document.getElementById('global-loader');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'global-loader';
    loader.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9998;
    `;
    loader.innerHTML = `
      <div class="bg-white rounded-xl p-6 flex flex-col items-center gap-3">
        <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <span class="text-on-surface font-medium">${text}</span>
      </div>
    `;
    document.body.appendChild(loader);
  }
}

function hideLoading() {
  const loader = document.getElementById('global-loader');
  if (loader) loader.remove();
}

/**
 * 确认对话框
 */
function confirm(message) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9998;
    `;

    overlay.innerHTML = `
      <div class="bg-surface-card rounded-xl p-6 max-w-xs w-full mx-4 shadow-xl">
        <p class="text-on-surface font-medium text-center mb-6">${message}</p>
        <div class="flex gap-3">
          <button class="cancel-btn flex-1 py-2.5 rounded-lg bg-surface-cream text-text-secondary font-medium hover:bg-surface-container transition-colors">取消</button>
          <button class="confirm-btn flex-1 py-2.5 rounded-lg bg-primary text-white font-medium hover:opacity-90 transition-opacity">确定</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector('.cancel-btn').onclick = () => {
      overlay.remove();
      resolve(false);
    };

    overlay.querySelector('.confirm-btn').onclick = () => {
      overlay.remove();
      resolve(true);
    };

    overlay.onclick = (e) => {
      if (e.target === overlay) {
        overlay.remove();
        resolve(false);
      }
    };
  });
}

// 导出工具函数
window.Utils = {
  Toast,
  formatMoney,
  formatAmount,
  formatDate,
  formatTime,
  getRelativeTime,
  getMonthStart,
  getToday,
  getCurrentMonth,
  UserTypeMap,
  TypeMap,
  PaymentMethodMap,
  CounterpartyTypeMap,
  TransactionStatusMap,
  validateUsername,
  validatePassword,
  validatePhone,
  debounce,
  throttle,
  showLoading,
  hideLoading,
  confirm
};
