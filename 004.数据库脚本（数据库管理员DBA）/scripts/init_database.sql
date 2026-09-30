-- =====================================================
-- 轻记账数据库初始化脚本
-- 数据库名称: light_accounting
-- MySQL 8.0+
-- 创建日期: 2026-10-01
-- =====================================================

-- 1. 创建数据库
CREATE DATABASE IF NOT EXISTS `light_accounting`
    DEFAULT CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci
    COMMENT = '轻记账财务管理系统数据库';

-- 切换到目标数据库
USE `light_accounting`;

-- 2. 设置字符集
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- 表 1: 用户表 (users)
-- =====================================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_code` VARCHAR(32) NOT NULL COMMENT '用户编码',
    `username` VARCHAR(50) NOT NULL COMMENT '用户名',
    `password_hash` VARCHAR(255) NOT NULL COMMENT '密码哈希(bcrypt)',
    `user_type` ENUM('personal', 'merchant', 'enterprise') NOT NULL DEFAULT 'personal' COMMENT '用户类型',
    `nickname` VARCHAR(100) DEFAULT NULL COMMENT '昵称',
    `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
    `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
    `avatar_url` VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态: 0=禁用, 1=正常',
    `last_login_at` DATETIME DEFAULT NULL COMMENT '最后登录时间',
    `last_login_ip` VARCHAR(45) DEFAULT NULL COMMENT '最后登录IP',
    `login_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '登录次数',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` DATETIME DEFAULT NULL COMMENT '删除时间(软删除)',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_users_code` (`user_code`),
    UNIQUE KEY `uk_users_username` (`username`),
    KEY `idx_users_type` (`user_type`),
    KEY `idx_users_status` (`status`),
    KEY `idx_users_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- =====================================================
-- 表 2: 用户设置表 (user_settings)
-- =====================================================
DROP TABLE IF EXISTS `user_settings`;
CREATE TABLE `user_settings` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    `currency` VARCHAR(10) NOT NULL DEFAULT '¥' COMMENT '默认货币符号',
    `default_payment_method` VARCHAR(20) DEFAULT 'wechat' COMMENT '默认支付方式',
    `theme` ENUM('light', 'dark', 'auto') NOT NULL DEFAULT 'light' COMMENT '主题',
    `language` VARCHAR(10) NOT NULL DEFAULT 'zh-CN' COMMENT '语言',
    `daily_reminder` TINYINT NOT NULL DEFAULT 1 COMMENT '每日提醒',
    `reminder_time` TIME DEFAULT '22:00:00' COMMENT '提醒时间',
    `month_start_day` TINYINT NOT NULL DEFAULT 1 COMMENT '账期起始日',
    `auto_backup` TINYINT NOT NULL DEFAULT 0 COMMENT '自动备份',
    `backup_frequency` VARCHAR(20) DEFAULT 'weekly' COMMENT '备份频率',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_settings_user` (`user_id`),
    CONSTRAINT `fk_settings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户设置表';

-- =====================================================
-- 表 3: 分类表 (categories)
-- =====================================================
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `category_code` VARCHAR(32) NOT NULL COMMENT '分类编码',
    `user_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '用户ID(NULL表示系统默认)',
    `name` VARCHAR(50) NOT NULL COMMENT '分类名称',
    `icon` VARCHAR(10) DEFAULT '📦' COMMENT '分类图标',
    `type` ENUM('income', 'expense') NOT NULL COMMENT '类型: income=收入, expense=支出',
    `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序',
    `is_system` TINYINT NOT NULL DEFAULT 0 COMMENT '是否系统内置',
    `is_active` TINYINT NOT NULL DEFAULT 1 COMMENT '是否启用',
    `color` VARCHAR(7) DEFAULT '#9b3f5a' COMMENT '分类颜色',
    `description` VARCHAR(200) DEFAULT NULL COMMENT '分类描述',
    `parent_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '父分类ID',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` DATETIME DEFAULT NULL COMMENT '删除时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_categories_code` (`category_code`),
    KEY `idx_categories_user` (`user_id`),
    KEY `idx_categories_type` (`type`),
    KEY `idx_categories_user_type` (`user_id`, `type`),
    CONSTRAINT `fk_categories_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类表';

-- =====================================================
-- 表 4: 客户表 (customers)
-- =====================================================
DROP TABLE IF EXISTS `customers`;
CREATE TABLE `customers` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `customer_code` VARCHAR(32) NOT NULL COMMENT '客户编码',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    `name` VARCHAR(100) NOT NULL COMMENT '客户名称',
    `contact_person` VARCHAR(50) DEFAULT NULL COMMENT '联系人',
    `phone` VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
    `mobile` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
    `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
    `address` VARCHAR(500) DEFAULT NULL COMMENT '地址',
    `province` VARCHAR(50) DEFAULT NULL COMMENT '省份',
    `city` VARCHAR(50) DEFAULT NULL COMMENT '城市',
    `district` VARCHAR(50) DEFAULT NULL COMMENT '区县',
    `balance` DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT '当前余额',
    `credit_limit` DECIMAL(15,2) DEFAULT NULL COMMENT '信用额度',
    `customer_type` VARCHAR(20) DEFAULT 'regular' COMMENT '客户类型',
    `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态',
    `last_trade_at` DATETIME DEFAULT NULL COMMENT '最后交易时间',
    `total_trade_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '累计交易次数',
    `total_trade_amount` DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT '累计交易金额',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` DATETIME DEFAULT NULL COMMENT '删除时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_customers_code` (`customer_code`),
    KEY `idx_customers_user` (`user_id`),
    KEY `idx_customers_name` (`name`),
    KEY `idx_customers_phone` (`phone`),
    KEY `idx_customers_balance` (`balance`),
    CONSTRAINT `fk_customers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='客户表';

-- =====================================================
-- 表 5: 供应商表 (suppliers)
-- =====================================================
DROP TABLE IF EXISTS `suppliers`;
CREATE TABLE `suppliers` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `supplier_code` VARCHAR(32) NOT NULL COMMENT '供应商编码',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    `name` VARCHAR(100) NOT NULL COMMENT '供应商名称',
    `contact_person` VARCHAR(50) DEFAULT NULL COMMENT '联系人',
    `phone` VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
    `mobile` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
    `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
    `address` VARCHAR(500) DEFAULT NULL COMMENT '地址',
    `province` VARCHAR(50) DEFAULT NULL COMMENT '省份',
    `city` VARCHAR(50) DEFAULT NULL COMMENT '城市',
    `district` VARCHAR(50) DEFAULT NULL COMMENT '区县',
    `products` VARCHAR(500) DEFAULT NULL COMMENT '主营商品',
    `balance` DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT '当前余额',
    `payment_terms` VARCHAR(50) DEFAULT NULL COMMENT '付款条款',
    `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态',
    `last_trade_at` DATETIME DEFAULT NULL COMMENT '最后交易时间',
    `total_trade_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '累计交易次数',
    `total_trade_amount` DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT '累计交易金额',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` DATETIME DEFAULT NULL COMMENT '删除时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_suppliers_code` (`supplier_code`),
    KEY `idx_suppliers_user` (`user_id`),
    KEY `idx_suppliers_name` (`name`),
    KEY `idx_suppliers_phone` (`phone`),
    KEY `idx_suppliers_balance` (`balance`),
    CONSTRAINT `fk_suppliers_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='供应商表';

-- =====================================================
-- 表 6: 账目记录表 (account_records)
-- =====================================================
DROP TABLE IF EXISTS `account_records`;
CREATE TABLE `account_records` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `record_code` VARCHAR(32) NOT NULL COMMENT '记录编码',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    `category_id` BIGINT UNSIGNED NOT NULL COMMENT '分类ID',
    `type` ENUM('income', 'expense') NOT NULL COMMENT '类型',
    `amount` DECIMAL(15,2) NOT NULL COMMENT '金额',
    `currency` VARCHAR(10) NOT NULL DEFAULT '¥' COMMENT '货币符号',
    `payment_channel` VARCHAR(20) NOT NULL DEFAULT 'wechat' COMMENT '支付渠道',
    `record_date` DATE NOT NULL COMMENT '记账日期',
    `record_time` TIME NOT NULL COMMENT '记账时间',
    `note` VARCHAR(500) DEFAULT NULL COMMENT '备注',
    `customer_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联客户ID',
    `supplier_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联供应商ID',
    `tags` VARCHAR(500) DEFAULT NULL COMMENT '标签(JSON)',
    `attach_count` INT NOT NULL DEFAULT 0 COMMENT '附件数量',
    `is_reconciled` TINYINT NOT NULL DEFAULT 0 COMMENT '是否对账',
    `reconciled_at` DATETIME DEFAULT NULL COMMENT '对账时间',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted_at` DATETIME DEFAULT NULL COMMENT '删除时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_records_code` (`record_code`),
    KEY `idx_records_user` (`user_id`),
    KEY `idx_records_type` (`type`),
    KEY `idx_records_category` (`category_id`),
    KEY `idx_records_date` (`record_date`),
    KEY `idx_records_user_date` (`user_id`, `record_date`),
    KEY `idx_records_user_month` (`user_id`, `record_date`, `type`),
    KEY `idx_records_customer` (`customer_id`),
    KEY `idx_records_supplier` (`supplier_id`),
    CONSTRAINT `fk_records_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_records_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT,
    CONSTRAINT `fk_records_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_records_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='账目记录表';

