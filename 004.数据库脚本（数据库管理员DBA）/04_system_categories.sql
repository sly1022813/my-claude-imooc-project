-- =====================================================
-- 轻记账系统预设分类初始化脚本
-- 文件：04_system_categories.sql
-- 说明：插入收支分类的预设数据
-- =====================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
USE `light_accounting`;

-- =====================================================
-- 支出分类（type=1）
-- =====================================================
INSERT INTO `categories` (`user_id`, `type`, `name`, `icon`, `color`, `is_system`, `sort_order`, `status`) VALUES
-- 餐饮成本
(0, 1, '餐饮成本', '🍜', '#FF8FAB', 1, 10, 1),
-- 进货成本
(0, 1, '进货成本', '📦', '#FFB3C6', 1, 20, 1),
-- 房租水电
(0, 1, '房租水电', '🏠', '#FF6B9D', 1, 30, 1),
-- 工资
(0, 1, '工资', '👥', '#9B3F5A', 1, 40, 1),
-- 运营费用
(0, 1, '运营费用', '📋', '#884C5D', 1, 50, 1),
-- 交通物流
(0, 1, '交通物流', '🚚', '#7ED7C1', 1, 60, 1),
-- 办公用品
(0, 1, '办公用品', '📎', '#AC2A5D', 1, 70, 1),
-- 税费
(0, 1, '税费', '📄', '#FF6B6B', 1, 80, 1),
-- 社交应酬
(0, 1, '社交应酬', '🍺', '#FFB347', 1, 90, 1),
-- 其他支出
(0, 1, '其他支出', '📌', '#999999', 1, 100, 1);

-- =====================================================
-- 收入分类（type=2）
-- =====================================================
INSERT INTO `categories` (`user_id`, `type`, `name`, `icon`, `color`, `is_system`, `sort_order`, `status`) VALUES
-- 销售收入
(0, 2, '销售收入', '💰', '#7ED7C1', 1, 10, 1),
-- 服务收入
(0, 2, '服务收入', '🛠️', '#FF8FAB', 1, 20, 1),
-- 其他收入
(0, 2, '其他收入', '📌', '#FFB3C6', 1, 30, 1),
-- 退款
(0, 2, '退款', '↩️', '#FFB347', 1, 40, 1);

-- =====================================================
-- 输出分类统计
-- =====================================================
SELECT
    CASE type
        WHEN 1 THEN '支出分类'
        WHEN 2 THEN '收入分类'
    END AS category_type,
    COUNT(*) AS category_count,
    GROUP_CONCAT(CONCAT(icon, ' ', name) ORDER BY sort_order SEPARATOR ' | ') AS categories
FROM categories
WHERE user_id = 0
GROUP BY type;

-- =====================================================
-- 获取分类ID（供后续脚本使用）
-- =====================================================
SELECT '系统预设分类创建完成!' AS message;

-- 支出分类ID
-- SELECT id, name FROM categories WHERE user_id = 0 AND type = 1 ORDER BY sort_order;

-- 收入分类ID
-- SELECT id, name FROM categories WHERE user_id = 0 AND type = 2 ORDER BY sort_order;

SET FOREIGN_KEY_CHECKS = 1;
