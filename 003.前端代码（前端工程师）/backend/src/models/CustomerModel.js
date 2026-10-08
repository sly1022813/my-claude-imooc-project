/**
 * 客户模型
 */
const { pool } = require('../config/database');

class CustomerModel {
  /**
   * 创建客户
   * @param {Object} data - 客户数据
   * @returns {Object} 创建的客户
   */
  static async create(userId, data) {
    const { name, phone, address, customerType, creditLimit, remark } = data;

    const [result] = await pool.execute(
      `INSERT INTO customers (user_id, name, phone, address, customer_type, credit_limit, remark, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [userId, name, phone || null, address || null, customerType || null, creditLimit || null, remark || null]
    );

    return await this.findById(result.insertId, userId);
  }

  /**
   * 根据ID获取客户
   * @param {number} id - 客户ID
   * @param {number} userId - 用户ID
   * @returns {Object|null} 客户对象
   */
  static async findById(id, userId) {
    const [rows] = await pool.execute(
      `SELECT c.*,
              (SELECT COUNT(*) FROM transactions WHERE counterparty_id = c.id AND counterparty_type = 1) as transaction_count,
              (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE counterparty_id = c.id AND counterparty_type = 1 AND type = 2) as total_income,
              (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE counterparty_id = c.id AND counterparty_type = 1 AND type = 1) as total_expense,
              COALESCE(c.outstanding_amount, 0) as balance
       FROM customers c
       WHERE c.id = ? AND c.user_id = ?`,
      [id, userId]
    );
    return rows[0] || null;
  }

  /**
   * 获取客户列表（分页）
   * @param {number} userId - 用户ID
   * @param {Object} params - 查询参数
   * @returns {Object} { list, total }
   */
  static async getList(userId, params = {}) {
    const {
      page = 1,
      pageSize = 20,
      keyword = '',
      status,
      hasOutstanding // 是否有欠款
    } = params;

    const offset = (page - 1) * pageSize;
    const conditions = ['user_id = ?'];
    const values = [userId];

    if (keyword) {
      conditions.push('(name LIKE ? OR phone LIKE ? OR address LIKE ?)');
      values.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    if (status !== undefined && status !== '') {
      conditions.push('status = ?');
      values.push(status);
    }

    if (hasOutstanding === 'true' || hasOutstanding === true) {
      conditions.push('outstanding_amount > 0');
    }

    const whereClause = conditions.join(' AND ');

    // 获取总数
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM customers WHERE ${whereClause}`,
      values
    );
    const total = countResult[0].total;

    // 获取列表
    const [list] = await pool.execute(
      `SELECT c.*,
              (SELECT COUNT(*) FROM transactions WHERE counterparty_id = c.id AND counterparty_type = 1) as transaction_count,
              (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE counterparty_id = c.id AND counterparty_type = 1 AND type = 2) as total_income,
              (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE counterparty_id = c.id AND counterparty_type = 1 AND type = 1) as total_expense,
              COALESCE(c.outstanding_amount, 0) as balance
       FROM customers c
       WHERE ${whereClause}
       ORDER BY outstanding_amount DESC, created_at DESC
       LIMIT ? OFFSET ?`,
      [...values, parseInt(pageSize), parseInt(offset)]
    );

    return { list, total };
  }

  /**
   * 更新客户信息
   * @param {number} id - 客户ID
   * @param {number} userId - 用户ID
   * @param {Object} data - 更新数据
   * @returns {Object|null} 更新后的客户
   */
  static async update(id, userId, data) {
    const { name, phone, address, customerType, creditLimit, remark, status } = data;

    const fields = [];
    const values = [];

    if (name !== undefined) { fields.push('name = ?'); values.push(name); }
    if (phone !== undefined) { fields.push('phone = ?'); values.push(phone); }
    if (address !== undefined) { fields.push('address = ?'); values.push(address); }
    if (customerType !== undefined) { fields.push('customer_type = ?'); values.push(customerType); }
    if (creditLimit !== undefined) { fields.push('credit_limit = ?'); values.push(creditLimit); }
    if (remark !== undefined) { fields.push('remark = ?'); values.push(remark); }
    if (status !== undefined) { fields.push('status = ?'); values.push(status); }

    if (fields.length === 0) {
      return await this.findById(id, userId);
    }

    values.push(id, userId);
    await pool.execute(
      `UPDATE customers SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
      values
    );

    return await this.findById(id, userId);
  }

  /**
   * 删除客户
   * @param {number} id - 客户ID
   * @param {number} userId - 用户ID
   * @returns {boolean} 是否成功
   */
  static async delete(id, userId) {
    // 检查是否有关联的交易记录
    const [count] = await pool.execute(
      'SELECT COUNT(*) as count FROM transactions WHERE counterparty_id = ? AND counterparty_type = 1',
      [id]
    );

    if (count[0].count > 0) {
      // 有关联记录，只禁用不删除
      await pool.execute(
        'UPDATE customers SET status = 0 WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      return true;
    }

    // 删除附件
    await pool.execute(
      'DELETE FROM attachments WHERE ref_type = ? AND ref_id = ?',
      ['customer', id]
    );

    const [result] = await pool.execute(
      'DELETE FROM customers WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    return result.affectedRows > 0;
  }

  /**
   * 获取客户交易明细
   * @param {number} id - 客户ID
   * @param {number} userId - 用户ID
   * @param {Object} params - 分页参数
   * @returns {Object} { list, total }
   */
  static async getTransactions(id, userId, params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const offset = (page - 1) * pageSize;

    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM transactions
       WHERE counterparty_id = ? AND counterparty_type = 1 AND user_id = ?`,
      [id, userId]
    );
    const total = countResult[0].total;

    const [list] = await pool.execute(
      `SELECT t.*, c.name as category_name, c.icon as category_icon
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.counterparty_id = ? AND t.counterparty_type = 1 AND t.user_id = ?
       ORDER BY t.date DESC, t.time DESC
       LIMIT ? OFFSET ?`,
      [id, userId, parseInt(pageSize), parseInt(offset)]
    );

    return { list, total };
  }

  /**
   * 减少客户欠款
   * @param {number} id - 客户ID
   * @param {number} amount - 金额
   */
  static async reduceOutstanding(id, amount) {
    await pool.execute(
      'UPDATE customers SET outstanding_amount = GREATEST(0, outstanding_amount - ?) WHERE id = ?',
      [amount, id]
    );
  }

  /**
   * 检查客户是否存在且属于用户
   * @param {number} id - 客户ID
   * @param {number} userId - 用户ID
   * @returns {boolean}
   */
  static async exists(id, userId) {
    const [rows] = await pool.execute(
      'SELECT 1 FROM customers WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows.length > 0;
  }
}

module.exports = CustomerModel;
