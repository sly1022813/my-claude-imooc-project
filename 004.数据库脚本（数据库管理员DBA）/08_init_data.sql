-- =====================================================
-- 轻记账测试数据初始化脚本
-- 文件：08_init_data.sql
-- 说明：插入测试数据用于开发和演示
-- =====================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
USE `light_accounting`;

-- =====================================================
-- 测试用户数据
-- 注意：密码为 SHA-256 哈希值
-- 密码原文为：root
-- =====================================================
INSERT INTO `users` (`username`, `password_hash`, `user_type`, `nickname`, `phone`, `business_name`, `status`) VALUES
('root', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 2, '林舒晴', '13800138000', '林老板的便利小店', 1),
('test', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 1, '测试用户', '13900139000', NULL, 1);

-- 获取用户ID
SET @user_id = (SELECT id FROM users WHERE username = 'root');

-- =====================================================
-- 为测试用户复制系统分类
-- =====================================================
INSERT INTO `categories` (`user_id`, `type`, `name`, `icon`, `color`, `is_system`, `sort_order`, `status`)
SELECT @user_id, type, name, icon, color, 0, sort_order, status
FROM categories WHERE user_id = 0;

-- =====================================================
-- 测试客户数据
-- =====================================================
INSERT INTO `customers` (`user_id`, `name`, `phone`, `address`, `customer_type`, `total_transaction`, `outstanding_amount`, `remark`, `status`) VALUES
(@user_id, '汇美生鲜农贸配送部', '13812345601', '深圳市南山区海德一道88号', 2, 15000.00, 0.00, '长期供应商 · 季结账户', 1),
(@user_id, '丰利粮油调味商行', '13812345602', '深圳市宝安区龙华街道', 2, 5800.00, 320.00, '调味品批发商', 1),
(@user_id, '优品文创科技（深圳）', '13812345603', '深圳市福田区深业上城', 2, 6800.00, 0.00, '文创产品供应商', 1),
(@user_id, '科技园高新软件孵化中心', '13812345604', '深圳市南山区科技园南区', 2, 5600.00, 1260.00, '企业订餐客户 · 月结', 1),
(@user_id, '蓝天创意设计工作室', '13812345605', '深圳市龙岗区坂田街道', 1, 3200.00, 1890.00, '老客户 · 信誉良好', 1),
(@user_id, '招商置业商业管理中心', '13812345606', '深圳市南山区商业中心', 2, 10500.00, 0.00, '物业租赁方', 1);

-- =====================================================
-- 测试供应商数据
-- =====================================================
INSERT INTO `suppliers` (`user_id`, `name`, `phone`, `address`, `contact_person`, `products`, `settlement_type`, `total_purchase`, `outstanding_amount`, `remark`, `status`) VALUES
(@user_id, '汇美生鲜农贸配送部', '13812345601', '深圳市南山区海德一道88号', '张经理', '生鲜果蔬、农产品', 3, 15000.00, 0.00, '长期合作伙伴', 1),
(@user_id, '丰利粮油调味商行', '13812345602', '深圳市宝安区龙华街道', '李老板', '粮油、调味品、厨房耗材', 1, 5800.00, 320.00, '现场收银结清', 1),
(@user_id, '优品文创科技（深圳）', '13812345603', '深圳市福田区深业上城', '王总监', '文创周边、马克杯、帆布袋', 2, 6800.00, 0.00, '公对公转账', 1);

-- =====================================================
-- 测试收支记录数据
-- =====================================================

-- 获取分类ID（用户自定义分类）
SET @cat_expense_purchase = (SELECT id FROM categories WHERE user_id = @user_id AND name = '进货成本' LIMIT 1);
SET @cat_expense_food = (SELECT id FROM categories WHERE user_id = @user_id AND name = '餐饮成本' LIMIT 1);
SET @cat_expense_rent = (SELECT id FROM categories WHERE user_id = @user_id AND name = '房租水电' LIMIT 1);
SET @cat_income_sales = (SELECT id FROM categories WHERE user_id = @user_id AND name = '销售收入' LIMIT 1);

