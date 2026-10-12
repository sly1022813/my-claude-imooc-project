# 财务管家 (Finance Butler)

企业财务管理系统后端 API，基于 Spring Boot 3.2 + MyBatis-Plus 开发。

## 技术栈

- **框架**: Spring Boot 3.2.5
- **ORM**: MyBatis-Plus 3.5.6
- **数据库**: MySQL 8.0
- **安全**: Spring Security + JWT
- **API文档**: Knife4j (Swagger 3.0)
- **Java版本**: 21

## 项目结构

```
src/main/java/com/light/butler/
├── controller/          # 控制器层
│   ├── AuthController.java      # 认证管理
│   ├── CategoryController.java   # 分类管理
│   ├── TransactionController.java # 收支记录
│   ├── AccountController.java    # 账户管理
│   ├── CustomerController.java   # 客户管理
│   └── SupplierController.java   # 供应商管理
├── service/            # 服务层
│   ├── impl/           # 服务实现
├── mapper/             # 数据访问层
├── entity/             # 实体类
├── dto/                # 数据传输对象
├── common/             # 通用类
├── config/             # 配置类
└── utils/              # 工具类
```

## 快速开始

### 1. 初始化数据库

```bash
# 登录 MySQL
mysql -u root -p

# 执行初始化脚本
source src/main/resources/schema.sql
```

### 2. 配置数据库连接

编辑 `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/finance_butler
    username: root
    password: your_password
```

### 3. 启动应用

```bash
mvn spring-boot:run
```

服务地址: `http://localhost:8081/api`

API文档: `http://localhost:8081/api/doc.html`

## API 接口文档

### 1. 认证模块 `/auth`

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/auth/register` | 用户注册 |
| POST | `/auth/login` | 用户登录 |
| GET | `/auth/check-username` | 检查用户名是否可用 |
| GET | `/auth/me` | 获取当前用户信息 |
| POST | `/auth/change-password` | 修改密码 |

### 2. 分类模块 `/categories`

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/categories` | 获取分类列表 |
| GET | `/categories/{id}` | 获取分类详情 |
| POST | `/categories` | 创建分类 |
| PUT | `/categories/{id}` | 更新分类 |
| DELETE | `/categories/{id}` | 删除分类 |

### 3. 收支记录模块 `/transactions`

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/transactions` | 获取收支记录列表 |
| GET | `/transactions/{id}` | 获取收支记录详情 |
| POST | `/transactions` | 创建收支记录 |
| PUT | `/transactions/{id}` | 更新收支记录 |
| DELETE | `/transactions/{id}` | 删除收支记录 |
| POST | `/transactions/{id}/settle` | 收讫处理 |
| GET | `/transactions/stats/monthly` | 月度统计 |
| GET | `/transactions/stats/daily-trend` | 每日趋势 |
| GET | `/transactions/stats/yearly` | 年度统计 |
| GET | `/transactions/stats/yearly-monthly` | 年度月度趋势 |
| GET | `/transactions/home` | 首页数据 |
| GET | `/transactions/pending` | 待收/待付款列表 |
| GET | `/transactions/yearly-list` | 年度收支记录列表 |

### 4. 账户模块 `/accounts`

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/accounts` | 获取账户列表 |
| GET | `/accounts/{id}` | 获取账户详情 |
| GET | `/accounts/profile` | 获取用户资料 |
| PUT | `/accounts/profile` | 更新用户资料 |
| PUT | `/accounts/password` | 修改密码 |
| POST | `/accounts/avatar` | 上传头像 |
| POST | `/accounts` | 创建账户 |
| PUT | `/accounts/{id}` | 更新账户 |
| DELETE | `/accounts/{id}` | 删除账户 |

### 5. 客户模块 `/customers`

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/customers` | 获取客户列表 |
| GET | `/customers/{id}` | 获取客户详情 |
| GET | `/customers/{id}/transactions` | 获取客户交易明细 |
| POST | `/customers` | 创建客户 |
| PUT | `/customers/{id}` | 更新客户 |
| DELETE | `/customers/{id}` | 删除客户 |

### 6. 供应商模块 `/suppliers`

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/suppliers` | 获取供应商列表 |
| GET | `/suppliers/{id}` | 获取供应商详情 |
| GET | `/suppliers/{id}/transactions` | 获取供应商交易明细 |
| POST | `/suppliers` | 创建供应商 |
| PUT | `/suppliers/{id}` | 更新供应商 |
| DELETE | `/suppliers/{id}` | 删除供应商 |

## 接口调用示例

### 1. 用户注册

```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "123456",
    "confirmPassword": "123456",
    "nickname": "测试用户"
  }'
```

### 2. 用户登录

```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "123456"
  }'
```

### 3. 获取分类列表

```bash
curl http://localhost:8081/api/categories \
  -H "Authorization: Bearer <token>"
```

### 4. 创建收支记录

```bash
curl -X POST http://localhost:8081/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "type": 1,
    "categoryId": 1,
    "amount": 100.00,
    "description": "午餐",
    "transactionDate": "2024-01-15"
  }'
```

## 统一响应格式

```json
{
  "code": 200,
  "message": "操作成功",
  "data": { ... },
  "timestamp": 1704912000000
}
```

## 数据库表结构

| 表名 | 描述 |
|------|------|
| fb_users | 用户表 |
| fb_categories | 分类表 |
| fb_transactions | 收支记录表 |
| fb_accounts | 账户表 |
| fb_customers | 客户表 |
| fb_suppliers | 供应商表 |
| fb_ar_bills | 应收账款表 |
| fb_ap_bills | 应付账款表 |
| fb_invoices | 发票表 |
| fb_contracts | 合同表 |
| fb_budgets | 预算表 |
| fb_collection_records | 回款记录表 |
| fb_payment_records | 付款记录表 |
| fb_login_logs | 登录日志表 |

## 测试账号

- 用户名: `admin`
- 密码: `123456`

## License

MIT
