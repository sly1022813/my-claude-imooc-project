# 轻记账后端 API 服务

> 轻记账财务管理系统后端 API 服务

## 技术栈

- **运行环境**: Node.js 18+
- **框架**: Express.js
- **数据库**: MySQL 8.0+
- **认证**: JWT (JSON Web Token)
- **密码加密**: bcryptjs

## 项目结构

```
backend/
├── src/
│   ├── config/           # 配置文件
│   │   ├── index.js     # 环境配置
│   │   └── database.js  # 数据库连接
│   ├── controllers/      # 控制器
│   │   ├── AuthController.js
│   │   ├── CategoryController.js
│   │   ├── TransactionController.js
│   │   ├── CustomerController.js
│   │   └── SupplierController.js
│   ├── middlewares/     # 中间件
│   │   ├── auth.js      # JWT认证
│   │   └── errorHandler.js
│   ├── models/          # 数据模型
│   │   ├── UserModel.js
│   │   ├── LoginLogModel.js
│   │   ├── CategoryModel.js
│   │   ├── TransactionModel.js
│   │   ├── CustomerModel.js
│   │   └── SupplierModel.js
│   ├── routes/          # 路由
│   │   ├── auth.js
│   │   ├── categories.js
│   │   ├── transactions.js
│   │   ├── customers.js
│   │   ├── suppliers.js
│   │   ├── validators.js
│   │   └── validators_business.js
│   ├── utils/          # 工具函数
│   │   └── response.js
│   └── server.js       # 入口文件
├── .env.example
├── package.json
└── README.md
```

