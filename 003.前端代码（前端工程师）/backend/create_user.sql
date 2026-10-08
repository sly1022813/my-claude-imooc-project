-- 插入测试用户 (密码: Root1234)
INSERT INTO users (username, password_hash, nickname, user_type) VALUES
('root', '$2a$10$sx6Ycj9krk9KbW37ESqz0eEq.NL/.BoIDQaxvUxNajt3GmZTD5zBa', '管理员', 1);

-- 插入系统分类（支出）
INSERT INTO categories (user_id, name, type, icon, color, sort_order, is_system) VALUES
(1, '餐饮', 1, '🍔', '#FF6B6B', 1, 1),
(1, '交通', 1, '🚗', '#FFA07A', 2, 1),
(1, '购物', 1, '🛒', '#FFB3C6', 3, 1),
(1, '居住', 1, '🏠', '#FF6B9D', 4, 1),
(1, '医疗', 1, '💊', '#FF8FAB', 5, 1),
(1, '通讯', 1, '📱', '#FFB347', 6, 1),
(1, '娱乐', 1, '🎮', '#FFD700', 7, 1),
(1, '教育', 1, '📚', '#96CEB4', 8, 1);

-- 插入系统分类（收入）
INSERT INTO categories (user_id, name, type, icon, color, sort_order, is_system) VALUES
(1, '工资', 2, '💰', '#7ED7C1', 1, 1),
(1, '奖金', 2, '🎁', '#4ECDC4', 2, 1),
(1, '投资收益', 2, '📈', '#45B7D1', 3, 1),
(1, '兼职', 2, '💼', '#96CEB4', 4, 1),
(1, '礼金', 2, '🎊', '#DDA0DD', 5, 1);

SELECT '测试账号创建完成!' as result;
SELECT '用户名: root' as info;
SELECT '密码: Root1234' as info;
