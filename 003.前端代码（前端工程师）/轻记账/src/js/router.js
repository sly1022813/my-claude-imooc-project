/**
 * 轻记账 - 简单路由系统
 */

const Router = {
  routes: {},
  currentRoute: null,
  beforeEach: null,

  /**
   * 注册路由
   * @param {string} path - 路由路径 (如 'dashboard', 'records')
   * @param {Function} handler - 路由处理函数
   */
  register(path, handler) {
    this.routes[path] = handler;
  },

  /**
   * 设置路由守卫
   * @param {Function} guard - 守卫函数，返回 true 表示允许访问
   */
  setGuard(guard) {
    this.beforeEach = guard;
  },

  /**
   * 导航到指定路由
   * @param {string} path - 路由路径
   */
  navigate(path) {
    // 检查守卫
    if (this.beforeEach && !this.beforeEach(path)) {
      return false;
    }

    // 更新 hash
    window.location.hash = path;
    return true;
  },

  /**
   * 获取当前路由
   * @returns {string}
   */
  getCurrentRoute() {
    const hash = window.location.hash.slice(1) || 'login';
    return hash.split('?')[0]; // 去除查询参数
  },

  /**
   * 解析路由参数
   * @param {string} route - 路由模板 (如 'record/:id')
   * @param {string} path - 实际路径
   * @returns {object|null}
   */
  matchRoute(route, path) {
    const routeParts = route.split('/');
    const pathParts = path.split('/');

    if (routeParts.length !== pathParts.length) {
      return null;
    }

    const params = {};
    for (let i = 0; i < routeParts.length; i++) {
      if (routeParts[i].startsWith(':')) {
        params[routeParts[i].slice(1)] = pathParts[i];
      } else if (routeParts[i] !== pathParts[i]) {
        return null;
      }
    }

    return params;
  },

  /**
   * 处理路由变化
   */
  handleRoute() {
    const path = this.getCurrentRoute();

    // 检查守卫
    if (this.beforeEach && !this.beforeEach(path)) {
      return;
    }

    this.currentRoute = path;

    // 调用对应的处理函数
    if (this.routes[path]) {
      this.routes[path]();
    } else {
      // 404 - 返回首页或登录页
      if (Storage.isLoggedIn()) {
        this.navigate('dashboard');
      } else {
        this.navigate('login');
      }
    }
  },

  /**
   * 初始化路由监听
   */
  init() {
    // 监听 hash 变化
    window.addEventListener('hashchange', () => this.handleRoute());

    // 初始路由处理
    this.handleRoute();
  }
};

// 导出到全局
window.Router = Router;
