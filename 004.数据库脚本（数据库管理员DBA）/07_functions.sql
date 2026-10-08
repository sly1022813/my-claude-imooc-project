-- =====================================================
-- 轻记账自定义函数脚本
-- 文件：07_functions.sql
-- 说明：创建业务辅助函数
-- =====================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
USE `light_accounting`;

-- =====================================================
-- 函数1：生成交易流水号
-- =====================================================
DROP FUNCTION IF EXISTS `fn_generate_transaction_no`;
DELIMITER //
CREATE FUNCTION `fn_generate_transaction_no`()
RETURNS VARCHAR(30)
DETERMINISTIC
BEGIN
    DECLARE v_seq INT;
    DECLARE v_date_str VARCHAR(6);

    SET v_date_str = DATE_FORMAT(NOW(), '%y%m%d');

    -- 获取今日最大序号
    SELECT COALESCE(MAX(CAST(RIGHT(transaction_no, 6) AS UNSIGNED)), 0) + 1
    INTO v_seq
    FROM transactions
    WHERE LEFT(transaction_no, 8) = CONCAT('TX', v_date_str);

    -- 返回流水号
    RETURN CONCAT('TX', v_date_str, LPAD(v_seq, 6, '0'));
END //
DELIMITER ;

-- =====================================================
-- 函数2：获取用户待收款总额
-- =====================================================
DROP FUNCTION IF EXISTS `fn_get_pending_income`;
DELIMITER //
CREATE FUNCTION `fn_get_pending_income`(p_user_id BIGINT)
RETURNS DECIMAL(15,2)
DETERMINISTIC
BEGIN
    DECLARE v_total DECIMAL(15,2);

    SELECT COALESCE(SUM(amount), 0.00) INTO v_total
    FROM transactions
    WHERE user_id = p_user_id
      AND type = 2
      AND status = 2;

    RETURN v_total;
END //
DELIMITER ;

-- =====================================================
-- 函数3：获取用户待付款总额
-- =====================================================
DROP FUNCTION IF EXISTS `fn_get_pending_expense`;
DELIMITER //
CREATE FUNCTION `fn_get_pending_expense`(p_user_id BIGINT)
RETURNS DECIMAL(15,2)
DETERMINISTIC
BEGIN
    DECLARE v_total DECIMAL(15,2);

    SELECT COALESCE(SUM(amount), 0.00) INTO v_total
    FROM transactions
    WHERE user_id = p_user_id
      AND type = 1
      AND status = 2;

    RETURN v_total;
END //
DELIMITER ;

-- =====================================================
-- 函数4：获取客户欠款金额
-- =====================================================
DROP FUNCTION IF EXISTS `fn_get_customer_outstanding`;
DELIMITER //
CREATE FUNCTION `fn_get_customer_outstanding`(p_customer_id BIGINT)
RETURNS DECIMAL(15,2)
DETERMINISTIC
BEGIN
    DECLARE v_outstanding DECIMAL(15,2);

    SELECT COALESCE(outstanding_amount, 0.00) INTO v_outstanding
    FROM customers
    WHERE id = p_customer_id;

    RETURN v_outstanding;
END //
DELIMITER ;

-- =====================================================
-- 函数5：获取供应商欠款金额
-- =====================================================
DROP FUNCTION IF EXISTS `fn_get_supplier_outstanding`;
DELIMITER //
CREATE FUNCTION `fn_get_supplier_outstanding`(p_supplier_id BIGINT)
RETURNS DECIMAL(15,2)
DETERMINISTIC
BEGIN
    DECLARE v_outstanding DECIMAL(15,2);

    SELECT COALESCE(outstanding_amount, 0.00) INTO v_outstanding
    FROM suppliers
    WHERE id = p_supplier_id;

    RETURN v_outstanding;
END //
DELIMITER ;

