-- =====================================================
-- 财务管家 数据库初始化脚本
-- 数据库名: finance_butler
-- =====================================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS finance_butler DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE finance_butler;

-- =====================================================
-- 1. 用户表
-- =====================================================
CREATE TABLE IF NOT EXISTS fb_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希',
    user_type INT DEFAULT 1 COMMENT '用户类型：1=个人, 2=个体户, 3=企业',
    nickname VARCHAR(100) COMMENT '昵称',
    phone VARCHAR(20) COMMENT '手机号',
    email VARCHAR(100) COMMENT '邮箱',
    avatar_url VARCHAR(500) COMMENT '头像URL',
    business_name VARCHAR(200) COMMENT '企业/商户名称',
    credit_code VARCHAR(50) COMMENT '统一社会信用代码',
    status INT DEFAULT 1 COMMENT '状态：1=正常, 0=禁用',
    last_login_at DATETIME COMMENT '最后登录时间',
    last_login_ip VARCHAR(50) COMMENT '最后登录IP',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted INT DEFAULT 0 COMMENT '逻辑删除',
    INDEX idx_username (username),
    INDEX idx_user_type (user_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- =====================================================
-- 2. 客户表
-- =====================================================
CREATE TABLE IF NOT EXISTS fb_customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '客户ID',
    user_id BIGINT NOT NULL COMMENT '所属用户ID',
    code VARCHAR(50) COMMENT '客户编码',
    name VARCHAR(200) NOT NULL COMMENT '客户名称',
    type INT DEFAULT 1 COMMENT '客户类型：1=个人, 2=企业',
    contact VARCHAR(100) COMMENT '联系人',
    phone VARCHAR(20) COMMENT '联系电话',
    email VARCHAR(100) COMMENT '邮箱',
    address VARCHAR(500) COMMENT '地址',
    credit_code VARCHAR(50) COMMENT '统一社会信用代码',
    bank_name VARCHAR(200) COMMENT '开户银行',
    bank_account VARCHAR(50) COMMENT '银行账号',
    receivable_balance DECIMAL(15,2) DEFAULT 0 COMMENT '应收余额',
    received_balance DECIMAL(15,2) DEFAULT 0 COMMENT '已收余额',
    `level` INT DEFAULT 1 COMMENT '客户等级：1=普通, 2=重要, 3=VIP',
    remark TEXT COMMENT '备注',
    status INT DEFAULT 1 COMMENT '状态：1=正常, 0=禁用',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted INT DEFAULT 0 COMMENT '逻辑删除',
    INDEX idx_user_id (user_id),
    INDEX idx_code (code),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='客户表';

-- =====================================================
-- 3. 供应商表
-- =====================================================
CREATE TABLE IF NOT EXISTS fb_suppliers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '供应商ID',
    user_id BIGINT NOT NULL COMMENT '所属用户ID',
    code VARCHAR(50) COMMENT '供应商编码',
    name VARCHAR(200) NOT NULL COMMENT '供应商名称',
    type INT DEFAULT 1 COMMENT '供应商类型：1=个人, 2=企业',
    contact VARCHAR(100) COMMENT '联系人',
    phone VARCHAR(20) COMMENT '联系电话',
    email VARCHAR(100) COMMENT '邮箱',
    address VARCHAR(500) COMMENT '地址',
    credit_code VARCHAR(50) COMMENT '统一社会信用代码',
    bank_name VARCHAR(200) COMMENT '开户银行',
    bank_account VARCHAR(50) COMMENT '银行账号',
    payable_balance DECIMAL(15,2) DEFAULT 0 COMMENT '应付余额',
    paid_balance DECIMAL(15,2) DEFAULT 0 COMMENT '已付余额',
    `level` INT DEFAULT 1 COMMENT '供应商等级：1=普通, 2=重要, 3=核心',
    remark TEXT COMMENT '备注',
    status INT DEFAULT 1 COMMENT '状态：1=正常, 0=禁用',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted INT DEFAULT 0 COMMENT '逻辑删除',
    INDEX idx_user_id (user_id),
    INDEX idx_code (code),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='供应商表';

-- =====================================================
-- 4. 应收账款表
-- =====================================================
CREATE TABLE IF NOT EXISTS fb_ar_bills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '账单ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    bill_no VARCHAR(50) NOT NULL COMMENT '账单编号',
    customer_id BIGINT NOT NULL COMMENT '客户ID',
    customer_name VARCHAR(200) COMMENT '客户名称（冗余）',
    contract_id BIGINT COMMENT '合同ID（可选）',
    invoice_id BIGINT COMMENT '发票ID（可选）',
    amount DECIMAL(15,2) NOT NULL COMMENT '账单金额',
    written_off_amount DECIMAL(15,2) DEFAULT 0 COMMENT '已核销金额',
    pending_amount DECIMAL(15,2) COMMENT '未核销金额',
    bill_date DATE COMMENT '账单日期',
    due_date DATE COMMENT '到期日期',
    payment_term INT COMMENT '账期类型',
    status INT DEFAULT 2 COMMENT '状态：1=待确认, 2=待收款, 3=部分核销, 4=已核销, 5=逾期',
    remark TEXT COMMENT '备注',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted INT DEFAULT 0 COMMENT '逻辑删除',
    INDEX idx_user_id (user_id),
    INDEX idx_bill_no (bill_no),
    INDEX idx_customer_id (customer_id),
    INDEX idx_due_date (due_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='应收账款表';

-- =====================================================
-- 5. 应付账款表
-- =====================================================
CREATE TABLE IF NOT EXISTS fb_ap_bills (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '账单ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    bill_no VARCHAR(50) NOT NULL COMMENT '账单编号',
    supplier_id BIGINT NOT NULL COMMENT '供应商ID',
    supplier_name VARCHAR(200) COMMENT '供应商名称（冗余）',
    contract_id BIGINT COMMENT '合同ID（可选）',
    invoice_id BIGINT COMMENT '发票ID（可选）',
    amount DECIMAL(15,2) NOT NULL COMMENT '账单金额',
    written_off_amount DECIMAL(15,2) DEFAULT 0 COMMENT '已核销金额',
    pending_amount DECIMAL(15,2) COMMENT '未核销金额',
    bill_date DATE COMMENT '账单日期',
    due_date DATE COMMENT '到期日期',
    payment_term INT COMMENT '账期类型',
    status INT DEFAULT 2 COMMENT '状态：1=待确认, 2=待付款, 3=部分核销, 4=已核销, 5=逾期',
    remark TEXT COMMENT '备注',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted INT DEFAULT 0 COMMENT '逻辑删除',
    INDEX idx_user_id (user_id),
    INDEX idx_bill_no (bill_no),
    INDEX idx_supplier_id (supplier_id),
    INDEX idx_due_date (due_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='应付账款表';

-- =====================================================
-- 6. 发票表
-- =====================================================
CREATE TABLE IF NOT EXISTS fb_invoices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '发票ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    invoice_no VARCHAR(50) COMMENT '发票编号',
    type INT NOT NULL COMMENT '发票类型：1=增值税专用发票, 2=增值税普通发票, 3=电子发票, 4=收据',
    direction INT NOT NULL COMMENT '发票方向：1=销项发票, 2=进项发票',
    customer_id BIGINT COMMENT '客户ID（销项时）',
    supplier_id BIGINT COMMENT '供应商ID（进项时）',
    party_name VARCHAR(200) COMMENT '客户/供应商名称',
    contract_id BIGINT COMMENT '合同ID（可选）',
    amount DECIMAL(15,2) NOT NULL COMMENT '发票金额（不含税）',
    tax_rate DECIMAL(5,2) COMMENT '税率',
    tax_amount DECIMAL(15,2) COMMENT '税额',
    total_amount DECIMAL(15,2) COMMENT '发票金额（含税）',
    invoice_date DATE COMMENT '开票日期',
    invoice_code VARCHAR(50) COMMENT '发票代码（纸质发票）',
    invoice_number VARCHAR(50) COMMENT '发票号码',
    status INT DEFAULT 2 COMMENT '发票状态：1=未开具, 2=已开具, 3=已认证, 4=已作废',
    remark TEXT COMMENT '备注',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted INT DEFAULT 0 COMMENT '逻辑删除',
    INDEX idx_user_id (user_id),
    INDEX idx_invoice_no (invoice_no),
    INDEX idx_direction (direction),
    INDEX idx_invoice_date (invoice_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='发票表';

-- =====================================================
-- 7. 合同表
-- =====================================================
CREATE TABLE IF NOT EXISTS fb_contracts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '合同ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    contract_no VARCHAR(50) NOT NULL COMMENT '合同编号',
    name VARCHAR(200) NOT NULL COMMENT '合同名称',
    type INT NOT NULL COMMENT '合同类型：1=销售合同, 2=采购合同, 3=服务合同, 4=租赁合同, 5=其他',
    direction INT COMMENT '签约方向：1=我方签约, 2=对方签约',
    customer_id BIGINT COMMENT '客户ID（销售合同时）',
    supplier_id BIGINT COMMENT '供应商ID（采购合同时）',
    party_name VARCHAR(200) COMMENT '签约方名称',
    amount DECIMAL(15,2) COMMENT '合同金额',
    executed_amount DECIMAL(15,2) DEFAULT 0 COMMENT '已执行金额',
    start_date DATE COMMENT '合同开始日期',
    end_date DATE COMMENT '合同结束日期',
    sign_date DATE COMMENT '签订日期',
    attachment_url VARCHAR(500) COMMENT '合同附件URL',
    status INT DEFAULT 1 COMMENT '合同状态：1=拟定中, 2=审批中, 3=执行中, 4=已完成, 5=已终止',
    remark TEXT COMMENT '备注',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted INT DEFAULT 0 COMMENT '逻辑删除',
    INDEX idx_user_id (user_id),
    INDEX idx_contract_no (contract_no),
    INDEX idx_type (type),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='合同表';

-- =====================================================
-- 8. 预算表
-- =====================================================
CREATE TABLE IF NOT EXISTS fb_budgets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '预算ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    year INT NOT NULL COMMENT '预算年度',
    month INT DEFAULT 0 COMMENT '预算月份（0=年度预算, 1-12=月度预算）',
    type INT NOT NULL COMMENT '预算类型：1=收入预算, 2=支出预算',
    category VARCHAR(100) COMMENT '预算项目/分类',
    budget_amount DECIMAL(15,2) NOT NULL COMMENT '预算金额',
    executed_amount DECIMAL(15,2) DEFAULT 0 COMMENT '已执行金额',
    execution_rate DECIMAL(5,2) DEFAULT 0 COMMENT '执行率',
    remark TEXT COMMENT '备注',
    status INT DEFAULT 1 COMMENT '状态：1=草稿, 2=已提交, 3=已审批, 4=执行中',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted INT DEFAULT 0 COMMENT '逻辑删除',
    INDEX idx_user_id (user_id),
    INDEX idx_year_month (year, month),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='预算表';

-- =====================================================
-- 9. 回款记录表（核销应收）
-- =====================================================
CREATE TABLE IF NOT EXISTS fb_collection_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '记录ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    ar_bill_id BIGINT NOT NULL COMMENT '关联应收账单ID',
    amount DECIMAL(15,2) NOT NULL COMMENT '回款金额',
    collection_date DATE COMMENT '回款日期',
    payment_method INT COMMENT '回款方式：1=银行转账, 2=现金, 3=支票, 4=汇票, 5=其他',
    bank_name VARCHAR(200) COMMENT '银行名称',
    transaction_no VARCHAR(50) COMMENT '银行流水号',
    remark TEXT COMMENT '备注',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_user_id (user_id),
    INDEX idx_ar_bill_id (ar_bill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='回款记录表';

-- =====================================================
-- 10. 付款记录表（核销应付）
-- =====================================================
CREATE TABLE IF NOT EXISTS fb_payment_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '记录ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    ap_bill_id BIGINT NOT NULL COMMENT '关联应付账单ID',
    amount DECIMAL(15,2) NOT NULL COMMENT '付款金额',
    payment_date DATE COMMENT '付款日期',
    payment_method INT COMMENT '付款方式：1=银行转账, 2=现金, 3=支票, 4=汇票, 5=其他',
    bank_name VARCHAR(200) COMMENT '银行名称',
    transaction_no VARCHAR(50) COMMENT '银行流水号',
    remark TEXT COMMENT '备注',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_user_id (user_id),
    INDEX idx_ap_bill_id (ap_bill_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='付款记录表';

-- =====================================================
-- 11. 分类表（收支分类）
-- =====================================================
CREATE TABLE IF NOT EXISTS fb_categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '分类ID',
    user_id BIGINT NOT NULL DEFAULT 0 COMMENT '所属用户ID（0=系统分类）',
    type INT NOT NULL COMMENT '类型：1=支出, 2=收入',
    name VARCHAR(100) NOT NULL COMMENT '分类名称',
    icon VARCHAR(50) COMMENT '图标',
    color VARCHAR(20) COMMENT '颜色',
    is_system INT DEFAULT 0 COMMENT '是否系统分类：1=是, 0=否',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status INT DEFAULT 1 COMMENT '状态：1=正常, 0=禁用',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted INT DEFAULT 0 COMMENT '逻辑删除',
    INDEX idx_user_id (user_id),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类表';

-- =====================================================
-- 12. 收支记录表
-- =====================================================
CREATE TABLE IF NOT EXISTS fb_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '记录ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    type INT NOT NULL COMMENT '类型：1=支出, 2=收入',
    category_id BIGINT COMMENT '分类ID',
    amount DECIMAL(15,2) NOT NULL COMMENT '金额',
    description VARCHAR(500) COMMENT '描述/备注',
    transaction_date DATE NOT NULL COMMENT '交易日期',
    account_id BIGINT COMMENT '账户ID',
    customer_id BIGINT COMMENT '客户ID（收入时关联）',
    supplier_id BIGINT COMMENT '供应商ID（支出时关联）',
    status INT DEFAULT 1 COMMENT '状态：1=已支付, 2=待收/待付',
    payment_method INT COMMENT '支付方式：1=现金, 2=银行转账, 3=微信, 4=支付宝, 5=其他',
    invoice_no VARCHAR(50) COMMENT '发票号',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted INT DEFAULT 0 COMMENT '逻辑删除',
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_category_id (category_id),
    INDEX idx_transaction_date (transaction_date),
    INDEX idx_customer_id (customer_id),
    INDEX idx_supplier_id (supplier_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收支记录表';

-- =====================================================
-- 13. 账户表
-- =====================================================
CREATE TABLE IF NOT EXISTS fb_accounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '账户ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    name VARCHAR(100) NOT NULL COMMENT '账户名称',
    type INT DEFAULT 1 COMMENT '账户类型：1=现金, 2=银行, 3=微信, 4=支付宝, 5=其他',
    balance DECIMAL(15,2) DEFAULT 0 COMMENT '余额',
    card_no VARCHAR(50) COMMENT '卡号',
    bank_name VARCHAR(200) COMMENT '开户银行',
    remark TEXT COMMENT '备注',
    status INT DEFAULT 1 COMMENT '状态：1=正常, 0=禁用',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted INT DEFAULT 0 COMMENT '逻辑删除',
    INDEX idx_user_id (user_id),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='账户表';

-- =====================================================
-- 14. 登录日志表
-- =====================================================
CREATE TABLE IF NOT EXISTS fb_login_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '日志ID',
    user_id BIGINT COMMENT '用户ID',
    username VARCHAR(50) NOT NULL COMMENT '用户名',
    login_status INT DEFAULT 1 COMMENT '登录状态：1=成功, 0=失败',
    fail_reason VARCHAR(200) COMMENT '失败原因',
    ip_address VARCHAR(50) COMMENT 'IP地址',
    user_agent VARCHAR(500) COMMENT 'User-Agent',
    login_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '登录时间',
    INDEX idx_user_id (user_id),
    INDEX idx_username (username),
    INDEX idx_login_time (login_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='登录日志表';

-- =====================================================
-- 初始化系统分类
-- =====================================================
-- 支出分类
INSERT INTO fb_categories (user_id, type, name, icon, color, is_system, sort_order, status) VALUES
(0, 1, '餐饮', '🍜', '#FF6B6B', 1, 1, 1),
(0, 1, '交通', '🚗', '#4ECDC4', 1, 2, 1),
(0, 1, '购物', '🛒', '#FFE66D', 1, 3, 1),
(0, 1, '居住', '🏠', '#95E1D3', 1, 4, 1),
(0, 1, '娱乐', '🎮', '#DDA0DD', 1, 5, 1),
(0, 1, '医疗', '💊', '#98D8C8', 1, 6, 1),
(0, 1, '教育', '📚', '#F7DC6F', 1, 7, 1),
(0, 1, '通讯', '📱', '#BB8FCE', 1, 8, 1),
(0, 1, '其他', '📌', '#999999', 1, 99, 1);

-- 收入分类
INSERT INTO fb_categories (user_id, type, name, icon, color, is_system, sort_order, status) VALUES
(0, 2, '工资', '💰', '#7ED7C1', 1, 1, 1),
(0, 2, '奖金', '🎁', '#FFB3C6', 1, 2, 1),
(0, 2, '投资收益', '📈', '#AED6F1', 1, 3, 1),
(0, 2, '兼职', '💼', '#F5B7B1', 1, 4, 1),
(0, 2, '退款', '🔙', '#D7BDE2', 1, 5, 1),
(0, 2, '其他', '📌', '#999999', 1, 99, 1);

-- =====================================================
-- 初始化测试用户（密码: 123456）
-- =====================================================
INSERT INTO fb_users (username, password_hash, user_type, nickname, business_name, phone, status)
VALUES ('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH', 3, '管理员', '财务管家科技有限公司', '13800138000', 1);