-- =====================================================
-- 表 7: 客户余额表 (customer_balances)
-- =====================================================
DROP TABLE IF EXISTS `customer_balances`;
CREATE TABLE `customer_balances` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `balance_code` VARCHAR(32) NOT NULL COMMENT '余额变动编码',
    `customer_id` BIGINT UNSIGNED NOT NULL COMMENT '客户ID',
    `record_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联账目记录ID',
    `change_type` ENUM('add', 'reduce', 'adjust') NOT NULL COMMENT '变动类型',
    `amount` DECIMAL(15,2) NOT NULL COMMENT '变动金额',
    `balance_before` DECIMAL(15,2) NOT NULL COMMENT '变动前余额',
    `balance_after` DECIMAL(15,2) NOT NULL COMMENT '变动后余额',
    `description` VARCHAR(200) DEFAULT NULL COMMENT '变动说明',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_balances_code` (`balance_code`),
    KEY `idx_balances_customer` (`customer_id`),
    KEY `idx_balances_record` (`record_id`),
    KEY `idx_balances_created` (`created_at`),
    CONSTRAINT `fk_balances_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='客户余额表';

-- =====================================================
-- 表 8: 供应商余额表 (supplier_balances)
-- =====================================================
DROP TABLE IF EXISTS `supplier_balances`;
CREATE TABLE `supplier_balances` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `balance_code` VARCHAR(32) NOT NULL COMMENT '余额变动编码',
    `supplier_id` BIGINT UNSIGNED NOT NULL COMMENT '供应商ID',
    `record_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '关联账目记录ID',
    `change_type` ENUM('add', 'reduce', 'adjust') NOT NULL COMMENT '变动类型',
    `amount` DECIMAL(15,2) NOT NULL COMMENT '变动金额',
    `balance_before` DECIMAL(15,2) NOT NULL COMMENT '变动前余额',
    `balance_after` DECIMAL(15,2) NOT NULL COMMENT '变动后余额',
    `description` VARCHAR(200) DEFAULT NULL COMMENT '变动说明',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_balances_code` (`balance_code`),
    KEY `idx_balances_supplier` (`supplier_id`),
    KEY `idx_balances_record` (`record_id`),
    KEY `idx_balances_created` (`created_at`),
    CONSTRAINT `fk_balances_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='供应商余额表';

