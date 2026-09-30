# 轻记账 - 项目规格说明

## 1. 概述与愿景

轻记账是一款面向个人、小商户的轻量级财务记账工具。它以温暖的粉色系设计打破传统财务软件的冰冷感，通过简洁的交互让记账变成一种愉悦的日常习惯。核心价值在于「轻松记、清晰看、放心管」。

## 2. 设计语言

### 美学方向
- **风格**: 日式温暖极简主义 + 现代卡片式 UI
- **调性**: 亲切、治愈、专业但不压抑
- **参考**: Notion 的简洁 + 粉色系生活类 App

### 色彩系统

| 用途 | 色值 | 说明 |
|------|------|------|
| 主色 Primary | `#9b3f5a` | 品牌色、按钮、重点强调 |
| 主色容器 | `#ff8fab` | 浅粉背景、高亮区域 |
| 收入 Mint | `#7ED7C1` | 正数、正向指标 |
| 支出 Coral | `#FF6B6B` | 负数、负向指标 |
| 待收 Amber | `#FFB347` | 待处理、警告状态 |
| 表面Cream | `#FFF5F7` | 主背景色 |
| 卡片白 | `#FFFFFF` | 卡片、内容区背景 |
| 文字主色 | `#1b1c1c` | 正文 |
| 文字次色 | `#666666` | 辅助说明 |
| 文字占位 | `#999999` | 占位符、禁用态 |

### 字体

- **界面字体**: Plus Jakarta Sans (400/500/600/700)
- **金额字体**: Space Mono (400/700) - 用于所有数字展示，保证等宽对齐

### 间距系统

```
space-xs: 4px   - 标签内边距、微间距
space-sm: 8px   - 图标间距、紧凑间距
space-md: 12px  - 表单项间距
space-lg: 16px  - 卡片内边距
space-xl: 24px  - 模块间距、段落间距
```

### 圆角

```
sm: 4px   - 按钮、输入框
DEFAULT: 8px - 小组件
md: 12px  - 卡片
lg: 16px  - 大卡片
full: 9999px - 胶囊标签、头像
```

### 阴影

```css
--shadow-card: 0 4px 16px -2px rgba(255, 143, 171, 0.12);
--shadow-button: 0 4px 16px -2px rgba(255, 143, 171, 0.25);
```

### 动效

- **过渡时长**: 150-300ms
- **缓动函数**: ease, ease-out
- **悬停效果**: scale(0.98) 用于按钮
- **页面切换**: fadeIn 0.3s

## 3. 布局与结构

### 桌面端 (>= 768px)
- 左侧固定侧边栏 (256px)
- 右侧自适应内容区
- 最大内容宽度 1200px

### 移动端 (< 768px)
- 无侧边栏
- 顶部导航栏
- 底部固定导航栏 (含首页/明细/记账/统计/设置)

### 页面结构

```
┌─────────────────────────────────────┐
│  Header (Sticky)                     │
│  Logo | Search | Actions | Profile  │
├──────────┬──────────────────────────┤
│ Sidebar  │ Main Content             │
│          │                          │
│ - 首页   │  ┌──────────────────┐    │
│ - 明细   │  │ KPI Cards        │    │
│ - 记账   │  ├──────────────────┤    │
│ - 统计   │  │ Main Content     │    │
│ - 客户   │  │                  │    │
│ - 设置   │  └──────────────────┘    │
│          │                          │
│ [Quick]  │                          │
└──────────┴──────────────────────────┘
```

## 4. 功能与交互

### 4.1 登录/注册

**登录表单**
- 用户名 + 密码
- 7天内自动登录 (记住我)
- 忘记密码链接
- 免注册 Demo 模式入口

**注册表单**
- 用户名 (3-20位，字母数字下划线)
- 密码 + 确认密码
- 密码强度指示器
- 用户类型选择 (个人/商户/企业)

**交互细节**
- 输入框获取焦点时边框变粉
- 密码显示/隐藏切换
- 登录失败显示错误提示
- 登录成功自动跳转首页

### 4.2 首页概览 (Dashboard)

**KPI 卡片 (4个)**
- 本月净利润
- 本月总收入
- 本月总支出
- 今日即时净收

**快捷操作**
- 记支出卡片 (含预设标签)
- 记收入卡片 (含预设标签)

**最近记录**
- 最近5条记录列表
- 点击可查看详情

### 4.3 收支明细 (Records)

**筛选功能**
- 全部/支出/收入 待收 标签切换
- 日期范围筛选
- 分类筛选
- 支付渠道筛选
- 关键词搜索

**列表展示**
- 分组显示 (按日期)
- 每行: 图标 + 分类 + 备注 + 金额
- 金额颜色区分收入/支出

### 4.4 记一笔 (Add)

**收支切换**
- Segmented Control 切换 支出/收入

**金额输入**
- 大号数字显示
- 快捷金额按钮 (50/100/200/500/1000)
- 数字键盘输入

**分类选择**
- 网格布局展示
- 点击选中态
- 动态切换支出/收入分类

**明细属性**
- 日期选择 (今天/昨天/自定义)
- 支付渠道 (微信/支付宝/现金/银行卡)
- 备注说明 (文本框)
- 往来单位 (可选)

**实时预览**
- 模拟记账凭证样式
- 实时更新金额/分类

### 4.5 统计分析 (Stats)

**月度概览**
- KPI 指标卡片
- 收支趋势图 (SVG 图表)
- 支出分类饼图

