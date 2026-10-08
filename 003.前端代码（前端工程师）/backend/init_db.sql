-- =========================================
-- 轻记账数据库初始化脚本
-- 请根据你的 MySQL 配置修改密码
-- =========================================

-- 创建数据库
CREATE DATABASE IF NOT EXISTS light_accounting CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE light_accounting;

-- =========================================
-- 用户表
-- =========================================
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nickname VARCHAR(100),
    phone VARCHAR(20),
    user_type TINYINT DEFAULT 1 COMMENT '1=个人, 2=个体户, 3=企业',
    status TINYINT DEFAULT 1 COMMENT '1=正常, 0=禁用',
    last_login_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================
-- 登录日志表
-- =========================================
CREATE TABLE IF NOT EXISTS login_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    login_status TINYINT DEFAULT 1 COMMENT '1=成功, 0=失败',
    fail_reason VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================
-- 分类表
-- =========================================
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    type TINYINT NOT NULL COMMENT '1=支出, 2=收入',
    icon VARCHAR(10) DEFAULT '💰',
    color VARCHAR(20) DEFAULT '#FF6B6B',
    sort_order INT DEFAULT 0,
    is_system TINYINT DEFAULT 0 COMMENT '1=系统分类不可删除',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================
-- 收支记录表
-- =========================================
CREATE TABLE IF NOT EXISTS transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    transaction_no VARCHAR(20) NOT NULL UNIQUE,
    type TINYINT NOT NULL COMMENT '1=支出, 2=收入',
    amount DECIMAL(12,2) NOT NULL,
    category_id INT NOT NULL,
    date DATE NOT NULL,
    time TIME DEFAULT CURRENT_TIME,
    payment_method TINYINT COMMENT '1=现金, 2=微信, 3=支付宝, 4=银行卡, 5=其他',
    counterparty VARCHAR(100),
    counterparty_type TINYINT COMMENT '1=客户, 2=供应商, 3=其他',
    counterparty_id INT,
    status TINYINT DEFAULT 1 COMMENT '1=已支付, 2=待收/待付',
    remark VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (counterparty_id) REFERENCES customers(id),
    INDEX idx_user_date (user_id, date),
    INDEX idx_user_type (user_id, type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================
-- 客户表
-- =========================================
CREATE TABLE IF NOT EXISTS customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    customer_type TINYINT COMMENT '1=个人, 2=企业',
    credit_limit DECIMAL(12,2) DEFAULT 0,
    outstanding_amount DECIMAL(12,2) DEFAULT 0,
    remark VARCHAR(500),
    status TINYINT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================
-- 供应商表
-- =========================================
CREATE TABLE IF NOT EXISTS suppliers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    contact_person VARCHAR(50),
    products VARCHAR(255),
    settlement_type TINYINT COMMENT '1=即时, 2=月结, 3=季结',
    outstanding_amount DECIMAL(12,2) DEFAULT 0,
    remark VARCHAR(500),
    status TINYINT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================
-- 系统分类数据（支出）
-- =========================================
INSERT IGNORE INTO categories (user_id, name, type, icon, color, sort_order, is_system) VALUES
(1, '餐饮', 1, '🍔', '#FF6B6B', 1, 1),
(1, '交通', 1, '🚗', '#FFA07A', 2, 1),
(1, '购物', 1, '🛒', '#FFB3C6', 3, 1),
(1, '居住', 1, '🏠', '#FF6B9D', 4, 1),
(1, '医疗', 1, '💊', '#FF8FAB', 5, 1),
(1, '通讯', 1, '📱', '#FFB347', 6, 1),
(1, '娱乐', 1, '🎮', '#FFD700', 7, 1),
(1, '教育', 1, '📚', '#96CEB4', 8, 1);

-- =========================================
-- 系统分类数据（收入）
-- =========================================
INSERT IGNORE INTO categories (user_id, name, type, icon, color, sort_order, is_system) VALUES
(1, '工资', 2, '💰', '#7ED7C1', 1, 1),
(1, '奖金', 2, '🎁', '#4ECDC4', 2, 1),
(1, '投资收益', 2, '📈', '#45B7D1', 3, 1),
(1, '兼职', 2, '💼', '#96CEB4', 4, 1),
(1, '礼金', 2, '🎊', '#DDA0DD', 5, 1);
