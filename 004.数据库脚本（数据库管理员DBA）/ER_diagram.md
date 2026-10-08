# 轻记账数据库 ER 图

> 本文档展示轻记账系统的数据库实体关系图

---

## 1. 完整 ER 图

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                      light_accounting 数据库                                    │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                             │
│  ┌─────────────┐                              ┌──────────────────┐                           │
│  │   users     │                              │  transactions    │                           │
│  ├─────────────┤                              ├──────────────────┤                           │
│  │ PK id       │◄─────────────────────────────│ PK id            │                           │
│  │ username    │         1:N                 │ FK user_id      │                           │
│  │ password    │                              │ transaction_no  │                           │
│  │ user_type   │                              │ type            │                           │
│  │ nickname    │                              │ amount          │                           │
│  │ phone       │                              │ FK category_id  │──────┐                    │
│  │ email       │                              │ date            │      │                    │
│  │ business_   │                              │ time            │      │                    │
│  │   name      │                              │ payment_method  │      │                    │
│  │ status      │                              │ counterparty    │      │                    │
│  │ last_login  │                              │ counterparty_   │      │                    │
│  │ created_at  │                              │   type          │      │ 1:N                │
│  │ updated_at  │                              │ FK counterparty │◄─────┤                    │
│  └─────────────┘                              │ _id             │      │                    │
│       │                                       │ status          │      │                    │
│       │ 1:N                                    │ remark          │      │                    │
│       │                                       │ created_at      │      │                    │
│       ▼                                       │ updated_at      │      │                    │
│  ┌─────────────┐                              └──────────────────┘      │                    │
│  │ categories  │◄───────────────────────────────────────────────────────┘                    │
│  ├─────────────┤                                                                            │
│  │ PK id       │                                                                            │
│  │ FK user_id  │◄─────────────────────────┐                                                   │
│  │ type        │                          │                                                   │
│  │ name        │                          │                                                   │
│  │ icon        │                          │                                                   │
│  │ color       │                          │                                                   │
│  │ is_system   │                          │                                                   │
│  │ sort_order  │                          │                                                   │
│  │ status      │                          │                                                   │
│  │ created_at  │                          │                                                   │
│  │ updated_at  │                          │                                                   │
│  └─────────────┘                          │                                                   │
│                                          │                                                   │
│       ┌──────────────────────────────────┴──────────────────────────────────┐                │
│       │                                                                          │                │
│       │ 1:N                                                                     │                │
│       ▼                                                                          ▼                │
│  ┌─────────────┐                                                       ┌─────────────┐      │
│  │ customers   │                                                       │ suppliers   │      │
│  ├─────────────┤                                                       ├─────────────┤      │
│  │ PK id       │                                                       │ PK id       │      │
│  │ FK user_id  │◄───────────────────────┐                              │ FK user_id  │◄─────┘
│  │ name        │                       │                              │ name        │
│  │ phone       │                       │                              │ phone       │
│  │ address     │                       │                              │ address     │
│  │ customer_   │                       │                              │ contact_    │
│  │   type      │                       │                              │   person    │
│  │ credit_     │                       │                              │ products    │
│  │   limit     │                       │                              │ settlement_ │──────┐
│  │ total_      │                       │                              │   type      │      │
│  │   trans     │                       │                              │ total_      │      │
│  │ outstanding │                       │                              │   purchase  │      │
│  │ remark      │                       │                              │ outstanding │      │
│  │ status      │                       │                              │ remark      │      │
│  │ created_at  │                       │                              │ status      │      │
│  │ updated_at  │                       │                              │ created_at  │      │
│  └─────────────┘                       │                              │ updated_at  │      │
│                                        │                              └─────────────┘      │
│                                        │                                                                │
│                                        │ 1:N                                                           │
│                                        ▼                                                                │
│  ┌─────────────┐                                                                                     │
│  │attachments  │                                                                                     │
│  ├─────────────┤                                                                                     │
│  │ PK id       │                                                                                     │
│  │ FK user_id  │                                                                                     │
│  │ ref_type    │                                                                                     │
│  │ ref_id      │                                                                                     │
│  │ file_path   │                                                                                     │
│  │ file_name   │                                                                                     │
│  │ file_size   │                                                                                     │
│  │ file_type   │                                                                                     │
│  │ file_hash   │                                                                                     │
│  │ description │                                                                                     │
│  │ created_at  │                                                                                     │
│  └─────────────┘                                                                                     │
│                                                                                                      │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                       独立表                                                        │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                      │
│  ┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐                    │
│  │ login_logs  │     │ backup_      │     │ quick_amt_  │     │ user_       │                    │
│  │             │     │ records      │     │ templates   │     │ settings    │                    │
│  ├─────────────┤     ├──────────────┤     ├─────────────┤     ├──────────────┤                    │
│  │ PK id       │     │ PK id        │     │ PK id       │     │ PK id        │                    │
│  │ FK user_id  │    │ FK user_id  │     │ FK user_id  │     │ FK user_id  │                    │
│  │ username    │     │ backup_type │     │ name        │     │ setting_key │                    │
│  │ login_status│     │ file_path   │     │ amount      │     │ setting_value│                   │
│  │ fail_reason │     │ file_size   │     │ FK cat_id   │     │ created_at  │                    │
│  │ ip_address  │     │ status      │     │ use_count   │     │ updated_at  │                    │
│  │ user_agent  │     │ remark      │     │ sort_order  │     └──────────────┘                    │
│  │ login_time  │     │ created_at  │     │ status      │                                           │
│  └─────────────┘     └──────────────┘     │ created_at  │                                           │
│                                           │ updated_at  │                                           │
│                                           └─────────────┘                                           │
│                                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. 表关系说明

