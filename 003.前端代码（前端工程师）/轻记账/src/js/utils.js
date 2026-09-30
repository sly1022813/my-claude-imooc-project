/**
 * 轻记账 - 工具函数
 */

const Utils = {
  /**
   * 格式化金额显示
   * @param {number} amount - 金额
   * @param {string} prefix - 前缀符号，如 ¥, $
   * @param {boolean} showSign - 是否显示正负符号
   * @returns {string} 格式化后的金额字符串
   */
  formatCurrency(amount, prefix = '¥', showSign = false) {
    const num = parseFloat(amount) || 0;
    const formatted = num.toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    if (showSign && num > 0) {
      return `+${prefix}${formatted}`;
    }
    return `${prefix}${formatted}`;
  },

  /**
   * 格式化日期
   * @param {Date|string} date - 日期
   * @param {string} format - 格式类型: 'full', 'date', 'time', 'short'
   * @returns {string} 格式化后的日期字符串
   */
  formatDate(date, format = 'date') {
    const d = date instanceof Date ? date : new Date(date);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[d.getDay()];

    switch (format) {
      case 'full':
        return `${year}年${month}月${day}日 ${weekday}`;
      case 'date':
        return `${year}年${month}月${day}日`;
      case 'time':
        return `${hours}:${minutes}:${seconds}`;
      case 'short':
        return `${month}-${day}`;
      case 'datetime':
        return `${month}-${day} ${hours}:${minutes}`;
      default:
        return `${year}-${month}-${day}`;
    }
  },

  /**
   * 获取相对时间描述
   * @param {Date|string} date - 日期
   * @returns {string} 相对时间描述
   */
  getRelativeTime(date) {
    const d = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const diff = now - d;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days === 1) return '昨天';
    if (days < 7) return `${days}天前`;

    return this.formatDate(d, 'date');
  },

  /**
   * 生成唯一ID
   * @returns {string} 唯一ID
   */
  generateId() {
    return `TX${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  },

  /**
   * 防抖函数
   * @param {Function} func - 要防抖的函数
   * @param {number} wait - 等待时间(ms)
   * @returns {Function} 防抖后的函数
   */
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * 节流函数
   * @param {Function} func - 要节流的函数
   * @param {number} limit - 限制时间(ms)
   * @returns {Function} 节流后的函数
   */
  throttle(func, limit = 300) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * 深拷贝
   * @param {any} obj - 要拷贝的对象
   * @returns {any} 拷贝后的对象
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));

    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = this.deepClone(obj[key]);
      }
    }
    return cloned;
  },

  /**
   * 简单的哈希函数 (用于密码等)
   * @param {string} str - 要哈希的字符串
   * @returns {string} 哈希值
   */
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  },

  /**
   * 获取今天开始时间
   * @returns {Date}
   */
  getTodayStart() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  },

  /**
   * 获取本月开始时间
   * @returns {Date}
   */
  getMonthStart() {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  },

  /**
   * 验证金额格式
   * @param {string} value - 输入值
   * @returns {boolean}
   */
  isValidAmount(value) {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0 && num < 100000000;
  },

  /**
   * 验证用户名
   * @param {string} username - 用户名
   * @returns {object} { valid: boolean, message: string }
   */
  validateUsername(username) {
    if (!username || username.length < 3) {
      return { valid: false, message: '用户名至少3个字符' };
    }
    if (username.length > 20) {
      return { valid: false, message: '用户名最多20个字符' };
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return { valid: false, message: '用户名只能包含字母、数字和下划线' };
    }
    return { valid: true, message: '' };
  },

  /**
   * 验证密码强度
   * @param {string} password - 密码
   * @returns {object} { valid: boolean, strength: 'weak'|'medium'|'strong', message: string }
   */
  validatePassword(password) {
    if (!password || password.length < 6) {
      return { valid: false, strength: 'weak', message: '密码至少6个字符' };
    }
    if (password.length < 8) {
      return { valid: true, strength: 'medium', message: '密码强度: 中等' };
    }
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);

    if (hasLetter && hasNumber && hasSpecial) {
      return { valid: true, strength: 'strong', message: '密码强度: 强' };
    }
    if (hasLetter && hasNumber) {
      return { valid: true, strength: 'strong', message: '密码强度: 强' };
    }
    return { valid: true, strength: 'medium', message: '密码强度: 中等' };
  },

  /**
   * 显示Toast提示
   * @param {string} message - 提示消息
   * @param {number} duration - 显示时长(ms)
   */
  showToast(message, duration = 2000) {
    let toast = document.getElementById('app-toast');

    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  },

  /**
   * 本地存储封装
   */
  storage: {
    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.error('Storage get error:', e);
        return defaultValue;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.error('Storage set error:', e);
        return false;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
        return true;
      } catch (e) {
        console.error('Storage remove error:', e);
        return false;
      }
    },

    clear() {
      try {
        localStorage.clear();
        return true;
      } catch (e) {
        console.error('Storage clear error:', e);
        return false;
      }
    }
  }
};

// 导出到全局
window.Utils = Utils;