**经营建议**
- AI 生成的分析建议

### 4.6 客户管理 (Customers)

**客户列表**
- 客户名称 + 联系人
- 累计交易额
- 当前欠款
- 信用状态

**操作**
- 新建客户
- 编辑客户
- 记收款
- 发送催款

### 4.7 系统设置 (Settings)

**店铺资料**
- 店铺名称
- 主理人
- 联系手机
- 经营业态

**分类管理**
- 支出分类列表 (可增删)
- 收入分类列表 (可增删)

**数据管理**
- 存储容量显示
- 导出 JSON 备份
- 导入数据恢复
- 清空测试数据

**记账偏好**
- 默认支付方式
- 自动生成流水号
- 每日提醒开关
- 主题切换

**账户安全**
- 当前用户名显示
- 修改密码

## 5. 组件清单

### 按钮 (Button)

| 状态 | 样式 |
|------|------|
| Primary | 背景 #9b3f5a, 白色文字, 阴影 |
| Secondary | 透明背景, 粉色边框和文字 |
| Ghost | 透明背景, 灰色文字 |
| Hover | 透明度 0.95 |
| Active | scale(0.96) |
| Disabled | 透明度 0.5, 禁用指针 |

### 输入框 (Input)

| 状态 | 样式 |
|------|------|
| Default | 白色背景, 浅粉边框 |
| Focus | 粉色边框, 浅粉阴影 |
| Error | 红色边框 |
| Disabled | 灰色背景 |

### 卡片 (Card)

- 白色背景
- 1px 浅粉边框
- 12px 圆角
- 粉色柔和阴影
- 16px 内边距

### 徽章 (Badge)

| 类型 | 样式 |
|------|------|
| Primary | 浅粉背景, 深粉文字 |
| Income | 薄荷绿背景, 深绿文字 |
| Expense | 珊瑚红背景, 红色文字 |
| Pending | 琥珀黄背景, 深黄文字 |

### 分类标签 (Category Chip)

| 状态 | 样式 |
|------|------|
| Default | 奶油色背景, 灰色文字 |
| Hover | 浅粉背景 |
| Selected | 浅粉背景, 粉色边框, 深色文字 |

### 分段控制 (Segmented Control)

- 奶油色容器
- 白色滑动选中项
- 选中项粉色文字
- 过渡动画 200ms

### 进度条 (Progress Bar)

- 奶油色轨道
- 彩色填充
- 圆角端点

### Toast 提示

- 深灰背景
- 白色文字
- 圆角卡片
- 底部右侧定位
- 滑入/滑出动画

## 6. 技术方案

### 技术栈

- **HTML5**: 语义化标签
- **CSS3**: Tailwind CSS + 自定义 CSS
- **JavaScript**: 原生 ES6+ (无框架依赖)
- **存储**: localStorage
- **路由**: Hash Router (#/path)

### 文件结构

```
轻记账/
├── index.html              # 主入口页面
├── SPEC.md                 # 本规格说明
├── README.md               # 项目说明文档
│
└── src/
    ├── css/
    │   └── styles.css     # 自定义样式（粉色主题设计系统）
    │
    └── js/
        ├── app.js        # 主应用逻辑（包含所有页面渲染）
        ├── router.js     # Hash Router 路由系统
        ├── storage.js    # localStorage 数据存储管理
        └── utils.js      # 工具函数库
```

### 数据模型

**用户 (User)**
```javascript
{
  id: string,
  username: string,
  passwordHash: string,
  userType: 'personal' | 'merchant' | 'enterprise',
  createdAt: ISO8601,
  lastLogin: ISO8601 | null
}
```

**记录 (Record)**
```javascript
{
  id: string,
  type: 'income' | 'expense',
  amount: number,
  category: string,
  categoryIcon: string,
  channel: string,
  note: string,
  createdAt: ISO8601
}
```

**分类 (Category)**
```javascript
{
  id: string,
  name: string,
  icon: string
}
```

**客户 (Customer)**
```javascript
{
  id: string,
  name: string,
  contact: string,
  phone: string,
  address: string,
  balance: number,
  createdAt: ISO8601
}
```

### localStorage Keys

| Key | 说明 |
|-----|------|
| `light_account_user` | 当前登录用户 |
| `light_account_records` | 记账记录数组 |
| `light_account_customers` | 客户列表 |
| `light_account_categories` | 收支分类 |
| `light_account_settings` | 用户设置 |

### 路由表

| Hash | 页面 | 需登录 |
|------|------|--------|
| `#login` | 登录页 | 否 |
| `#register` | 注册页 | 否 |
| `#dashboard` | 首页概览 | 是 |
| `#records` | 收支明细 | 是 |
| `#add` | 记一笔 | 是 |
| `#stats` | 统计分析 | 是 |
| `#customers` | 客户管理 | 是 |
| `#settings` | 系统设置 | 是 |

## 7. 响应式断点

| 断点 | 宽度 | 布局 |
|------|------|------|
| Mobile | < 768px | 单列，底部导航 |
| Tablet | 768px - 1024px | 侧边栏收起 |
| Desktop | > 1024px | 完整侧边栏 |

## 8. 无障碍考虑

- 语义化 HTML 标签
- ARIA 属性标注
- 键盘导航支持
- 焦点可见性
- 颜色对比度符合 WCAG AA

## 9. 浏览器兼容

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- 移动端 Safari/Chrome
