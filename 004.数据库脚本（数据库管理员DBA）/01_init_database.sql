-- =====================================================
-- 轻记账数据库初始化脚本
-- 文件：01_init_database.sql
-- 说明：创建数据库和默认配置
-- =====================================================

-- 设置客户端字符集
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------
-- 创建数据库
-- -----------------------------------------------------
DROP DATABASE IF EXISTS `light_accounting`;
CREATE DATABASE `light_accounting`
    DEFAULT CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci
    COMMENT '轻记账财务管理系统数据库';

-- 选择数据库
USE `light_accounting`;

-- -----------------------------------------------------
-- 数据库配置
-- -----------------------------------------------------

-- 设置时区为东八区
SET time_zone = '+08:00';

-- 设置SQL模式
SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- 字符集验证
-- -----------------------------------------------------
SELECT '数据库创建成功!' AS message,
       @@character_set_database AS charset,
       @@collation_database AS collation;

SET FOREIGN_KEY_CHECKS = 1;
