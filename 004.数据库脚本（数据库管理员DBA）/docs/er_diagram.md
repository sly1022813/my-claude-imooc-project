# E-R 图说明文档

## 一、实体关系总览

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              用户模块                                         │
│  ┌──────────┐      ┌─────────────────┐                                    │
│  │   users  │──1:1──│ user_settings   │                                    │
│  │  (用户)  │      │ (用户设置)       │                                    │
│  └────┬─────┘      └─────────────────┘                                    │
│       │                                                                    │
│       │ 1:N                                                                    │
│       │                                                                    │
└───────┼────────────────────────────────────────────────────────────────────┘
        │
        ├────────────────────────────┬───────────────────────────────────────┐
        │                            │                                       │
        ▼                            ▼                                       ▼
┌───────────────┐          ┌──────────────────┐                   ┌──────────────┐
│   customers   │          │ account_records  │                   │   suppliers  │
│   (客户)      │          │   (账目记录)     │                   │   (供应商)    │
└───────┬───────┘          └────────┬─────────┘                   └──────┬───────┘
        │                           │                                       │
        │ 1:N                       │ 1:1                                   │ 1:N
        │                           │                                       │
        ▼                           │                                       ▼
┌───────────────────┐              │                               ┌───────────────────┐
│customer_balances │              │                               │supplier_balances  │
│  (客户余额变动)   │              │                               │  (供应商余额变动)  │
└───────────────────┘              │                               └───────────────────┘
                                   │
                                   ▼
                          ┌──────────────┐
                          │  categories   │
                          │   (分类)      │
                          └──────────────┘
```

---

## 二、核心实体说明

### 1. users (用户表)
| 属性 | 说明 |
|------|------|
| 主键 | id |
| 唯一标识 | user_code, username |
| 关联 | user_settings (1:1), account_records (1:N), customers (1:N), suppliers (1:N) |

### 2. user_settings (用户设置表)
| 属性 | 说明 |
|------|------|
| 主键 | id |
| 外键 | user_id → users |
| 关联 | 1:1 关联用户表 |

### 3. categories (分类表)
| 属性 | 说明 |
|------|------|
| 主键 | id |
| 外键 | user_id → users (可为NULL表示系统分类) |
| 枚举值 | type: income(收入), expense(支出) |
| 关联 | account_records (1:N) |

### 4. account_records (账目记录表)
| 属性 | 说明 |
|------|------|
| 主键 | id |
| 外键 | user_id → users, category_id → categories, customer_id → customers, supplier_id → suppliers |
| 索引 | user_id + record_date + type (联合索引用于月度统计) |
| 关联 | categories (N:1), customers (N:1), suppliers (N:1) |

### 5. customers (客户表)
| 属性 | 说明 |
|------|------|
| 主键 | id |
| 外键 | user_id → users |
| 关联 | customer_balances (1:N), account_records (1:N) |

### 6. suppliers (供应商表)
| 属性 | 说明 |
|------|------|
| 主键 | id |
| 外键 | user_id → users |
| 关联 | supplier_balances (1:N), account_records (1:N) |

### 7. customer_balances (客户余额表)
| 属性 | 说明 |
|------|------|
| 主键 | id |
| 外键 | customer_id → customers, record_id → account_records |
| 说明 | 记录每次客户余额变动 |

### 8. supplier_balances (供应商余额表)
| 属性 | 说明 |
|------|------|
| 主键 | id |
| 外键 | supplier_id → suppliers, record_id → account_records |
| 说明 | 记录每次供应商余额变动 |

---

## 三、业务流程关系

### 3.1 记账流程
```
用户登录 → 记一笔收入/支出 → 选择分类 → 填写金额 → 保存
                                              ↓
                                    更新账户余额(本月收入/支出)
                                    更新分类统计
                                    更新客户/供应商余额(如有)
```

### 3.2 客户应收流程
```
新增客户 → 记录收入(关联客户) → customer_balances 增加
                ↓
          收到款项(记录支出,关联客户) → customer_balances 减少
```

### 3.3 供应商应付流程
```
新增供应商 → 记录支出(关联供应商) → supplier_balances 增加
                 ↓
            付款(记录收入,关联供应商) → supplier_balances 减少
```

---

## 四、查询示例

### 4.1 月度收支统计
```sql
SELECT 
    type,
    COUNT(*) as record_count,
    SUM(amount) as total_amount
FROM account_records
WHERE user_id = 1 
    AND record_date BETWEEN '2026-10-01' AND '2026-10-31'
    AND deleted_at IS NULL
GROUP BY type;
```

### 4.2 按分类统计支出
```sql
SELECT 
    c.name as category_name,
    c.icon,
    SUM(r.amount) as total_amount,
    COUNT(*) as record_count
FROM account_records r
JOIN categories c ON r.category_id = c.id
WHERE r.user_id = 1 
    AND r.type = 'expense'
    AND r.record_date BETWEEN '2026-10-01' AND '2026-10-31'
GROUP BY c.id, c.name, c.icon
ORDER BY total_amount DESC;
```

### 4.3 客户应收款查询
```sql
SELECT 
    name,
    phone,
    balance,
    last_trade_at
FROM customers
WHERE user_id = 1 
    AND balance > 0
    AND deleted_at IS NULL
ORDER BY balance DESC;
```

### 4.4 近30天收支趋势
```sql
SELECT 
    record_date,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
FROM account_records
WHERE user_id = 1 
    AND record_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY record_date
ORDER BY record_date;
```

---

## 五、表关系矩阵

|  | users | settings | categories | records | customers | suppliers | cust_bal | supp_bal |
|---|-------|----------|------------|---------|-----------|----------|----------|-----------|
| users | - | 1:1 | 1:N | 1:N | 1:N | 1:N | - | - |
| settings | 1:1 | - | - | - | - | - | - | - |
| categories | 1:N | - | - | 1:N | - | - | - | - |
| records | N:1 | - | N:1 | - | N:1 | N:1 | - | - |
| customers | N:1 | - | - | N:1 | - | - | 1:N | - |
| suppliers | N:1 | - | - | N:1 | - | - | - | 1:N |
| cust_bal | - | - | - | N:1 | N:1 | - | - | - |
| supp_bal | - | - | - | N:1 | - | N:1 | - | - |
