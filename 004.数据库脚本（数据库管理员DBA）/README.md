# 轻记账数据库设计与脚本

> 版本：v1.0.1
> 作者：DBA团队
> 日期：2026-10-01
> 状态：完成

---

## 目录

1. [数据库设计说明](#数据库设计说明)
2. [数据库对象ER图](#数据库对象er图)
3. [表结构设计](#表结构设计)
4. [SQL脚本文件列表](#sql脚本文件列表)

---

## 数据库设计说明

### 1.1 设计背景

本数据库设计基于《轻记账》产品PRD文档，针对个体户、小微企业和个人用户提供轻量级财务管理系统。

### 1.2 设计原则

- **规范化设计**：遵循数据库第三范式(3NF)，减少数据冗余
- **业务适配**：根据PRD功能需求设计表结构
- **扩展性**：预留字段便于未来功能扩展
- **性能优先**：合理设计索引，优化查询性能
- **安全审计**：记录关键操作日志

### 1.3 数据库选型

| 选项 | 数据库 | 适用场景 |
|-----|--------|---------|
| 方案A | MySQL 8.0+ | 中小型应用，主从架构，云部署 |
| 方案B | PostgreSQL 14+ | 复杂查询，JSON支持，数据完整性要求高 |
| 方案C | SQLite | 单机版，数据量<10万条 |
| 方案D | 混合架构 | SQLite本地 + MySQL云端同步 |

**推荐**：MySQL 8.0+ 作为生产环境数据库

### 1.4 命名规范

| 类型 | 规范 | 示例 |
|-----|------|------|
| 表名 | 小写下划线命名，复数形式 | `users`, `transactions` |
| 主键 | `id` | `id BIGINT UNSIGNED AUTO_INCREMENT` |
| 外键 | `表名_id` | `user_id`, `category_id` |
| 索引 | `idx_表名_字段` | `idx_transactions_user_date` |
| 唯一索引 | `uk_表名_字段` | `uk_users_username` |
| 时间戳 | `created_at`, `updated_at` | `DATETIME DEFAULT CURRENT_TIMESTAMP` |

---

## 数据库对象ER图

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│    users    │     │   transactions   │     │  categories  │
├─────────────┤     ├──────────────────┤     ├──────────────┤
│ id (PK)     │────<│ id (PK)          │     │ id (PK)      │
│ username    │     │ user_id (FK)     │>────│ user_id (FK) │
│ password    │     │ category_id (FK) │     │ type         │
│ user_type   │     │ type             │     │ name         │
│ created_at  │     │ amount           │     │ icon         │
│ updated_at  │     │ date             │     │ color        │
└─────────────┘     │ payment_method   │     │ is_system    │
                    │ counterparty     │     │ sort_order   │
                    │ counterparty_type│     │ created_at   │
                    │ status           │     │ updated_at   │
                    │ remark           │     └──────────────┘
                    │ created_at       │
                    │ updated_at       │     ┌──────────────┐
                    └──────────────────┘     │  customers   │
                           │                 ├──────────────┤
                           │                 │ id (PK)      │
                           │                 │ user_id (FK) │<─┐
                           │                 │ name         │  │
                    ┌──────┴───────┐          │ phone        │  │
                    │ attachments  │          │ address      │  │
                    ├──────────────┤          │ remark       │  │
                    │ id (PK)      │          │ created_at   │  │
                    │ ref_type     │          │ updated_at   │  │
                    │ ref_id       │          └──────────────┘  │
                    │ file_path    │                  │         │
                    │ file_name    │                  │         │
                    │ file_size    │          ┌───────┴───────┐ │
                    │ file_type    │          │              │ │
                    │ created_at   │          │              │ │
                    └──────────────┘     ┌──────────────┐     │
                                        │  suppliers   │     │
                                        ├──────────────┤     │
                                        │ id (PK)      │     │
                                        │ user_id (FK) │<────┘
                                        │ name         │
                                        │ phone        │
                                        │ products     │
                                        │ remark       │
                                        │ created_at   │
                                        │ updated_at   │
                                        └──────────────┘

                    ┌──────────────┐
                    │ login_logs   │
                    ├──────────────┤
                    │ id (PK)      │
                    │ user_id (FK) │
                    │ ip_address   │
                    │ user_agent   │
                    │ login_status │
                    │ login_time   │
                    └──────────────┘
```

---

## 表结构设计

### 2.1 用户表 (users)

存储用户账户信息。

| 字段 | 类型 | 说明 | 约束 |
|-----|------|------|------|
| id | BIGINT UNSIGNED | 主键 | PRIMARY KEY, AUTO_INCREMENT |
| username | VARCHAR(50) | 用户名 | NOT NULL, UNIQUE |
| password_hash | VARCHAR(255) | 密码哈希(SHA-256) | NOT NULL |
| user_type | TINYINT | 用户类型:1=个人,2=个体户,3=企业 | NOT NULL, DEFAULT 1 |
| nickname | VARCHAR(100) | 昵称 | NULL |
| phone | VARCHAR(20) | 手机号 | NULL |
| email | VARCHAR(100) | 邮箱 | NULL |
| avatar_url | VARCHAR(500) | 头像URL | NULL |
| status | TINYINT | 状态:1=正常,0=禁用 | NOT NULL, DEFAULT 1 |
| last_login_at | DATETIME | 最后登录时间 | NULL |
| last_login_ip | VARCHAR(45) | 最后登录IP | NULL |
| created_at | DATETIME | 创建时间 | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | 更新时间 | NOT NULL, ON UPDATE CURRENT_TIMESTAMP |

**索引**：
- `uk_users_username` - UNIQUE(username)
- `idx_users_status` - (status)
- `idx_users_created_at` - (created_at)

---

### 2.2 收支记录表 (transactions)

核心交易流水表。

| 字段 | 类型 | 说明 | 约束 |
|-----|------|------|------|
| id | BIGINT UNSIGNED | 主键 | PRIMARY KEY, AUTO_INCREMENT |
| user_id | BIGINT UNSIGNED | 用户ID | NOT NULL, FK -> users.id |
| transaction_no | VARCHAR(30) | 流水号(自动生成) | NOT NULL, UNIQUE |
| type | TINYINT | 类型:1=支出,2=收入 | NOT NULL |
| amount | DECIMAL(15,2) | 金额(正数存储) | NOT NULL |
| category_id | BIGINT UNSIGNED | 分类ID | NOT NULL, FK -> categories.id |
| date | DATE | 交易日期 | NOT NULL |
| time | TIME | 交易时间 | NOT NULL |
| payment_method | TINYINT | 支付方式:1=现金,2=微信,3=支付宝,4=银行卡,5=其他 | NULL |
| counterparty | VARCHAR(200) | 对方单位/客户/供应商名称 | NULL |
| counterparty_type | TINYINT | 对方类型:1=客户,2=供应商,3=其他 | NULL |
| counterparty_id | BIGINT UNSIGNED | 对方ID(客户或供应商) | NULL |
| status | TINYINT | 状态:1=已支付/已收讫,2=挂账/待收 | NOT NULL, DEFAULT 1 |
| remark | VARCHAR(500) | 备注 | NULL |
| created_at | DATETIME | 创建时间 | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | 更新时间 | NOT NULL, ON UPDATE CURRENT_TIMESTAMP |

**索引**：
- `uk_transactions_no` - UNIQUE(transaction_no)
- `idx_transactions_user_date` - (user_id, date)
- `idx_transactions_user_type` - (user_id, type)
- `idx_transactions_category` - (category_id)
- `idx_transactions_status` - (status)
- `idx_transactions_created` - (created_at)

---

### 2.3 分类表 (categories)

收支分类管理。

| 字段 | 类型 | 说明 | 约束 |
|-----|------|------|------|
| id | BIGINT UNSIGNED | 主键 | PRIMARY KEY, AUTO_INCREMENT |
| user_id | BIGINT UNSIGNED | 用户ID(系统分类user_id=0) | NOT NULL |
| type | TINYINT | 类型:1=支出,2=收入 | NOT NULL |
| name | VARCHAR(50) | 分类名称 | NOT NULL |
| icon | VARCHAR(50) | 图标(Emoji) | NOT NULL |
| color | VARCHAR(20) | 颜色值 | NULL |
| is_system | TINYINT | 是否系统分类:1=是,0=否 | NOT NULL, DEFAULT 0 |
| sort_order | INT | 排序(越小越靠前) | NOT NULL, DEFAULT 0 |
| status | TINYINT | 状态:1=启用,0=禁用 | NOT NULL, DEFAULT 1 |
| created_at | DATETIME | 创建时间 | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | 更新时间 | NOT NULL, ON UPDATE CURRENT_TIMESTAMP |

**索引**：
- `idx_categories_user_type` - (user_id, type)
- `idx_categories_status` - (status)
- `idx_categories_sort` - (sort_order)

**系统预设分类**：
- 支出：餐饮成本、进货成本、房租水电、工资、运营费用、交通物流、办公用品、税费、社交应酬、其他支出
- 收入：销售收入、服务收入、其他收入、退款

---

### 2.4 客户表 (customers)

客户信息管理。

| 字段 | 类型 | 说明 | 约束 |
|-----|------|------|------|
| id | BIGINT UNSIGNED | 主键 | PRIMARY KEY, AUTO_INCREMENT |
| user_id | BIGINT UNSIGNED | 用户ID | NOT NULL, FK -> users.id |
| name | VARCHAR(100) | 客户名称 | NOT NULL |
| phone | VARCHAR(20) | 联系电话 | NULL |
| address | VARCHAR(500) | 地址 | NULL |
| customer_type | TINYINT | 客户类型:1=个人,2=企业 | NULL |
| credit_limit | DECIMAL(15,2) | 信用额度 | NULL |
| remark | VARCHAR(500) | 备注 | NULL |
| status | TINYINT | 状态:1=正常,0=禁用 | NOT NULL, DEFAULT 1 |
| created_at | DATETIME | 创建时间 | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | 更新时间 | NOT NULL, ON UPDATE CURRENT_TIMESTAMP |

**索引**：
- `idx_customers_user` - (user_id)
- `idx_customers_name` - (name)
- `idx_customers_status` - (status)

---

### 2.5 供应商表 (suppliers)

供应商信息管理。

| 字段 | 类型 | 说明 | 约束 |
|-----|------|------|------|
| id | BIGINT UNSIGNED | 主键 | PRIMARY KEY, AUTO_INCREMENT |
| user_id | BIGINT UNSIGNED | 用户ID | NOT NULL, FK -> users.id |
| name | VARCHAR(100) | 供应商名称 | NOT NULL |
| phone | VARCHAR(20) | 联系电话 | NULL |
| address | VARCHAR(500) | 地址 | NULL |
| contact_person | VARCHAR(50) | 联系人 | NULL |
| products | VARCHAR(500) | 主营商品 | NULL |
| settlement_type | TINYINT | 结算方式:1=即时,2=月结,3=季结 | NULL |
| remark | VARCHAR(500) | 备注 | NULL |
| status | TINYINT | 状态:1=正常,0=禁用 | NOT NULL, DEFAULT 1 |
| created_at | DATETIME | 创建时间 | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | 更新时间 | NOT NULL, ON UPDATE CURRENT_TIMESTAMP |

**索引**：
- `idx_suppliers_user` - (user_id)
- `idx_suppliers_name` - (name)
- `idx_suppliers_status` - (status)

---

### 2.6 附件表 (attachments)

发票、凭证等附件管理。

| 字段 | 类型 | 说明 | 约束 |
|-----|------|------|------|
| id | BIGINT UNSIGNED | 主键 | PRIMARY KEY, AUTO_INCREMENT |
| user_id | BIGINT UNSIGNED | 用户ID | NOT NULL, FK -> users.id |
| ref_type | VARCHAR(30) | 关联类型:transaction/customer/supplier | NOT NULL |
| ref_id | BIGINT UNSIGNED | 关联ID | NOT NULL |
| file_path | VARCHAR(500) | 文件存储路径 | NOT NULL |
| file_name | VARCHAR(255) | 原始文件名 | NOT NULL |
| file_size | BIGINT | 文件大小(字节) | NOT NULL |
| file_type | VARCHAR(50) | 文件MIME类型 | NOT NULL |
| file_hash | VARCHAR(64) | 文件SHA-256哈希 | NULL |
| description | VARCHAR(200) | 文件描述 | NULL |
| created_at | DATETIME | 上传时间 | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

**索引**：
- `idx_attachments_ref` - (ref_type, ref_id)
- `idx_attachments_user` - (user_id)

---

### 2.7 登录日志表 (login_logs)

安全审计日志。

| 字段 | 类型 | 说明 | 约束 |
|-----|------|------|------|
| id | BIGINT UNSIGNED | 主键 | PRIMARY KEY, AUTO_INCREMENT |
| user_id | BIGINT UNSIGNED | 用户ID | NULL, FK -> users.id |
| username | VARCHAR(50) | 尝试登录的用户名 | NOT NULL |
| login_status | TINYINT | 登录状态:1=成功,0=失败 | NOT NULL |
| fail_reason | VARCHAR(100) | 失败原因 | NULL |
| ip_address | VARCHAR(45) | IP地址(支持IPv6) | NOT NULL |
| user_agent | VARCHAR(500) | 浏览器UA | NULL |
| login_time | DATETIME | 登录时间 | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

**索引**：
- `idx_login_logs_user` - (user_id)
- `idx_login_logs_time` - (login_time)
- `idx_login_logs_ip` - (ip_address)

---

## SQL脚本文件列表

| 序号 | 文件名 | 说明 |
|-----|--------|------|
| 1 | `01_init_database.sql` | 创建数据库 |
| 2 | `02_create_tables.sql` | 创建所有数据表 |
| 3 | `03_create_indexes.sql` | 创建索引 |
| 4 | `04_system_categories.sql` | 插入系统预设分类 |
| 5 | `05_views.sql` | 创建常用视图 |
| 6 | `06_stored_procedures.sql` | 存储过程 |
| 7 | `07_functions.sql` | 自定义函数 |
| 8 | `08_init_data.sql` | 测试数据 |
| 9 | `00_run_all.sql` | 一键执行所有脚本 |
| 10 | `database_design.md` | 本文档 |

---

## 使用说明

### 执行顺序

```bash
# 方法一：一键执行
mysql -u root -p < 00_run_all.sql

# 方法二：逐个执行
mysql -u root -p < 01_init_database.sql
mysql -u root -p < 02_create_tables.sql
mysql -u root -p < 03_create_indexes.sql
mysql -u root -p < 04_system_categories.sql
# ...以此类推
```

### 初始化配置

执行脚本前，请修改以下配置：

```sql
-- 01_init_database.sql 中的数据库名称
CREATE DATABASE IF NOT EXISTS `light_accounting` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 02_create_tables.sql 中的存储引擎和字符集
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 附录：字段值说明

### user_type 用户类型
| 值 | 说明 |
|-----|------|
| 1 | 个人用户 |
| 2 | 个体户 |
| 3 | 企业 |

### type 收支类型
| 值 | 说明 |
|-----|------|
| 1 | 支出 |
| 2 | 收入 |

### payment_method 支付方式
| 值 | 说明 |
|-----|------|
| 1 | 现金 |
| 2 | 微信支付 |
| 3 | 支付宝 |
| 4 | 银行卡 |
| 5 | 其他 |

### counterparty_type 对方类型
| 值 | 说明 |
|-----|------|
| 1 | 客户 |
| 2 | 供应商 |
| 3 | 其他 |

### transaction_status 交易状态
| 值 | 说明 |
|-----|------|
| 1 | 已支付/已收讫 |
| 2 | 挂账/待收 |

### login_status 登录状态
| 值 | 说明 |
|-----|------|
| 1 | 成功 |
| 0 | 失败 |
