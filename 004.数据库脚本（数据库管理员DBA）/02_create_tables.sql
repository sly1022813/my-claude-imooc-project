-- =====================================================
-- 轻记账数据表创建脚本
-- 文件：02_create_tables.sql
-- 说明：创建所有业务数据表
-- =====================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
USE `light_accounting`;

-- =====================================================
-- 表1：用户表 (users)
-- =====================================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '用户ID',
    `username` VARCHAR(50) NOT NULL COMMENT '用户名',
    `password_hash` VARCHAR(255) NOT NULL COMMENT '密码哈希(SHA-256)',
    `user_type` TINYINT NOT NULL DEFAULT 1 COMMENT '用户类型:1=个人,2=个体户,3=企业',
    `nickname` VARCHAR(100) DEFAULT NULL COMMENT '昵称',
    `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
    `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
    `avatar_url` VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
    `business_name` VARCHAR(200) DEFAULT NULL COMMENT '商户名称(商户用户)',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态:1=正常,0=禁用',
    `last_login_at` DATETIME DEFAULT NULL COMMENT '最后登录时间',
    `last_login_ip` VARCHAR(45) DEFAULT NULL COMMENT '最后登录IP',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_users_username` (`username`),
    KEY `idx_users_status` (`status`),
    KEY `idx_users_created_at` (`created_at`),
    KEY `idx_users_user_type` (`user_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- =====================================================
-- 表2：分类表 (categories)
-- =====================================================
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分类ID',
    `user_id` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '用户ID(0=系统分类)',
    `type` TINYINT NOT NULL COMMENT '类型:1=支出,2=收入',
    `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
    `icon` VARCHAR(50) NOT NULL DEFAULT '📌' COMMENT '图标(Emoji)',
    `color` VARCHAR(20) DEFAULT NULL COMMENT '颜色值(#RRGGBB)',
    `is_system` TINYINT NOT NULL DEFAULT 0 COMMENT '是否系统分类:1=是,0=否',
    `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序(越小越靠前)',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态:1=启用,0=禁用',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_categories_user_type` (`user_id`, `type`),
    KEY `idx_categories_status` (`status`),
    KEY `idx_categories_sort` (`sort_order`),
    KEY `idx_categories_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收支分类表';

-- =====================================================
-- 表3：客户表 (customers)
-- =====================================================
DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '客户ID',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    `name` VARCHAR(100) NOT NULL COMMENT '客户名称',
    `phone` VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
    `address` VARCHAR(500) DEFAULT NULL COMMENT '地址',
    `customer_type` TINYINT DEFAULT NULL COMMENT '客户类型:1=个人,2=企业',
    `credit_limit` DECIMAL(15,2) DEFAULT NULL COMMENT '信用额度',
    `total_transaction` DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT '累计交易金额',
    `outstanding_amount` DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT '当前欠款金额',
    `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态:1=正常,0=禁用',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_customers_user` (`user_id`),
    KEY `idx_customers_name` (`name`),
    KEY `idx_customers_status` (`status`),
    KEY `idx_customers_phone` (`phone`),
    CONSTRAINT `fk_customers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='客户表';

-- =====================================================
-- 表4：供应商表 (suppliers)
-- =====================================================
DROP TABLE IF EXISTS `suppliers`;
CREATE TABLE `suppliers` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '供应商ID',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    `name` VARCHAR(100) NOT NULL COMMENT '供应商名称',
    `phone` VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
    `address` VARCHAR(500) DEFAULT NULL COMMENT '地址',
    `contact_person` VARCHAR(50) DEFAULT NULL COMMENT '联系人',
    `products` VARCHAR(500) DEFAULT NULL COMMENT '主营商品',
    `settlement_type` TINYINT DEFAULT NULL COMMENT '结算方式:1=即时,2=月结,3=季结',
    `total_purchase` DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT '累计采购金额',
    `outstanding_amount` DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT '当前欠款金额',
    `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态:1=正常,0=禁用',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_suppliers_user` (`user_id`),
    KEY `idx_suppliers_name` (`name`),
    KEY `idx_suppliers_status` (`status`),
    KEY `idx_suppliers_phone` (`phone`),
    CONSTRAINT `fk_suppliers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='供应商表';

-- =====================================================
-- 表5：收支记录表 (transactions)
-- =====================================================
DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '记录ID',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    `transaction_no` VARCHAR(30) NOT NULL COMMENT '流水号',
    `type` TINYINT NOT NULL COMMENT '类型:1=支出,2=收入',
    `amount` DECIMAL(15,2) NOT NULL COMMENT '金额(正数存储)',
    `category_id` BIGINT UNSIGNED NOT NULL COMMENT '分类ID',
    `date` DATE NOT NULL COMMENT '交易日期',
    `time` TIME NOT NULL DEFAULT CURRENT_TIME() COMMENT '交易时间',
    `payment_method` TINYINT DEFAULT NULL COMMENT '支付方式:1=现金,2=微信,3=支付宝,4=银行卡,5=其他',
    `counterparty` VARCHAR(200) DEFAULT NULL COMMENT '对方单位/客户/供应商名称',
    `counterparty_type` TINYINT DEFAULT NULL COMMENT '对方类型:1=客户,2=供应商,3=其他',
    `counterparty_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '对方ID(客户或供应商)',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态:1=已支付/已收讫,2=挂账/待收',
    `related_transaction_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联记录ID(用于收讫关联)',
    `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_transactions_no` (`transaction_no`),
    KEY `idx_transactions_user_date` (`user_id`, `date`),
    KEY `idx_transactions_user_type` (`user_id`, `type`),
    KEY `idx_transactions_category` (`category_id`),
    KEY `idx_transactions_status` (`status`),
    KEY `idx_transactions_created` (`created_at`),
    KEY `idx_transactions_type` (`type`),
    KEY `idx_transactions_counterparty` (`counterparty_type`, `counterparty_id`),
    CONSTRAINT `fk_transactions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_transactions_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_transactions_counterparty_customer` FOREIGN KEY (`counterparty_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_transactions_counterparty_supplier` FOREIGN KEY (`counterparty_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收支记录表';

