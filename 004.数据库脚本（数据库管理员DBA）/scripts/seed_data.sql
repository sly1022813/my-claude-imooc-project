-- =====================================================
-- 轻记账数据库初始数据脚本
-- 数据库名称: light_accounting
-- 创建日期: 2026-10-01
-- 说明: 包含系统默认分类和测试用户数据
-- =====================================================

USE `light_accounting`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- 1. 插入系统默认支出分类
-- =====================================================
INSERT INTO `categories` (`category_code`, `user_id`, `name`, `icon`, `type`, `sort_order`, `is_system`, `is_active`, `color`, `description`) VALUES
('EXP001', NULL, '进货成本', '📦', 'expense', 1, 1, 1, '#FF6B6B', '商品进货成本'),
('EXP002', NULL, '餐饮成本', '🍜', 'expense', 2, 1, 1, '#FF6B6B', '餐饮食材成本'),
('EXP003', NULL, '房租水电', '💡', 'expense', 3, 1, 1, '#FF6B6B', '房租、水电、物业费'),
('EXP004', NULL, '员工工资', '💼', 'expense', 4, 1, 1, '#FF6B6B', '员工薪资、奖金'),
('EXP005', NULL, '运营费用', '📊', 'expense', 5, 1, 1, '#FF6B6B', '日常运营开支'),
('EXP006', NULL, '交通物流', '🚚', 'expense', 6, 1, 1, '#FF6B6B', '运输、物流费用'),
('EXP007', NULL, '办公用品', '📎', 'expense', 7, 1, 1, '#FF6B6B', '办公设备、耗材'),
('EXP008', NULL, '税费支出', '🧾', 'expense', 8, 1, 1, '#FF6B6B', '税费、罚款'),
('EXP009', NULL, '社交应酬', '☕', 'expense', 9, 1, 1, '#FF6B6B', '商务招待、社交应酬'),
('EXP010', NULL, '其他支出', '✨', 'expense', 10, 1, 1, '#FF6B6B', '其他杂项支出');

-- =====================================================
-- 2. 插入系统默认收入分类
-- =====================================================
INSERT INTO `categories` (`category_code`, `user_id`, `name`, `icon`, `type`, `sort_order`, `is_system`, `is_active`, `color`, `description`) VALUES
('INC001', NULL, '销售收入', '💰', 'income', 1, 1, 1, '#7ED7C1', '商品销售收入'),
('INC002', NULL, '服务收入', '🛒', 'income', 2, 1, 1, '#7ED7C1', '服务收费收入'),
('INC003', NULL, '其他收入', '🎁', 'income', 3, 1, 1, '#7ED7C1', '其他收入来源');

-- =====================================================
-- 3. 插入测试用户 (密码: 123456, bcrypt加密)
-- 注意: 生产环境请使用更复杂的密码和加密方式
-- =====================================================
-- bcrypt('123456') 的结果 (示例)
INSERT INTO `users` (`user_code`, `username`, `password_hash`, `user_type`, `nickname`, `status`) VALUES
('UA202610010001', 'admin', '$2b$10$rQZ5qN8K5Y5Y5Y5Y5Y5Y5OY5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y', 'merchant', '测试商户', 1),
('UA202610010002', 'testuser', '$2b$10$rQZ5qN8K5Y5Y5Y5Y5Y5Y5OY5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y5Y', 'personal', '测试用户', 1);

-- =====================================================
-- 4. 为测试用户创建设置
-- =====================================================
INSERT INTO `user_settings` (`user_id`, `currency`, `default_payment_method`, `theme`, `daily_reminder`, `reminder_time`, `month_start_day`) VALUES
(1, '¥', 'wechat', 'light', 1, '22:00:00', 1),
(2, '¥', 'alipay', 'light', 0, '21:00:00', 1);

-- =====================================================
-- 5. 为测试用户添加自定义分类
-- =====================================================
INSERT INTO `categories` (`category_code`, `user_id`, `name`, `icon`, `type`, `sort_order`, `is_system`, `is_active`, `color`) VALUES
('EXP_U001', 1, '采购办公用品', '🖨️', 'expense', 1, 0, 1, '#FFB347'),
('EXP_U002', 1, '市场营销', '📢', 'expense', 2, 0, 1, '#FFB347'),
('INC_U001', 1, '平台佣金', '💳', 'income', 1, 0, 1, '#7ED7C1'),
('EXP_U003', 2, '餐饮美食', '🍕', 'expense', 1, 0, 1, '#FF6B6B'),
('EXP_U004', 2, '交通出行', '🚗', 'expense', 2, 0, 1, '#FF6B6B'),
('INC_U002', 2, '工资收入', '💵', 'income', 1, 0, 1, '#7ED7C1');

