/**
 * 用户模型
 * 与数据库交互的用户操作
 */
const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

class UserModel {
  /**
   * 根据用户名查找用户
   * @param {string} username - 用户名
   * @returns {Object|null} 用户对象
   */
  static async findByUsername(username) {
    const [rows] = await pool.execute(
      `SELECT id, username, password_hash, user_type, nickname, phone, email,
              avatar_url, business_name, status, last_login_at, last_login_ip,
              created_at, updated_at
       FROM users
       WHERE username = ?`,
      [username]
    );
    return rows[0] || null;
  }

  /**
   * 根据用户ID查找用户
   * @param {number} id - 用户ID
   * @returns {Object|null} 用户对象
   */
  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT id, username, user_type, nickname, phone, email,
              avatar_url, business_name, status, last_login_at,
              created_at, updated_at
       FROM users
       WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  /**
   * 检查用户名是否存在
   * @param {string} username - 用户名
   * @returns {boolean}
   */
  static async existsByUsername(username) {
    const [rows] = await pool.execute(
      'SELECT 1 FROM users WHERE username = ? LIMIT 1',
      [username]
    );
    return rows.length > 0;
  }

  /**
   * 创建新用户
   * @param {Object} userData - 用户数据
   * @returns {Object} { id, ... }
   */
  static async create(userData) {
    const { username, password, userType, nickname, phone } = userData;

    // 密码哈希
    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      `INSERT INTO users (username, password_hash, user_type, nickname, phone, status)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [username, passwordHash, userType || 1, nickname || null, phone || null]
    );

    // 获取新创建的用户信息（不含密码）
    return await this.findById(result.insertId);
  }

  /**
   * 更新用户最后登录信息
   * @param {number} userId - 用户ID
   * @param {string} ipAddress - IP地址
   */
  static async updateLastLogin(userId, ipAddress) {
    await pool.execute(
      'UPDATE users SET last_login_at = NOW(), last_login_ip = ? WHERE id = ?',
      [ipAddress, userId]
    );
  }

  /**
   * 更新用户信息
   * @param {number} userId - 用户ID
   * @param {Object} updateData - 更新数据
   * @returns {Object|null} 更新后的用户
   */
  static async update(userId, updateData) {
    const allowedFields = ['nickname', 'phone', 'email', 'avatar_url', 'business_name'];
    const fields = [];
    const values = [];

    for (const field of allowedFields) {
      const camelField = field.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      if (updateData[camelField] !== undefined) {
        fields.push(`${field} = ?`);
        values.push(updateData[camelField]);
      }
    }

    if (fields.length === 0) {
      return await this.findById(userId);
    }

    values.push(userId);
    await pool.execute(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return await this.findById(userId);
  }

  /**
   * 修改密码
   * @param {number} userId - 用户ID
   * @param {string} newPassword - 新密码（明文）
   */
  static async updatePassword(userId, newPassword) {
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await pool.execute(
      'UPDATE users SET password_hash = ? WHERE id = ?',
      [passwordHash, userId]
    );
  }

  /**
   * 验证密码
   * @param {string} plainPassword - 明文密码
   * @param {string} hashedPassword - 哈希密码
   * @returns {boolean}
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * 更新用户状态
   * @param {number} userId - 用户ID
   * @param {number} status - 状态 (1=正常, 0=禁用)
   */
  static async updateStatus(userId, status) {
    await pool.execute(
      'UPDATE users SET status = ? WHERE id = ?',
      [status, userId]
    );
  }

  /**
   * 获取用户列表（分页）
   * @param {Object} params - 查询参数
   * @returns {Object} { list, total }
   */
  static async getList(params) {
    const { page = 1, pageSize = 10, keyword = '', status } = params;
    const offset = (page - 1) * pageSize;

    let whereClause = 'WHERE 1=1';
    const values = [];

    if (keyword) {
      whereClause += ' AND (username LIKE ? OR nickname LIKE ? OR business_name LIKE ?)';
      values.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    if (status !== undefined && status !== '') {
      whereClause += ' AND status = ?';
      values.push(status);
    }

    // 获取总数
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      values
    );
    const total = countResult[0].total;

    // 获取列表
    const [list] = await pool.execute(
      `SELECT id, username, user_type, nickname, phone, email,
              avatar_url, business_name, status, last_login_at, created_at
       FROM users ${whereClause}
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [...values, parseInt(pageSize), parseInt(offset)]
    );

    return { list, total };
  }
}

module.exports = UserModel;