-- =====================================================
-- 函数6：计算净利润
-- =====================================================
DROP FUNCTION IF EXISTS `fn_calc_net_profit`;
DELIMITER //
CREATE FUNCTION `fn_calc_net_profit`(p_total_income DECIMAL(15,2), p_total_expense DECIMAL(15,2))
RETURNS DECIMAL(15,2)
DETERMINISTIC
BEGIN
    RETURN p_total_income - p_total_expense;
END //
DELIMITER ;

-- =====================================================
-- 函数7：计算环比增长率
-- =====================================================
DROP FUNCTION IF EXISTS `fn_calc_growth_rate`;
DELIMITER //
CREATE FUNCTION `fn_calc_growth_rate`(p_current DECIMAL(15,2), p_previous DECIMAL(15,2))
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    IF p_previous = 0 OR p_previous IS NULL THEN
        RETURN NULL;
    END IF;
    RETURN ROUND((p_current - p_previous) / p_previous * 100, 2);
END //
DELIMITER ;

-- =====================================================
-- 函数8：格式化金额显示
-- =====================================================
DROP FUNCTION IF EXISTS `fn_format_amount`;
DELIMITER //
CREATE FUNCTION `fn_format_amount`(p_amount DECIMAL(15,2), p_type TINYINT)
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    DECLARE v_prefix VARCHAR(2);
    DECLARE v_amount_str VARCHAR(20);

    IF p_type = 1 THEN
        SET v_prefix = '-¥';
    ELSEIF p_type = 2 THEN
        SET v_prefix = '+¥';
    ELSE
        SET v_prefix = '¥';
    END IF;

    SET v_amount_str = FORMAT(p_amount, 2);
    RETURN CONCAT(v_prefix, v_amount_str);
END //
DELIMITER ;

-- =====================================================
-- 函数9：获取收支类型名称
-- =====================================================
DROP FUNCTION IF EXISTS `fn_get_type_name`;
DELIMITER //
CREATE FUNCTION `fn_get_type_name`(p_type TINYINT)
RETURNS VARCHAR(10)
DETERMINISTIC
BEGIN
    RETURN CASE p_type
        WHEN 1 THEN '支出'
        WHEN 2 THEN '收入'
        ELSE '未知'
    END;
END //
DELIMITER ;

-- =====================================================
-- 函数10：获取支付方式名称
-- =====================================================
DROP FUNCTION IF EXISTS `fn_get_payment_method_name`;
DELIMITER //
CREATE FUNCTION `fn_get_payment_method_name`(p_method TINYINT)
RETURNS VARCHAR(20)
DETERMINISTIC
BEGIN
    RETURN CASE p_method
        WHEN 1 THEN '现金'
        WHEN 2 THEN '微信支付'
        WHEN 3 THEN '支付宝'
        WHEN 4 THEN '银行卡'
        WHEN 5 THEN '其他'
        ELSE '未知'
    END;
END //
DELIMITER ;

-- =====================================================
-- 函数11：获取用户默认分类ID
-- =====================================================
DROP FUNCTION IF EXISTS `fn_get_default_category_id`;
DELIMITER //
CREATE FUNCTION `fn_get_default_category_id`(p_user_id BIGINT, p_type TINYINT, p_is_system TINYINT)
RETURNS BIGINT
DETERMINISTIC
BEGIN
    DECLARE v_category_id BIGINT;

    -- 先查找用户自定义分类
    SELECT id INTO v_category_id
    FROM categories
    WHERE user_id = p_user_id
      AND type = p_type
      AND is_system = 0
      AND status = 1
    ORDER BY sort_order
    LIMIT 1;

    -- 如果没有自定义分类，使用系统分类
    IF v_category_id IS NULL THEN
        SELECT id INTO v_category_id
        FROM categories
        WHERE user_id = 0
          AND type = p_type
          AND status = 1
        ORDER BY sort_order
        LIMIT 1;
    END IF;

    RETURN v_category_id;
END //
DELIMITER ;

-- =====================================================
-- 输出函数创建结果
-- =====================================================
SELECT '函数创建完成!' AS message;

SET FOREIGN_KEY_CHECKS = 1;
