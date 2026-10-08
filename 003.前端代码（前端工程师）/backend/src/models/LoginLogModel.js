/**
 * 登录日志模型
 */
const { pool } = require('../config/database');

class LoginLogModel {
  /**
   * 创建登录日志
   * @param {Object} logData - 日志数据
   */
  static async create(logData) {
    const { userId, username, loginStatus, failReason, ipAddress, userAgent } = logData;

    await pool.execute(
      `INSERT INTO login_logs (user_id, username, login_status, fail_reason, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId || null, username, loginStatus, failReason || null, ipAddress, userAgent || null]
    );
  }

  /**
   * 获取用户登录历史（分页）
   * @param {number} userId - 用户ID
   * @param {Object} params - 分页参数
   * @returns {Object} { list, total }
   */
  static async getByUserId(userId, params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const offset = (page - 1) * pageSize;

    // 获取总数
    const [countResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM login_logs WHERE user_id = ?',
      [userId]
    );
    const total = countResult[0].total;

    // 获取列表
    const [list] = await pool.execute(
      `SELECT id, user_id, username, login_status, fail_reason, ip_address, user_agent, login_time
       FROM login_logs
       WHERE user_id = ?
       ORDER BY login_time DESC
       LIMIT ? OFFSET ?`,
      [userId, parseInt(pageSize), parseInt(offset)]
    );

    return { list, total };
  }

  /**
   * 获取最近登录失败记录（用于防暴力破解）
   * @param {string} username - 用户名
   * @param {number} minutes - 分钟数
   * @returns {number} 失败次数
   */
  static async getRecentFailCount(username, minutes = 30) {
    const [result] = await pool.execute(
      `SELECT COUNT(*) as count FROM login_logs
       WHERE username = ? AND login_status = 0
       AND login_time > DATE_SUB(NOW(), INTERVAL ? MINUTE)`,
      [username, minutes]
    );
    return result[0].count;
  }
}

module.exports = LoginLogModel;
