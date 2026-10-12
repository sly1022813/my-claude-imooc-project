# 轻记账 - 使用说明

## 项目结构

```
001.产品PRD（产品经理）/
├── src/
│   ├── index.html      # 主页面（首页、记录、统计、我的）
│   ├── login.html       # 登录页
│   ├── register.html    # 注册页
│   ├── settings.html    # 设置页（账户管理、分类管理）
│   ├── css/
│   │   └── style.css   # 样式文件
│   └── js/
│       ├── api.js      # API 调用模块
│       ├── storage.js  # 本地存储模块（备用）
│       └── app.js      # 主应用逻辑
```

## 启动步骤

### 1. 初始化数据库

```bash
cd 004.数据库脚本（数据库管理员DBA）
mysql -u root -p < 00_run_all.sql
```

或进入 MySQL 客户端执行：

```sql
SOURCE 00_run_all.sql;
```

### 2. 启动后端服务

```bash
cd 003.前端代码（前端工程师）/backend
npm install
npm start
```

后端服务将运行在 http://localhost:3000

### 3. 启动前端

直接用浏览器打开 `src/index.html` 文件即可。

或者使用本地服务器：

```bash
# 方法1: 使用 Python
cd src
python -m http.server 8080

# 方法2: 使用 Node.js
npx serve src

# 方法3: 使用 VS Code Live Server 扩展
```

## 功能说明

### 首页
- 显示当前月份的收入、支出、结余统计
- 显示本月支出最多的3个分类
- 显示最近3条记账记录

### 统计
- 年份选择器切换不同年份
- 显示年度收入、支出、结余
- 支出分类饼状图
- 收支趋势折线图（1-12月）
- 导出 Excel 报表

### 明细
- 按月份显示收支记录
- 支持按全部/支出/收入筛选
- 分页加载（20条/页）

### 设置
- 账户管理：添加、修改、删除账户
- 分类管理：支出/收入分类的增删改
- 头像上传
- 修改密码

## 技术栈

- **前端**: 原生 JavaScript + CSS
- **后端**: Node.js + Express
- **数据库**: MySQL
- **认证**: JWT Token

## API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/auth/register` | POST | 用户注册 |
| `/api/auth/login` | POST | 用户登录 |
| `/api/auth/me` | GET | 获取当前用户 |
| `/api/transactions/home` | GET | 首页数据 |
| `/api/transactions` | GET/POST | 收支记录列表/创建 |
| `/api/transactions/stats/yearly` | GET | 年度统计 |
| `/api/transactions/stats/yearly-monthly` | GET | 月度趋势 |
| `/api/categories` | GET/POST | 分类列表/创建 |
| `/api/accounts` | GET/POST | 账户列表/创建 |
| `/api/accounts/profile` | GET/PUT | 用户信息 |
| `/api/accounts/avatar` | POST | 头像上传 |

## 数据库表

- `users` - 用户表
- `transactions` - 收支记录表
- `categories` - 分类表
- `customers` - 客户表
- `suppliers` - 供应商表
- `accounts` - 账户表
- `attachments` - 附件表
- `login_logs` - 登录日志表

## 注意事项

1. 首次使用需要先注册账号
2. 建议使用 Chrome 或 Safari 浏览器
3. 确保后端服务正常运行，否则前端会降级使用本地存储