-- =====================================================
-- 表 9: 操作日志表 (operation_logs)
-- =====================================================
DROP TABLE IF EXISTS `operation_logs`;
CREATE TABLE `operation_logs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` BIGINT UNSIGNED DEFAULT NULL COMMENT '操作用户ID',
    `username` VARCHAR(50) DEFAULT NULL COMMENT '操作用户名',
    `action` VARCHAR(50) NOT NULL COMMENT '操作类型',
    `module` VARCHAR(50) DEFAULT NULL COMMENT '操作模块',
    `target_type` VARCHAR(50) DEFAULT NULL COMMENT '操作对象类型',
    `target_id` VARCHAR(32) DEFAULT NULL COMMENT '操作对象ID',
    `ip_address` VARCHAR(45) DEFAULT NULL COMMENT 'IP地址',
    `user_agent` VARCHAR(500) DEFAULT NULL COMMENT '浏览器UA',
    `request_params` TEXT DEFAULT NULL COMMENT '请求参数',
    `response_result` TEXT DEFAULT NULL COMMENT '操作结果',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态',
    `error_message` VARCHAR(500) DEFAULT NULL COMMENT '错误信息',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
    PRIMARY KEY (`id`),
    KEY `idx_logs_user` (`user_id`),
    KEY `idx_logs_action` (`action`),
    KEY `idx_logs_target` (`target_type`, `target_id`),
    KEY `idx_logs_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='操作日志表';

-- =====================================================
-- 启用外键约束
-- =====================================================
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- 完成提示
-- =====================================================
SELECT '数据库初始化完成！' AS message;
SELECT '共创建 9 张表' AS tables_created;
