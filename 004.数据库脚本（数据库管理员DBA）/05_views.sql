-- =====================================================
-- 轻记账视图创建脚本
-- 文件：05_views.sql
-- 说明：创建常用数据视图简化查询
-- =====================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
USE `light_accounting`;

-- =====================================================
-- 视图1：收支记录详情视图
-- =====================================================
DROP VIEW IF EXISTS `v_transaction_details`;
CREATE VIEW `v_transaction_details` AS
SELECT
    t.id,
    t.transaction_no,
    t.type,
    t.amount,
    t.date,
    t.time,
    CASE t.type
        WHEN 1 THEN '支出'
        WHEN 2 THEN '收入'
    END AS type_name,
    CASE t.status
        WHEN 1 THEN CASE t.type WHEN 1 THEN '已支付' WHEN 2 THEN '已收讫' END
        WHEN 2 THEN '挂账/待收'
    END AS status_name,
    CASE t.payment_method
        WHEN 1 THEN '现金'
        WHEN 2 THEN '微信支付'
        WHEN 3 THEN '支付宝'
        WHEN 4 THEN '银行卡'
        WHEN 5 THEN '其他'
    END AS payment_method_name,
    c.name AS category_name,
    c.icon AS category_icon,
    c.color AS category_color,
    t.counterparty,
    CASE t.counterparty_type
        WHEN 1 THEN '客户'
        WHEN 2 THEN '供应商'
        WHEN 3 THEN '其他'
    END AS counterparty_type_name,
    t.remark,
    t.created_at,
    u.username,
    u.business_name
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
LEFT JOIN users u ON t.user_id = u.id;

-- =====================================================
-- 视图2：月度收支汇总视图
-- =====================================================
DROP VIEW IF EXISTS `v_monthly_summary`;
CREATE VIEW `v_monthly_summary` AS
SELECT
    user_id,
    DATE_FORMAT(date, '%Y-%m') AS month,
    SUM(CASE WHEN type = 1 THEN amount ELSE 0 END) AS total_expense,
    SUM(CASE WHEN type = 2 THEN amount ELSE 0 END) AS total_income,
    SUM(CASE WHEN type = 2 THEN amount ELSE -amount END) AS net_profit,
    COUNT(CASE WHEN type = 1 THEN 1 END) AS expense_count,
    COUNT(CASE WHEN type = 2 THEN 1 END) AS income_count
FROM transactions
GROUP BY user_id, DATE_FORMAT(date, '%Y-%m');

-- =====================================================
-- 视图3：客户账本视图（含欠款）
-- =====================================================
DROP VIEW IF EXISTS `v_customer_account`;
CREATE VIEW `v_customer_account` AS
SELECT
    c.id,
    c.user_id,
    c.name,
    c.phone,
    c.address,
    c.total_transaction,
    c.outstanding_amount,
    c.remark,
    c.status,
    c.created_at,
    u.username,
    COUNT(t.id) AS transaction_count
FROM customers c
LEFT JOIN users u ON c.user_id = u.id
LEFT JOIN transactions t ON c.id = t.counterparty_id AND t.counterparty_type = 1
GROUP BY c.id, c.user_id, c.name, c.phone, c.address, c.total_transaction,
         c.outstanding_amount, c.remark, c.status, c.created_at, u.username;

-- =====================================================
-- 视图4：供应商账本视图（含欠款）
-- =====================================================
DROP VIEW IF EXISTS `v_supplier_account`;
CREATE VIEW `v_supplier_account` AS
SELECT
    s.id,
    s.user_id,
    s.name,
    s.phone,
    s.address,
    s.contact_person,
    s.products,
    CASE s.settlement_type
        WHEN 1 THEN '即时结算'
        WHEN 2 THEN '月结'
        WHEN 3 THEN '季结'
    END AS settlement_type_name,
    s.total_purchase,
    s.outstanding_amount,
    s.remark,
    s.status,
    s.created_at,
    u.username,
    COUNT(t.id) AS transaction_count
FROM suppliers s
LEFT JOIN users u ON s.user_id = u.id
LEFT JOIN transactions t ON s.id = t.counterparty_id AND t.counterparty_type = 2
GROUP BY s.id, s.user_id, s.name, s.phone, s.address, s.contact_person, s.products,
         s.settlement_type, s.total_purchase, s.outstanding_amount, s.remark,
         s.status, s.created_at, u.username;

-- =====================================================
-- 视图5：分类统计视图
-- =====================================================
DROP VIEW IF EXISTS `v_category_statistics`;
CREATE VIEW `v_category_statistics` AS
SELECT
    t.user_id,
    t.category_id,
    c.name AS category_name,
    c.icon AS category_icon,
    c.color AS category_color,
    t.type,
    DATE_FORMAT(t.date, '%Y-%m') AS month,
    SUM(t.amount) AS total_amount,
    COUNT(*) AS transaction_count,
    AVG(t.amount) AS avg_amount
FROM transactions t
JOIN categories c ON t.category_id = c.id
GROUP BY t.user_id, t.category_id, c.name, c.icon, c.color, t.type, DATE_FORMAT(t.date, '%Y-%m');

-- =====================================================
-- 视图6：每日收支趋势视图
-- =====================================================
DROP VIEW IF EXISTS `v_daily_trend`;
CREATE VIEW `v_daily_trend` AS
SELECT
    user_id,
    date,
    SUM(CASE WHEN type = 1 THEN amount ELSE 0 END) AS daily_expense,
    SUM(CASE WHEN type = 2 THEN amount ELSE 0 END) AS daily_income,
    SUM(CASE WHEN type = 2 THEN amount ELSE -amount END) AS daily_profit,
    COUNT(*) AS transaction_count
FROM transactions
GROUP BY user_id, date;

-- =====================================================
-- 视图7：待收款/待付款视图
-- =====================================================
DROP VIEW IF EXISTS `v_pending_payments`;
CREATE VIEW `v_pending_payments` AS
SELECT
    t.id,
    t.transaction_no,
    t.user_id,
    t.type,
    t.amount,
    t.date,
    t.counterparty,
    CASE t.counterparty_type
        WHEN 1 THEN '客户'
        WHEN 2 THEN '供应商'
        ELSE '其他'
    END AS counterparty_type_name,
    CASE t.counterparty_type
        WHEN 1 THEN c.name
        WHEN 2 THEN s.name
        ELSE NULL
    END AS counterparty_name,
    t.remark,
    t.created_at,
    CASE
        WHEN t.counterparty_type = 1 THEN c.phone
        WHEN t.counterparty_type = 2 THEN s.phone
        ELSE NULL
    END AS counterparty_phone
FROM transactions t
LEFT JOIN customers c ON t.counterparty_id = c.id AND t.counterparty_type = 1
LEFT JOIN suppliers s ON t.counterparty_id = s.id AND t.counterparty_type = 2
WHERE t.status = 2;

-- =====================================================
-- 输出视图创建结果
-- =====================================================
SELECT '视图创建完成!' AS message,
       COUNT(*) AS view_count
FROM information_schema.VIEWS
WHERE TABLE_SCHEMA = 'light_accounting';

SET FOREIGN_KEY_CHECKS = 1;
