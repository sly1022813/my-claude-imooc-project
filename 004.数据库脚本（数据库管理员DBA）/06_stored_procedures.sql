-- =====================================================
-- 轻记账存储过程脚本
-- 文件：06_stored_procedures.sql
-- 说明：创建业务存储过程
-- =====================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
USE `light_accounting`;

-- =====================================================
-- 存储过程1：用户注册
-- =====================================================
DROP PROCEDURE IF EXISTS `sp_user_register`;
DELIMITER //
CREATE PROCEDURE `sp_user_register`(
    IN p_username VARCHAR(50),
    IN p_password VARCHAR(255),
    IN p_user_type TINYINT,
    IN p_nickname VARCHAR(100),
    IN p_phone VARCHAR(20),
    OUT p_user_id BIGINT,
    OUT p_result_code VARCHAR(10),
    OUT p_result_msg VARCHAR(200)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 p_result_msg = MESSAGE_TEXT;
        SET p_result_code = '9999';
        SET p_user_id = NULL;
        ROLLBACK;
    END;

    START TRANSACTION;

    -- 检查用户名是否存在
    IF EXISTS (SELECT 1 FROM users WHERE username = p_username) THEN
        SET p_result_code = '1001';
        SET p_result_msg = '用户名已存在';
        SET p_user_id = NULL;
    ELSE
        -- 插入用户
        INSERT INTO users (username, password_hash, user_type, nickname, phone, status)
        VALUES (p_username, p_password, COALESCE(p_user_type, 1), p_nickname, p_phone, 1);

        SET p_user_id = LAST_INSERT_ID();
        SET p_result_code = '0000';
        SET p_result_msg = '注册成功';

        -- 复制系统分类到用户
        INSERT INTO categories (user_id, type, name, icon, color, is_system, sort_order, status)
        SELECT p_user_id, type, name, icon, color, 0, sort_order, status
        FROM categories WHERE user_id = 0;
    END IF;

    COMMIT;
END //
DELIMITER ;

-- =====================================================
-- 存储过程2：用户登录
-- =====================================================
DROP PROCEDURE IF EXISTS `sp_user_login`;
DELIMITER //
CREATE PROCEDURE `sp_user_login`(
    IN p_username VARCHAR(50),
    IN p_password VARCHAR(255),
    IN p_ip_address VARCHAR(45),
    IN p_user_agent VARCHAR(500),
    OUT p_user_id BIGINT,
    OUT p_result_code VARCHAR(10),
    OUT p_result_msg VARCHAR(200)
)
BEGIN
    DECLARE v_user_id BIGINT;
    DECLARE v_password_hash VARCHAR(255);
    DECLARE v_status TINYINT;

    -- 检查用户是否存在
    SELECT id, password_hash, status INTO v_user_id, v_password_hash, v_status
    FROM users WHERE username = p_username;

    IF v_user_id IS NULL THEN
        -- 记录登录失败日志
        INSERT INTO login_logs (user_id, username, login_status, fail_reason, ip_address, user_agent)
        VALUES (NULL, p_username, 0, '用户不存在', p_ip_address, p_user_agent);

        SET p_result_code = '2001';
        SET p_result_msg = '用户名或密码错误';
        SET p_user_id = NULL;
    ELSEIF v_password_hash != p_password THEN
        -- 记录登录失败日志
        INSERT INTO login_logs (user_id, username, login_status, fail_reason, ip_address, user_agent)
        VALUES (v_user_id, p_username, 0, '密码错误', p_ip_address, p_user_agent);

        SET p_result_code = '2002';
        SET p_result_msg = '用户名或密码错误';
        SET p_user_id = NULL;
    ELSEIF v_status = 0 THEN
        -- 记录登录失败日志
        INSERT INTO login_logs (user_id, username, login_status, fail_reason, ip_address, user_agent)
        VALUES (v_user_id, p_username, 0, '账号已禁用', p_ip_address, p_user_agent);

        SET p_result_code = '2003';
        SET p_result_msg = '账号已被禁用';
        SET p_user_id = NULL;
    ELSE
        -- 更新登录信息
        UPDATE users SET last_login_at = NOW(), last_login_ip = p_ip_address WHERE id = v_user_id;

        -- 记录登录成功日志
        INSERT INTO login_logs (user_id, username, login_status, ip_address, user_agent)
        VALUES (v_user_id, p_username, 1, p_ip_address, p_user_agent);

        SET p_result_code = '0000';
        SET p_result_msg = '登录成功';
        SET p_user_id = v_user_id;
    END IF;
END //
DELIMITER ;

-- =====================================================
-- 存储过程3：创建收支记录（自动生成流水号）
-- =====================================================
DROP PROCEDURE IF EXISTS `sp_create_transaction`;
DELIMITER //
CREATE PROCEDURE `sp_create_transaction`(
    IN p_user_id BIGINT,
    IN p_type TINYINT,
    IN p_amount DECIMAL(15,2),
    IN p_category_id BIGINT,
    IN p_date DATE,
    IN p_time TIME,
    IN p_payment_method TINYINT,
    IN p_counterparty VARCHAR(200),
    IN p_counterparty_type TINYINT,
    IN p_counterparty_id BIGINT,
    IN p_status TINYINT,
    IN p_remark VARCHAR(500),
    OUT p_transaction_id BIGINT,
    OUT p_transaction_no VARCHAR(30),
    OUT p_result_code VARCHAR(10),
    OUT p_result_msg VARCHAR(200)
)
BEGIN
    DECLARE v_transaction_no VARCHAR(30);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 p_result_msg = MESSAGE_TEXT;
        SET p_result_code = '9999';
        SET p_transaction_id = NULL;
        SET p_transaction_no = NULL;
        ROLLBACK;
    END;

    START TRANSACTION;

    -- 生成流水号：TX + 年月日 + 6位序号
    SET v_transaction_no = CONCAT('TX', DATE_FORMAT(NOW(), '%y%m%d'), LPAD(FLOOR(RAND() * 1000000), 6, '0'));

    -- 插入记录
    INSERT INTO transactions (
        user_id, transaction_no, type, amount, category_id,
        date, time, payment_method, counterparty, counterparty_type,
        counterparty_id, status, remark
    ) VALUES (
        p_user_id, v_transaction_no, p_type, p_amount, p_category_id,
        p_date, p_time, p_payment_method, p_counterparty, p_counterparty_type,
        p_counterparty_id, p_status, p_remark
    );

    SET p_transaction_id = LAST_INSERT_ID();
    SET p_transaction_no = v_transaction_no;
    SET p_result_code = '0000';
    SET p_result_msg = '记录创建成功';

    -- 如果是收入且关联客户，更新客户统计
    IF p_type = 2 AND p_counterparty_type = 1 AND p_counterparty_id IS NOT NULL THEN
        UPDATE customers SET
            total_transaction = total_transaction + p_amount,
            outstanding_amount = CASE WHEN p_status = 2 THEN outstanding_amount + p_amount ELSE outstanding_amount END
        WHERE id = p_counterparty_id;
    END IF;

    -- 如果是支出且关联供应商，更新供应商统计
    IF p_type = 1 AND p_counterparty_type = 2 AND p_counterparty_id IS NOT NULL THEN
        UPDATE suppliers SET
            total_purchase = total_purchase + p_amount,
            outstanding_amount = CASE WHEN p_status = 2 THEN outstanding_amount + p_amount ELSE outstanding_amount END
        WHERE id = p_counterparty_id;
    END IF;

    COMMIT;
END //
DELIMITER ;

-- =====================================================
-- 存储过程4：收讫处理（将挂账标记为已收/已付）
-- =====================================================
DROP PROCEDURE IF EXISTS `sp_settle_transaction`;
DELIMITER //
CREATE PROCEDURE `sp_settle_transaction`(
    IN p_transaction_id BIGINT,
    IN p_user_id BIGINT,
    OUT p_result_code VARCHAR(10),
    OUT p_result_msg VARCHAR(200)
)
BEGIN
    DECLARE v_type TINYINT;
    DECLARE v_amount DECIMAL(15,2);
    DECLARE v_counterparty_type TINYINT;
    DECLARE v_counterparty_id BIGINT;
    DECLARE v_status TINYINT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 p_result_msg = MESSAGE_TEXT;
        SET p_result_code = '9999';
        ROLLBACK;
    END;

    START TRANSACTION;

    -- 获取记录信息
    SELECT type, amount, counterparty_type, counterparty_id, status
    INTO v_type, v_amount, v_counterparty_type, v_counterparty_id, v_status
    FROM transactions
    WHERE id = p_transaction_id AND user_id = p_user_id;

    IF v_type IS NULL THEN
        SET p_result_code = '3001';
        SET p_result_msg = '记录不存在';
    ELSEIF v_status = 1 THEN
        SET p_result_code = '3002';
        SET p_result_msg = '该记录已收讫';
    ELSE
        -- 更新状态为已收/已付
        UPDATE transactions SET status = 1, updated_at = NOW()
        WHERE id = p_transaction_id;

        -- 如果是收入且关联客户，减少欠款
        IF v_type = 2 AND v_counterparty_type = 1 AND v_counterparty_id IS NOT NULL THEN
            UPDATE customers SET
                outstanding_amount = GREATEST(0, outstanding_amount - v_amount)
            WHERE id = v_counterparty_id;
        END IF;

        -- 如果是支出且关联供应商，减少欠款
        IF v_type = 1 AND v_counterparty_type = 2 AND v_counterparty_id IS NOT NULL THEN
            UPDATE suppliers SET
                outstanding_amount = GREATEST(0, outstanding_amount - v_amount)
            WHERE id = v_counterparty_id;
        END IF;

        SET p_result_code = '0000';
        SET p_result_msg = '收讫成功';
    END IF;

    COMMIT;
END //
DELIMITER ;

-- =====================================================
-- 存储过程5：删除收支记录
-- =====================================================
DROP PROCEDURE IF EXISTS `sp_delete_transaction`;
DELIMITER //
CREATE PROCEDURE `sp_delete_transaction`(
    IN p_transaction_id BIGINT,
    IN p_user_id BIGINT,
    OUT p_result_code VARCHAR(10),
    OUT p_result_msg VARCHAR(200)
)
BEGIN
    DECLARE v_type TINYINT;
    DECLARE v_amount DECIMAL(15,2);
    DECLARE v_counterparty_type TINYINT;
    DECLARE v_counterparty_id BIGINT;
    DECLARE v_status TINYINT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        GET DIAGNOSTICS CONDITION 1 p_result_msg = MESSAGE_TEXT;
        SET p_result_code = '9999';
        ROLLBACK;
    END;

    START TRANSACTION;

    -- 获取记录信息
    SELECT type, amount, counterparty_type, counterparty_id, status
    INTO v_type, v_amount, v_counterparty_type, v_counterparty_id, v_status
    FROM transactions
    WHERE id = p_transaction_id AND user_id = p_user_id;

    IF v_type IS NULL THEN
        SET p_result_code = '4001';
        SET p_result_msg = '记录不存在';
    ELSE
        -- 如果是收入且关联客户且已收讫，减少客户统计
        IF v_type = 2 AND v_counterparty_type = 1 AND v_counterparty_id IS NOT NULL THEN
            UPDATE customers SET
                total_transaction = GREATEST(0, total_transaction - v_amount),
                outstanding_amount = CASE WHEN v_status = 1 THEN GREATEST(0, outstanding_amount - v_amount) ELSE outstanding_amount END
            WHERE id = v_counterparty_id;
        END IF;

        -- 如果是支出且关联供应商且已支付，减少供应商统计
        IF v_type = 1 AND v_counterparty_type = 2 AND v_counterparty_id IS NOT NULL THEN
            UPDATE suppliers SET
                total_purchase = GREATEST(0, total_purchase - v_amount),
                outstanding_amount = CASE WHEN v_status = 1 THEN GREATEST(0, outstanding_amount - v_amount) ELSE outstanding_amount END
            WHERE id = v_counterparty_id;
        END IF;

        -- 删除附件
        DELETE FROM attachments WHERE ref_type = 'transaction' AND ref_id = p_transaction_id;

        -- 删除记录
        DELETE FROM transactions WHERE id = p_transaction_id;

        SET p_result_code = '0000';
        SET p_result_msg = '删除成功';
    END IF;

    COMMIT;
END //
DELIMITER ;

-- =====================================================
-- 存储过程6：获取月度统计
-- =====================================================
DROP PROCEDURE IF EXISTS `sp_get_monthly_stats`;
DELIMITER //
CREATE PROCEDURE `sp_get_monthly_stats`(
    IN p_user_id BIGINT,
    IN p_year_month VARCHAR(7)
)
BEGIN
    SELECT
        DATE_FORMAT(t.date, '%Y-%m') AS month,
        SUM(CASE WHEN t.type = 1 THEN t.amount ELSE 0 END) AS total_expense,
        SUM(CASE WHEN t.type = 2 THEN t.amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN t.type = 2 THEN t.amount ELSE -t.amount END) AS net_profit,
        COUNT(CASE WHEN t.type = 1 THEN 1 END) AS expense_count,
        COUNT(CASE WHEN t.type = 2 THEN 1 END) AS income_count
    FROM transactions t
    WHERE t.user_id = p_user_id
      AND DATE_FORMAT(t.date, '%Y-%m') = p_year_month
    GROUP BY DATE_FORMAT(t.date, '%Y-%m');

    -- 分类统计
    SELECT
        c.id AS category_id,
        c.name AS category_name,
        c.icon AS category_icon,
        c.color AS category_color,
        t.type,
        SUM(t.amount) AS total_amount,
        COUNT(*) AS transaction_count
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = p_user_id
      AND DATE_FORMAT(t.date, '%Y-%m') = p_year_month
    GROUP BY c.id, c.name, c.icon, c.color, t.type
    ORDER BY t.type, total_amount DESC;
END //
DELIMITER ;

-- =====================================================
-- 输出存储过程创建结果
-- =====================================================
SELECT '存储过程创建完成!' AS message;

SET FOREIGN_KEY_CHECKS = 1;