-- =====================================================
-- 6. 插入测试客户数据
-- =====================================================
INSERT INTO `customers` (`customer_code`, `user_id`, `name`, `contact_person`, `phone`, `city`, `balance`, `customer_type`, `status`) VALUES
('CU202610010001', 1, '张三商贸', '张先生', '13800138001', '北京', 5000.00, 'vip', 1),
('CU202610010002', 1, '李四商行', '李女士', '13800138002', '上海', 3200.50, 'regular', 1),
('CU202610010003', 1, '王五小店', '王先生', '13800138003', '广州', 0.00, 'regular', 1);

-- =====================================================
-- 7. 插入测试供应商数据
-- =====================================================
INSERT INTO `suppliers` (`supplier_code`, `user_id`, `name`, `contact_person`, `phone`, `products`, `balance`, `status`) VALUES
('SU202610010001', 1, '优质供应商A', '刘经理', '13900139001', '日用百货', 8000.00, 1),
('SU202610010002', 1, '优质供应商B', '赵经理', '13900139002', '电子产品', 15000.00, 1),
('SU202610010003', 1, '优质供应商C', '周经理', '13900139003', '办公耗材', 2500.00, 1);

-- =====================================================
-- 8. 插入测试账目记录
-- =====================================================
INSERT INTO `account_records` (`record_code`, `user_id`, `category_id`, `type`, `amount`, `currency`, `payment_channel`, `record_date`, `record_time`, `note`) VALUES
-- 支出记录
('TX20261001100001', 1, 1, 'expense', 1500.00, '¥', 'wechat', '2026-10-01', '09:30:00', '采购第一批商品'),
('TX20261001100002', 1, 3, 'expense', 3000.00, '¥', 'alipay', '2026-10-01', '10:15:00', '本月房租'),
('TX20261001100003', 1, 5, 'expense', 500.00, '¥', 'cash', '2026-10-01', '14:20:00', '办公用品采购'),
('TX20261001100004', 1, 6, 'expense', 800.00, '¥', 'bank', '2026-09-30', '16:45:00', '物流费用'),
-- 收入记录
('TX20261001100005', 1, 11, 'income', 3500.00, '¥', 'wechat', '2026-10-01', '11:00:00', '销售收入-订单001'),
('TX20261001100006', 1, 12, 'income', 1200.00, '¥', 'alipay', '2026-10-01', '15:30:00', '服务费收入');

-- =====================================================
-- 9. 更新客户累计数据
-- =====================================================
UPDATE `customers` SET `total_trade_count` = 2, `total_trade_amount` = 4700.00, `last_trade_at` = NOW() WHERE `id` = 1;
UPDATE `customers` SET `total_trade_count` = 1, `total_trade_amount` = 1200.00, `last_trade_at` = NOW() WHERE `id` = 2;

-- =====================================================
-- 10. 更新供应商累计数据
-- =====================================================
UPDATE `suppliers` SET `total_trade_count` = 2, `total_trade_amount` = 2300.00, `last_trade_at` = NOW() WHERE `id` = 1;
UPDATE `suppliers` SET `total_trade_count` = 1, `total_trade_amount` = 1500.00, `last_trade_at` = NOW() WHERE `id` = 2;

-- =====================================================
-- 启用外键约束
-- =====================================================
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- 查询验证
-- =====================================================
SELECT '=== 分类统计 ===' AS info;
SELECT type, COUNT(*) as count FROM categories WHERE deleted_at IS NULL GROUP BY type;

SELECT '=== 用户统计 ===' AS info;
SELECT user_type, COUNT(*) as count FROM users WHERE deleted_at IS NULL GROUP BY user_type;

SELECT '=== 账目统计 ===' AS info;
SELECT type, COUNT(*) as count, SUM(amount) as total FROM account_records WHERE deleted_at IS NULL GROUP BY type;

SELECT '=== 客户统计 ===' AS info;
SELECT COUNT(*) as total_customers, SUM(balance) as total_receivable FROM customers WHERE deleted_at IS NULL;

SELECT '=== 供应商统计 ===' AS info;
SELECT COUNT(*) as total_suppliers, SUM(balance) as total_payable FROM suppliers WHERE deleted_at IS NULL;

SELECT '初始数据导入完成！' AS message;