-- =====================================================
-- 表6：附件表 (attachments)
-- =====================================================
DROP TABLE IF EXISTS `attachments`;
CREATE TABLE `attachments` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '附件ID',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    `ref_type` VARCHAR(30) NOT NULL COMMENT '关联类型:transaction/customer/supplier',
    `ref_id` BIGINT UNSIGNED NOT NULL COMMENT '关联ID',
    `file_path` VARCHAR(500) NOT NULL COMMENT '文件存储路径',
    `file_name` VARCHAR(255) NOT NULL COMMENT '原始文件名',
    `file_size` BIGINT NOT NULL COMMENT '文件大小(字节)',
    `file_type` VARCHAR(50) NOT NULL COMMENT '文件MIME类型',
    `file_hash` VARCHAR(64) DEFAULT NULL COMMENT '文件SHA-256哈希',
    `description` VARCHAR(200) DEFAULT NULL COMMENT '文件描述',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
    PRIMARY KEY (`id`),
    KEY `idx_attachments_ref` (`ref_type`, `ref_id`),
    KEY `idx_attachments_user` (`user_id`),
    KEY `idx_attachments_created` (`created_at`),
    CONSTRAINT `fk_attachments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='附件表(发票/凭证)';

-- =====================================================
-- 表7：登录日志表 (login_logs)
-- =====================================================
DROP TABLE IF EXISTS `login_logs`;
CREATE TABLE `login_logs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '日志ID',
    `user_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '用户ID(登录成功时)',
    `username` VARCHAR(50) NOT NULL COMMENT '尝试登录的用户名',
    `login_status` TINYINT NOT NULL COMMENT '登录状态:1=成功,0=失败',
    `fail_reason` VARCHAR(100) DEFAULT NULL COMMENT '失败原因',
    `ip_address` VARCHAR(45) NOT NULL COMMENT 'IP地址(支持IPv6)',
    `user_agent` VARCHAR(500) DEFAULT NULL COMMENT '浏览器UA',
    `login_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登录时间',
    PRIMARY KEY (`id`),
    KEY `idx_login_logs_user` (`user_id`),
    KEY `idx_login_logs_time` (`login_time`),
    KEY `idx_login_logs_ip` (`ip_address`),
    KEY `idx_login_logs_status` (`login_status`),
    CONSTRAINT `fk_login_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='登录日志表';

-- =====================================================
-- 表8：数据备份记录表 (backup_records)
-- =====================================================
DROP TABLE IF EXISTS `backup_records`;
CREATE TABLE `backup_records` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '备份ID',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    `backup_type` TINYINT NOT NULL COMMENT '备份类型:1=手动,2=自动',
    `file_path` VARCHAR(500) NOT NULL COMMENT '备份文件路径',
    `file_size` BIGINT NOT NULL COMMENT '文件大小(字节)',
    `record_count` INT NOT NULL DEFAULT 0 COMMENT '记录数量',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态:1=成功,0=失败',
    `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '备份时间',
    PRIMARY KEY (`id`),
    KEY `idx_backup_user` (`user_id`),
    KEY `idx_backup_time` (`created_at`),
    KEY `idx_backup_status` (`status`),
    CONSTRAINT `fk_backup_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='数据备份记录表';

-- =====================================================
-- 表9：快捷金额模板表 (quick_amount_templates)
-- =====================================================
DROP TABLE IF EXISTS `quick_amount_templates`;
CREATE TABLE `quick_amount_templates` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '模板ID',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    `name` VARCHAR(100) NOT NULL COMMENT '模板名称',
    `amount` DECIMAL(15,2) NOT NULL COMMENT '金额',
    `category_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '默认分类ID',
    `payment_method` TINYINT DEFAULT NULL COMMENT '默认支付方式',
    `remark` VARCHAR(200) DEFAULT NULL COMMENT '备注',
    `use_count` INT NOT NULL DEFAULT 0 COMMENT '使用次数',
    `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态:1=启用,0=禁用',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_quick_user` (`user_id`),
    KEY `idx_quick_status` (`status`),
    KEY `idx_quick_sort` (`sort_order`),
    CONSTRAINT `fk_quick_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_quick_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='快捷金额模板表';

-- =====================================================
-- 表10：用户设置表 (user_settings)
-- =====================================================
DROP TABLE IF EXISTS `user_settings`;
CREATE TABLE `user_settings` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '设置ID',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    `setting_key` VARCHAR(100) NOT NULL COMMENT '设置键',
    `setting_value` TEXT DEFAULT NULL COMMENT '设置值',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_settings_user_key` (`user_id`, `setting_key`),
    KEY `idx_settings_key` (`setting_key`),
    CONSTRAINT `fk_settings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户设置表';

-- =====================================================
-- 输出创建结果
-- =====================================================
SELECT '数据表创建完成!' AS message,
       COUNT(*) AS table_count
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'light_accounting';

SET FOREIGN_KEY_CHECKS = 1;