-- 今日记录 (2026-09-29)
INSERT INTO `transactions` (`user_id`, `transaction_no`, `type`, `amount`, `category_id`, `date`, `time`, `payment_method`, `counterparty`, `counterparty_type`, `counterparty_id`, `status`, `remark`) VALUES
(@user_id, 'TX260929008', 1, 1850.00, @cat_expense_purchase, '2026-09-29', '15:42:10', 2, '汇美生鲜农贸配送部', 2, 1, 1, '当日特级秋葵、有机菜心与精选番茄采购批发单'),
(@user_id, 'TX260929005', 2, 1260.00, @cat_income_sales, '2026-09-29', '12:18:04', 3, '科技园高新软件孵化中心', 1, 4, 1, '研发部例会团餐35份，已送达并开具电子普票'),
(@user_id, 'TX260929003', 1, 320.00, @cat_expense_food, '2026-09-29', '11:05:22', 1, '丰利粮油调味商行', 2, 2, 1, '采购优质生抽5箱、花生油2桶与厨房耗材'),
(@user_id, 'TX260929001', 2, 520.00, @cat_income_sales, '2026-09-29', '09:30:15', 2, '早市门市汇总账目', 3, NULL, 1, '上午早茶及包点销售聚合流水汇总');

-- 昨日记录 (2026-09-28)
INSERT INTO `transactions` (`user_id`, `transaction_no`, `type`, `amount`, `category_id`, `date`, `time`, `payment_method`, `counterparty`, `counterparty_type`, `counterparty_id`, `status`, `remark`) VALUES
(@user_id, 'TX260928014', 1, 3500.00, @cat_expense_rent, '2026-09-28', '17:15:30', 4, '招商置业商业管理中心', 1, 6, 1, '缴纳2026年第3季度门面综合物业管理费与公共水费分摊'),
(@user_id, 'TX260928004', 1, 3420.00, @cat_expense_purchase, '2026-09-28', '10:40:02', 4, '优品文创科技（深圳）', 2, 3, 1, '批量采购首批限定马克杯与环保帆布袋200套'),
(@user_id, 'TX260928001', 2, 1890.00, @cat_income_sales, '2026-09-28', '09:12:45', 5, '蓝天创意设计工作室', 1, 5, 2, '本周例会茶歇订餐，约定9月30日前对公汇款付讫');

-- 前日记录 (2026-09-27)
INSERT INTO `transactions` (`user_id`, `transaction_no`, `type`, `amount`, `category_id`, `date`, `time`, `payment_method`, `counterparty`, `counterparty_type`, `counterparty_id`, `status`, `remark`) VALUES
(@user_id, 'TX260927012', 1, 2200.00, @cat_expense_purchase, '2026-09-27', '16:30:00', 2, '汇美生鲜农贸配送部', 2, 1, 1, '蔬菜批发采购'),
(@user_id, 'TX260927008', 2, 680.00, @cat_income_sales, '2026-09-27', '12:00:00', 2, '散客', 3, NULL, 1, '午餐散客流水'),
(@user_id, 'TX260927005', 2, 980.00, @cat_income_sales, '2026-09-27', '18:30:00', 3, '企业客户', 3, NULL, 1, '下午茶团餐订单');

-- =====================================================
-- 测试登录日志
-- =====================================================
INSERT INTO `login_logs` (`user_id`, `username`, `login_status`, `ip_address`, `user_agent`, `login_time`) VALUES
(@user_id, 'root', 1, '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0', '2026-09-29 08:00:00'),
(@user_id, 'root', 1, '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0', '2026-09-28 08:30:00'),
(@user_id, 'root', 0, '192.168.1.100', 'Mozilla/5.0', '2026-09-27 10:00:00');

-- =====================================================
-- 输出测试数据统计
-- =====================================================
SELECT '测试数据初始化完成!' AS message;

-- 统计各表数据量
SELECT '用户数' AS item, COUNT(*) AS count FROM users
UNION ALL
SELECT '分类数', COUNT(*) FROM categories WHERE user_id = @user_id
UNION ALL
SELECT '客户数', COUNT(*) FROM customers WHERE user_id = @user_id
UNION ALL
SELECT '供应商数', COUNT(*) FROM suppliers WHERE user_id = @user_id
UNION ALL
SELECT '收支记录数', COUNT(*) FROM transactions WHERE user_id = @user_id
UNION ALL
SELECT '登录日志数', COUNT(*) FROM login_logs WHERE user_id = @user_id;

SET FOREIGN_KEY_CHECKS = 1;
