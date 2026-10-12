/**
 * 账户控制器
 */
const { pool } = require('../config/database');
const { success, error, businessError, notFound } = require('../utils/response');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

/**
 * 获取用户信息
 * GET /api/accounts/profile
 */
async function getProfile(req, res, next) {
  try {
    const userId = req.user.id;

    const [rows] = await pool.execute(
      `SELECT id, username, nickname, phone, email, avatar_url, user_type, business_name, created_at
       FROM users WHERE id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return notFound(res, '用户不存在');
    }

    const user = rows[0];

    // 获取统计信息
    const [stats] = await pool.execute(
      `SELECT
        COUNT(DISTINCT DATE(date)) as record_days,
        COUNT(*) as total_records
       FROM transactions WHERE user_id = ?`,
      [userId]
    );

    return success(res, {
      ...user,
      recordDays: stats[0].record_days || 0,
      totalRecords: stats[0].total_records || 0
    }, '获取成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 更新用户信息
 * PUT /api/accounts/profile
 */
async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const { nickname, phone, email, businessName } = req.body;

    const fields = [];
    const values = [];

    if (nickname !== undefined) {
      fields.push('nickname = ?');
      values.push(nickname);
    }
    if (phone !== undefined) {
      fields.push('phone = ?');
      values.push(phone);
    }
    if (email !== undefined) {
      fields.push('email = ?');
      values.push(email);
    }
    if (businessName !== undefined) {
      fields.push('business_name = ?');
      values.push(businessName);
    }

    if (fields.length === 0) {
      return businessError(res, '没有需要更新的字段');
    }

    values.push(userId);
    await pool.execute(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return success(res, null, '更新成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 修改密码
 * PUT /api/accounts/password
 */
async function changePassword(req, res, next) {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return businessError(res, '请填写完整的密码信息');
    }

    if (newPassword.length < 6) {
      return businessError(res, '新密码长度不能少于6位');
    }

    // 验证旧密码
    const [users] = await pool.execute(
      'SELECT password_hash FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return notFound(res, '用户不存在');
    }

    // 如果是SHA256存储的密码（旧格式）
    const storedPassword = users[0].password_hash;
    const oldPasswordHash = Buffer.from(oldPassword).toString('base64');

    if (storedPassword !== oldPasswordHash) {
      return businessError(res, '原密码错误');
    }

    // 更新新密码
    const newPasswordHash = Buffer.from(newPassword).toString('base64');
    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [newPasswordHash, userId]
    );

    return success(res, null, '密码修改成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 上传头像
 * POST /api/accounts/avatar
 */
async function uploadAvatar(req, res, next) {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return businessError(res, '请选择要上传的头像图片');
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    await pool.execute(
      'UPDATE users SET avatar_url = ? WHERE id = ?',
      [avatarUrl, userId]
    );

    return success(res, { avatarUrl }, '头像上传成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 获取账户列表（用户的所有账户）
 * GET /api/accounts
 */
async function getAccounts(req, res, next) {
  try {
    const userId = req.user.id;

    // 检查是否有accounts表
    const [tables] = await pool.execute(
      `SELECT TABLE_NAME FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'accounts'`
    );

    if (tables.length === 0) {
      // 如果没有accounts表，返回模拟数据
      return success(res, [], '获取成功');
    }

    const [accounts] = await pool.execute(
      'SELECT * FROM accounts WHERE user_id = ? AND status = 1 ORDER BY sort_order ASC',
      [userId]
    );

    return success(res, accounts, '获取成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 创建账户
 * POST /api/accounts
 */
async function createAccount(req, res, next) {
  try {
    const userId = req.user.id;
    const { name, type, balance, icon, color, remark } = req.body;

    if (!name) {
      return businessError(res, '账户名称不能为空');
    }

    // 检查accounts表是否存在
    const [tables] = await pool.execute(
      `SELECT TABLE_NAME FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'accounts'`
    );

    if (tables.length === 0) {
      // 如果没有accounts表，返回错误
      return businessError(res, '账户功能暂不可用');
    }

    // 获取最大排序值
    const [maxResult] = await pool.execute(
      'SELECT COALESCE(MAX(sort_order), 0) + 1 as next_order FROM accounts WHERE user_id = ?',
      [userId]
    );
    const sortOrder = maxResult[0].next_order;

    const [result] = await pool.execute(
      `INSERT INTO accounts (user_id, name, type, balance, icon, color, sort_order, remark, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [userId, name, type || 'cash', balance || 0, icon || '💳', color || '#FF8FAB', sortOrder, remark]
    );

    return success(res, { id: result.insertId }, '账户创建成功', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * 更新账户
 * PUT /api/accounts/:id
 */
async function updateAccount(req, res, next) {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id);
    const { name, type, balance, icon, color, remark, status } = req.body;

    // 检查账户是否存在且属于该用户
    const [existing] = await pool.execute(
      'SELECT id FROM accounts WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (existing.length === 0) {
      return notFound(res, '账户不存在');
    }

    const fields = [];
    const values = [];

    if (name !== undefined) { fields.push('name = ?'); values.push(name); }
    if (type !== undefined) { fields.push('type = ?'); values.push(type); }
    if (balance !== undefined) { fields.push('balance = ?'); values.push(balance); }
    if (icon !== undefined) { fields.push('icon = ?'); values.push(icon); }
    if (color !== undefined) { fields.push('color = ?'); values.push(color); }
    if (remark !== undefined) { fields.push('remark = ?'); values.push(remark); }
    if (status !== undefined) { fields.push('status = ?'); values.push(status); }

    if (fields.length === 0) {
      return businessError(res, '没有需要更新的字段');
    }

    values.push(id, userId);
    await pool.execute(
      `UPDATE accounts SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
      values
    );

    return success(res, null, '账户更新成功');
  } catch (err) {
    next(err);
  }
}

/**
 * 删除账户
 * DELETE /api/accounts/:id
 */
async function deleteAccount(req, res, next) {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id);

    // 检查账户是否存在且属于该用户
    const [existing] = await pool.execute(
      'SELECT id FROM accounts WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (existing.length === 0) {
      return notFound(res, '账户不存在');
    }

    // 软删除
    await pool.execute(
      'UPDATE accounts SET status = 0 WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    return success(res, null, '账户删除成功');
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount
};
