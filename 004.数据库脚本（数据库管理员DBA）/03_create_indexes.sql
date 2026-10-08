-- =====================================================
-- 轻记账索引创建脚本
-- 文件：03_create_indexes.sql
-- 说明：创建复合索引和优化查询性能
-- =====================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
USE `light_accounting`;

-- =====================================================
-- 复合索引优化
-- =====================================================

-- 收支记录：按用户+日期+类型组合查询
CREATE INDEX idx_transactions_user_date_type ON transactions(user_id, date, type);

-- 收支记录：按用户+类型+状态查询（筛选待收款）
CREATE INDEX idx_transactions_user_type_status ON transactions(user_id, type, status);

-- 收支记录：按用户+分类统计
CREATE INDEX idx_transactions_user_category ON transactions(user_id, category_id);

-- 客户：按用户+状态+名称模糊查询
CREATE INDEX idx_customers_user_status_name ON customers(user_id, status, name);

-- 供应商：按用户+状态+名称模糊查询
CREATE INDEX idx_suppliers_user_status_name ON suppliers(user_id, status, name);

-- 登录日志：按时间范围+用户查询
CREATE INDEX idx_login_logs_time_user ON login_logs(login_time, user_id);

-- =====================================================
-- 全文索引（可选，用于备注搜索）
-- =====================================================

-- 收支记录备注全文搜索
-- 注意：MySQL 5.7+ 支持，InnoDB引擎全文索引
ALTER TABLE transactions ADD FULLTEXT INDEX ft_transactions_remark (remark);

-- 客户备注全文搜索
ALTER TABLE customers ADD FULLTEXT INDEX ft_customers_remark (remark);

-- 供应商备注全文搜索
ALTER TABLE suppliers ADD FULLTEXT INDEX ft_suppliers_remark (remark);

-- =====================================================
-- 输出索引创建结果
-- =====================================================
SELECT '索引创建完成!' AS message;

-- 查看所有索引
-- SELECT
--     TABLE_NAME,
--     INDEX_NAME,
--     NON_UNIQUE,
--     GROUP_CONCAT(COLUMN_NAME ORDER BY SEQ_IN_INDEX) AS COLUMNS
-- FROM information_schema.STATISTICS
-- WHERE TABLE_SCHEMA = 'light_accounting'
--   AND TABLE_NAME IN ('users', 'categories', 'customers', 'suppliers', 'transactions', 'attachments', 'login_logs')
-- GROUP BY TABLE_NAME, INDEX_NAME, NON_UNIQUE
-- ORDER BY TABLE_NAME, INDEX_NAME;

SET FOREIGN_KEY_CHECKS = 1;
