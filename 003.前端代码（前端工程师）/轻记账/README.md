# 轻记账 - 轻量级财务记账工具

> 简单好用的个人/商户财务记账工具，基于 Web 技术构建，无需安装即可使用。

## 功能特性

- ✅ **用户认证** - 用户名密码注册/登录
- ✅ **记账功能** - 快速记录收入/支出，支持多种分类
- 📊 **统计分析** - 月度收支概览、分类占比分析
- 👥 **客户管理** - 客户档案、应收账款跟踪
- 🚚 **供应商管理** - 供应商档案、采购对账
- 💾 **数据安全** - 本地存储，数据导出/导入备份
- 📱 **响应式设计** - 适配桌面端和移动端

## 技术栈

- **前端框架**: 原生 JavaScript (ES6+)
- **样式**: Tailwind CSS + 自定义 CSS
- **路由**: Hash Router
- **存储**: 浏览器 localStorage

## 项目结构

```
轻记账/
├── index.html              # 应用入口页面
├── SPEC.md                 # 项目规格说明
├── README.md               # 项目文档
│
└── src/
    ├── css/
    │   └── styles.css     # 自定义样式（粉色主题）
    │
    └── js/
        ├── app.js         # 主应用逻辑（所有页面渲染）
        ├── router.js      # 路由系统
        ├── storage.js     # 数据存储管理
        └── utils.js       # 工具函数
```

## 快速开始

### 直接运行

```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### 使用本地服务器（推荐）

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .

# PHP
php -S localhost:8080
```

然后访问 http://localhost:8080

## 页面路由

| Hash 路由 | 页面 | 说明 |
|----------|------|------|
| `#login` | 登录页 | 用户登录（默认） |
| `#register` | 注册页 | 新用户注册 |
| `#dashboard` | 首页 | 财务概览仪表盘 |
| `#records` | 收支明细 | 收支记录列表 |
| `#add` | 记一笔 | 新增记账（支持 `?type=income/expense`） |
| `#stats` | 统计分析 | 月度统计图表 |
| `#customers` | 客户管理 | 客户档案管理 |
| `#suppliers` | 供应商 | 供应商管理 |
| `#settings` | 系统设置 | 应用配置 |

## 页面跳转

所有页面通过侧边栏（桌面端）或底部导航栏（移动端）进行导航：

```
┌─────────┬─────────┬─────────┬─────────┬─────────┐
│  首页   │  明细   │  记账   │  统计   │   设置  │
└─────────┴─────────┴─────────┴─────────┴─────────┘
```

## 数据存储

所有数据存储在浏览器 localStorage 中：

| Key | 说明 |
|-----|------|
| `light_account_user` | 当前登录用户 |
| `light_account_records` | 收支记录 |
| `light_account_customers` | 客户列表 |
| `light_account_suppliers` | 供应商列表 |
| `light_account_categories` | 自定义分类 |
| `light_account_settings` | 用户设置 |

## 设计规范

### 色彩系统

| 用途 | 色值 |
|------|------|
| 主色 Primary | `#9b3f5a` |
| 主色容器 | `#ff8fab` |
| 收入 Mint | `#7ED7C1` |
| 支出 Coral | `#FF6B6B` |
| 待收 Amber | `#FFB347` |
| 背景 Cream | `#FFF5F7` |

### 字体

- **界面字体**: Plus Jakarta Sans
- **金额字体**: Space Mono (等宽数字)

## 浏览器兼容

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- 移动端 Safari/Chrome

## License

MIT License