### 2.1 核心业务表

| 关系 | 描述 |
|-----|------|
| `users` → `transactions` | 1:N，一个用户有多条收支记录 |
| `users` → `categories` | 1:N，一个用户有多个分类（含系统分类 user_id=0） |
| `users` → `customers` | 1:N，一个用户有多个客户 |
| `users` → `suppliers` | 1:N，一个用户有多个供应商 |
| `users` → `attachments` | 1:N，一个用户有多个附件 |
| `categories` → `transactions` | 1:N，一个分类包含多条收支记录 |
| `customers` ↔ `transactions` | 1:N，客户与收支记录的往来关系 |
| `suppliers` ↔ `transactions` | 1:N，供应商与收支记录的往来关系 |
| `transactions` → `attachments` | 1:N，一笔记录可附多个发票/凭证 |

### 2.2 引用完整性约束

```
users.id (PK)
   │
   ├──► transactions.user_id (FK, ON DELETE CASCADE)
   ├──► categories.user_id (FK, ON DELETE CASCADE)
   ├──► customers.user_id (FK, ON DELETE CASCADE)
   ├──► suppliers.user_id (FK, ON DELETE CASCADE)
   ├──► attachments.user_id (FK, ON DELETE CASCADE)
   ├──► login_logs.user_id (FK, ON DELETE SET NULL)
   ├──► backup_records.user_id (FK, ON DELETE CASCADE)
   ├──► quick_amount_templates.user_id (FK, ON DELETE CASCADE)
   └──► user_settings.user_id (FK, ON DELETE CASCADE)

categories.id (PK)
   │
   └──► transactions.category_id (FK, ON DELETE RESTRICT)

customers.id (PK)
   │
   └──► transactions.counterparty_id (FK, ON DELETE SET NULL)

suppliers.id (PK)
   │
   └──► transactions.counterparty_id (FK, ON DELETE SET NULL)
```

---

## 3. 索引设计概览

### 3.1 主键索引
| 表名 | 主键 |
|-----|------|
| users | id |
| categories | id |
| customers | id |
| suppliers | id |
| transactions | id |
| attachments | id |
| login_logs | id |
| backup_records | id |
| quick_amount_templates | id |
| user_settings | id |

### 3.2 唯一索引
| 表名 | 索引名 | 字段 |
|-----|--------|------|
| users | uk_users_username | username |
| transactions | uk_transactions_no | transaction_no |
| user_settings | uk_settings_user_key | user_id + setting_key |

### 3.3 业务查询索引
| 表名 | 索引名 | 字段组合 |
|-----|--------|---------|
| transactions | idx_transactions_user_date | user_id + date |
| transactions | idx_transactions_user_type | user_id + type |
| transactions | idx_transactions_user_date_type | user_id + date + type |
| categories | idx_categories_user_type | user_id + type |
| customers | idx_customers_user_status_name | user_id + status + name |
| suppliers | idx_suppliers_user_status_name | user_id + status + name |
| login_logs | idx_login_logs_time_user | login_time + user_id |

---

## 4. 关键业务流程

### 4.1 记账流程
```
用户登录 → 创建收支记录 → 更新分类统计
                      → 更新客户/供应商统计（如关联）
                      → 上传附件（如有）
```

### 4.2 收讫流程
```
查看待收款列表 → 选择待收记录 → 执行收讫
                             → 更新记录状态
                             → 更新客户欠款金额
```

### 4.3 客户欠款追踪
```
创建客户 → 记录赊账销售 → 欠款累加
                    → 收款收讫 → 欠款减少
```

---

## 5. 字段类型规范

| 类型标识 | MySQL 类型 | 说明 |
|---------|-----------|------|
| ID 主键 | BIGINT UNSIGNED AUTO_INCREMENT | 无符号大整数，自增 |
| 金额 | DECIMAL(15,2) | 15位总长，2位小数 |
| 哈希 | VARCHAR(255) | 存储 SHA-256 哈希值 |
| IP地址 | VARCHAR(45) | 支持 IPv6 |
| 时间戳 | DATETIME | 精确到秒 |
| 状态标志 | TINYINT | 1=启用/正常, 0=禁用/异常 |

---

*文档版本: v1.0.1 | 最后更新: 2026-10-01*
