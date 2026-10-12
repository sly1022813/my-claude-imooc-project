# 轻记账 Java 后端 API 服务

> 轻记账财务管理系统 Java 版后端 API 服务

## 技术栈

- **运行环境**: Java 17+
- **框架**: Spring Boot 3.2.0
- **ORM**: MyBatis-Plus 3.5.5
- **数据库**: MySQL 8.0+
- **认证**: JWT (jjwt 0.12.3)
- **密码加密**: SHA-256
- **构建工具**: Maven

## 项目结构

```
light-accounting-java/
├── src/main/java/com/lightaccounting/
│   ├── LightAccountingApplication.java    # 启动类
│   ├── config/                           # 配置类
│   │   ├── AppConfig.java               # MyBatis-Plus配置
│   │   └── CorsConfig.java             # CORS跨域配置
│   ├── common/                          # 通用类
│   │   ├── Result.java                 # 统一响应格式
│   │   ├── ResultCode.java             # 业务错误码
│   │   └── PageResult.java             # 分页响应
│   ├── controller/                      # 控制器
│   │   ├── AuthController.java          # 认证模块
│   │   ├── CategoryController.java      # 分类模块
│   │   ├── TransactionController.java   # 收支记录模块
│   │   ├── CustomerController.java      # 客户模块
│   │   ├── SupplierController.java      # 供应商模块
│   │   ├── AccountController.java       # 账户模块
│   │   └── HealthController.java       # 健康检查
│   ├── service/                         # 服务层
│   │   ├── AuthService.java
│   │   ├── CategoryService.java
│   │   ├── TransactionService.java
│   │   ├── CustomerService.java
│   │   ├── SupplierService.java
│   │   ├── AccountService.java
│   │   └── impl/                       # 服务实现
│   ├── mapper/                          # 数据访问层
│   │   ├── UserMapper.java
│   │   ├── CategoryMapper.java
│   │   ├── TransactionMapper.java
│   │   ├── CustomerMapper.java
│   │   ├── SupplierMapper.java
│   │   ├── LoginLogMapper.java
│   │   └── AccountMapper.java
│   ├── entity/                          # 实体类
│   │   ├── User.java
│   │   ├── Category.java
│   │   ├── Transaction.java
│   │   ├── Customer.java
│   │   ├── Supplier.java
│   │   ├── LoginLog.java
│   │   └── Account.java
│   ├── dto/                             # 数据传输对象
│   │   └── request/                    # 请求DTO
│   ├── exception/                       # 异常处理
│   │   └── GlobalExceptionHandler.java
│   └── util/                           # 工具类
│       ├── JwtUtil.java
│       └── PasswordUtil.java
├── src/main/resources/
│   ├── application.yml                 # 应用配置
│   └── mapper/                         # MyBatis XML
├── pom.xml
└── README.md
```

## 快速开始

### 1. 环境要求

- JDK 17+
- Maven 3.8+
- MySQL 8.0+

### 2. 初始化数据库

```bash
mysql -u root -p < ../004.数据库脚本（数据库管理员DBA）/00_run_all.sql
```

### 3. 配置数据库连接

编辑 `src/main/resources/application.yml`：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/light_accounting?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
    username: root
    password: your_password
```

### 4. 编译运行

```bash
# 编译项目
mvn clean package

# 运行项目
mvn spring-boot:run

# 或者运行打包后的jar
java -jar target/light-accounting-backend-1.0.0.jar
```

### 5. 访问服务

- API服务: http://localhost:8080
- 健康检查: http://localhost:8080/health

## API 接口

### 健康检查

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|:----:|
| GET | `/health` | 服务健康检查 | ❌ |

### 认证模块 `/api/auth`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|:----:|
| POST | `/api/auth/register` | 用户注册 | ❌ |
| POST | `/api/auth/login` | 用户登录 | ❌ |
| GET | `/api/auth/check-username` | 检查用户名 | ❌ |
| GET | `/api/auth/me` | 获取当前用户 | ✅ |
| POST | `/api/auth/change-password` | 修改密码 | ✅ |

### 分类管理 `/api/categories`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|:----:|
| GET | `/api/categories` | 获取分类列表 | ✅ |
| GET | `/api/categories/:id` | 获取分类详情 | ✅ |
| POST | `/api/categories` | 创建分类 | ✅ |
| PUT | `/api/categories/:id` | 更新分类 | ✅ |
| DELETE | `/api/categories/:id` | 删除分类 | ✅ |

### 收支记录 `/api/transactions`

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
| GET | `/api/transactions/home` | 首页数据 | ✅ |
| GET | `/api/transactions/stats/yearly` | 年度统计 | ✅ |
| GET | `/api/transactions/stats/yearly-monthly` | 年度月度趋势 | ✅ |
| GET | `/api/transactions/yearly-list` | 年度记录列表 | ✅ |

### 客户管理 `/api/customers`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|:----:|
| GET | `/api/customers` | 获取客户列表 | ✅ |
| GET | `/api/customers/:id` | 获取客户详情 | ✅ |
| GET | `/api/customers/:id/transactions` | 客户交易明细 | ✅ |
| POST | `/api/customers` | 创建客户 | ✅ |
| PUT | `/api/customers/:id` | 更新客户 | ✅ |
| DELETE | `/api/customers/:id` | 删除客户 | ✅ |

### 供应商管理 `/api/suppliers`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|:----:|
| GET | `/api/suppliers` | 获取供应商列表 | ✅ |
| GET | `/api/suppliers/:id` | 获取供应商详情 | ✅ |
| GET | `/api/suppliers/:id/transactions` | 供应商交易明细 | ✅ |
| POST | `/api/suppliers` | 创建供应商 | ✅ |
| PUT | `/api/suppliers/:id` | 更新供应商 | ✅ |
| DELETE | `/api/suppliers/:id` | 删除供应商 | ✅ |

### 账户管理 `/api/accounts`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|:----:|
| GET | `/api/accounts` | 获取账户列表 | ✅ |
| GET | `/api/accounts/:id` | 获取账户详情 | ✅ |
| POST | `/api/accounts` | 创建账户 | ✅ |
| PUT | `/api/accounts/:id` | 更新账户 | ✅ |
| DELETE | `/api/accounts/:id` | 删除账户 | ✅ |

## API 请求示例

### 用户登录

```bash
POST /api/auth/login
Content-Type: application/json

{
  "username": "root",
  "password": "Root1234"
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

## 前端对接

前端只需修改 API 基础 URL：

```javascript
// Node.js 后端 (端口 3000)
const API_BASE_URL = 'http://localhost:3000';

// Java 后端 (端口 8080)
const API_BASE_URL = 'http://localhost:8080';
```

## 字段值说明

### 收支类型 (type)
| 值 | 说明 |
|-----|------|
| 1 | 支出 |
| 2 | 收入 |

### 支付方式 (paymentMethod)
| 值 | 说明 |
|-----|------|
| 1 | 现金 |
| 2 | 微信支付 |
| 3 | 支付宝 |
| 4 | 银行卡 |
| 5 | 其他 |

### 对方类型 (counterpartyType)
| 值 | 说明 |
|-----|------|
| 1 | 客户 |
| 2 | 供应商 |
| 3 | 其他 |

### 记录状态 (status)
| 值 | 说明 |
|-----|------|
| 1 | 已支付/已收讫 |
| 2 | 挂账/待收/待付 |

## 测试账号

- 用户名: `root`
- 密码: `Root1234`

## 许可证

MIT
