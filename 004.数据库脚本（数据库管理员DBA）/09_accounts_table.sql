-- =====================================================
-- 轻记账账户表脚本
-- 文件：09_accounts_table.sql
-- 说明：创建账户表
-- =====================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
USE `light_accounting`;

-- =====================================================
-- 账户表 (accounts)
-- =====================================================
DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '账户ID',
    `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
    `name` VARCHAR(100) NOT NULL COMMENT '账户名称',
    `type` VARCHAR(50) NOT NULL DEFAULT 'cash' COMMENT '账户类型: cash=现金, bank=银行卡, wechat=微信, alipay=支付宝, other=其他',
    `balance` DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT '账户余额',
    `icon` VARCHAR(50) DEFAULT '💳' COMMENT '图标(Emoji)',
    `color` VARCHAR(20) DEFAULT '#FF8FAB' COMMENT '颜色值(#RRGGBB)',
    `sort_order` INT NOT NULL DEFAULT 0 COMMENT '排序(越小越靠前)',
    `remark` VARCHAR(500) DEFAULT NULL COMMENT '备注',
    `status` TINYINT NOT NULL DEFAULT 1 COMMENT '状态:1=正常,0=禁用',
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_accounts_user` (`user_id`),
    KEY `idx_accounts_status` (`status`),
    KEY `idx_accounts_sort` (`sort_order`),
    CONSTRAINT `fk_accounts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='账户表';

-- =====================================================
-- 初始化默认账户
-- =====================================================
-- 注意：默认账户需要在用户注册时由应用程序创建

-- =====================================================
-- 输出创建结果
-- =====================================================
SELECT '账户表创建完成!' AS message;

SET FOREIGN_KEY_CHECKS = 1;