## 快速开始

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=light_accounting
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:8080
```

### 3. 初始化数据库

```bash
mysql -u root -p < ../004.数据库脚本（数据库管理员DBA）/00_run_all.sql
```

### 4. 启动服务

```bash
npm run dev
```

## API 接口

### 健康检查

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|:----:|
| GET | `/health` | 服务健康检查 | ❌ |

### 认证模块

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|:----:|
| POST | `/api/auth/register` | 用户注册 | ❌ |
| POST | `/api/auth/login` | 用户登录 | ❌ |
| GET | `/api/auth/check-username` | 检查用户名 | ❌ |
| GET | `/api/auth/me` | 获取当前用户 | ✅ |
| POST | `/api/auth/change-password` | 修改密码 | ✅ |

### 分类管理

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|:----:|
| GET | `/api/categories` | 获取分类列表 | ✅ |
| GET | `/api/categories/:id` | 获取分类详情 | ✅ |
| POST | `/api/categories` | 创建分类 | ✅ |
| PUT | `/api/categories/:id` | 更新分类 | ✅ |
| DELETE | `/api/categories/:id` | 删除分类 | ✅ |

### 收支记录

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|:----:|
| GET | `/api/transactions` | 获取记录列表 | ✅ |
| GET | `/api/transactions/:id` | 获取记录详情 | ✅ |
| POST | `/api/transactions` | 创建记录 | ✅ |
| PUT | `/api/transactions/:id` | 更新记录 | ✅ |
| DELETE | `/api/transactions/:id` | 删除记录 | ✅ |
| GET | `/api/transactions/stats/monthly` | 月度统计 | ✅ |
| GET | `/api/transactions/stats/daily-trend` | 每日趋势 | ✅ |
| GET | `/api/transactions/pending` | 待收/待付列表 | ✅ |
| POST | `/api/transactions/:id/settle` | 收讫处理 | ✅ |

### 客户管理

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|:----:|
| GET | `/api/customers` | 获取客户列表 | ✅ |
| GET | `/api/customers/:id` | 获取客户详情 | ✅ |
| GET | `/api/customers/:id/transactions` | 客户交易明细 | ✅ |
| POST | `/api/customers` | 创建客户 | ✅ |
| PUT | `/api/customers/:id` | 更新客户 | ✅ |
| DELETE | `/api/customers/:id` | 删除客户 | ✅ |

### 供应商管理

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|:----:|
| GET | `/api/suppliers` | 获取供应商列表 | ✅ |
| GET | `/api/suppliers/:id` | 获取供应商详情 | ✅ |
| GET | `/api/suppliers/:id/transactions` | 供应商交易明细 | ✅ |
| POST | `/api/suppliers` | 创建供应商 | ✅ |
| PUT | `/api/suppliers/:id` | 更新供应商 | ✅ |
| DELETE | `/api/suppliers/:id` | 删除供应商 | ✅ |

## API 请求示例

### 用户注册

```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "root",
  "password": "Root1234",
  "confirmPassword": "Root1234",
  "userType": 1,
  "nickname": "我的昵称",
  "phone": "13800138000"
}
```

### 用户登录

```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "root",
  "password": "root"
}
```

### 创建支出记录

```bash
POST /api/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": 1,
  "amount": 150.50,
  "categoryId": 2,
  "date": "2026-10-08",
  "paymentMethod": 2,
  "counterparty": "某供应商",
  "counterpartyType": 2,
  "remark": "采购办公用品"
}
```

### 创建收入记录

```bash
POST /api/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": 2,
  "amount": 500.00,
  "categoryId": 11,
  "date": "2026-10-08",
  "paymentMethod": 3,
  "counterparty": "某客户",
  "counterpartyType": 1,
  "remark": "销售商品"
}
```

### 获取分类列表

```bash
GET /api/categories
Authorization: Bearer <token>
```

### 获取收支列表（带筛选）

```bash
GET /api/transactions?type=1&startDate=2026-10-01&endDate=2026-10-31&page=1&pageSize=20
Authorization: Bearer <token>
```

### 获取月度统计

```bash
GET /api/transactions/stats/monthly?yearMonth=2026-10
Authorization: Bearer <token>
```

## 响应格式

### 成功响应

```json
{
  "code": 0,
  "success": true,
  "message": "操作成功",
  "data": {}
}
```

### 分页响应

```json
{
  "code": 0,
  "success": true,
  "message": "获取成功",
  "data": {
    "list": [],
    "pagination": {
      "total": 100,
      "page": 1,
      "pageSize": 20,
      "totalPages": 5
    }
  }
}
```

### 错误响应

```json
{
  "code": 400,
  "success": false,
  "message": "错误信息"
}
```

## 字段值说明

### 用户类型 (user_type)

| 值 | 说明 |
|----|------|
| 1 | 个人用户 |
| 2 | 个体户 |
| 3 | 企业 |

### 收支类型 (type)

| 值 | 说明 |
|----|------|
| 1 | 支出 |
| 2 | 收入 |

### 支付方式 (payment_method)

| 值 | 说明 |
|----|------|
| 1 | 现金 |
| 2 | 微信支付 |
| 3 | 支付宝 |
| 4 | 银行卡 |
| 5 | 其他 |

### 对方类型 (counterparty_type)

| 值 | 说明 |
|----|------|
| 1 | 客户 |
| 2 | 供应商 |
| 3 | 其他 |

### 记录状态 (status)

| 值 | 说明 |
|----|------|
| 1 | 已支付/已收讫 |
| 2 | 挂账/待收/待付 |

### 结算方式 (settlement_type)

| 值 | 说明 |
|----|------|
| 1 | 即时结算 |
| 2 | 月结 |
| 3 | 季结 |

## 错误码

| 错误码 | 说明 |
|-------|------|
| 0 | 成功 |
| 1001 | 用户名或密码错误 |
| 1002 | 账号已被禁用 |
| 1003 | 登录失败次数过多 |
| 2001 | 用户名已存在 |
| 2003 | 两次密码不一致 |
| 3001 | 原密码错误 |
| 4001 | 分类不存在 |
| 4002 | 分类类型不匹配 |

## 许可证

MIT
