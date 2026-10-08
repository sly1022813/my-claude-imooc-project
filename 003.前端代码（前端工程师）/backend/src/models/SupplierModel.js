/**
 * 供应商模型
 */
const { pool } = require('../config/database');

class SupplierModel {
  /**
   * 创建供应商
   * @param {Object} data - 供应商数据
   * @returns {Object} 创建的供应商
   */
  static async create(userId, data) {
    const { name, phone, address, contactPerson, products, settlementType, remark } = data;

    const [result] = await pool.execute(
      `INSERT INTO suppliers (user_id, name, phone, address, contact_person, products, settlement_type, remark, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [userId, name, phone || null, address || null, contactPerson || null, products || null, settlementType || null, remark || null]
    );

    return await this.findById(result.insertId, userId);
  }

  /**
   * 根据ID获取供应商
   * @param {number} id - 供应商ID
   * @param {number} userId - 用户ID
   * @returns {Object|null} 供应商对象
   */
  static async findById(id, userId) {
    const [rows] = await pool.execute(
      `SELECT s.*,
              (SELECT COUNT(*) FROM transactions WHERE counterparty_id = s.id AND counterparty_type = 2) as transaction_count,
              (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE counterparty_id = s.id AND counterparty_type = 2 AND type = 2) as total_income,
              (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE counterparty_id = s.id AND counterparty_type = 2 AND type = 1) as total_expense,
              COALESCE(s.outstanding_amount, 0) as balance
       FROM suppliers s
       WHERE s.id = ? AND s.user_id = ?`,
      [id, userId]
    );
    return rows[0] || null;
  }

  /**
   * 获取供应商列表（分页）
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
      conditions.push('(name LIKE ? OR phone LIKE ? OR address LIKE ? OR contact_person LIKE ?)');
      values.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
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
      `SELECT COUNT(*) as total FROM suppliers WHERE ${whereClause}`,
      values
    );
    const total = countResult[0].total;

    // 获取列表
    const [list] = await pool.execute(
      `SELECT s.*,
              (SELECT COUNT(*) FROM transactions WHERE counterparty_id = s.id AND counterparty_type = 2) as transaction_count,
              (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE counterparty_id = s.id AND counterparty_type = 2 AND type = 2) as total_income,
              (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE counterparty_id = s.id AND counterparty_type = 2 AND type = 1) as total_expense,
              COALESCE(s.outstanding_amount, 0) as balance
       FROM suppliers s
       WHERE ${whereClause}
       ORDER BY outstanding_amount DESC, created_at DESC
       LIMIT ? OFFSET ?`,
      [...values, parseInt(pageSize), parseInt(offset)]
    );

    return { list, total };
  }

  /**
   * 更新供应商信息
   * @param {number} id - 供应商ID
   * @param {number} userId - 用户ID
   * @param {Object} data - 更新数据
   * @returns {Object|null} 更新后的供应商
   */
  static async update(id, userId, data) {
    const { name, phone, address, contactPerson, products, settlementType, remark, status } = data;

    const fields = [];
    const values = [];

    if (name !== undefined) { fields.push('name = ?'); values.push(name); }
    if (phone !== undefined) { fields.push('phone = ?'); values.push(phone); }
    if (address !== undefined) { fields.push('address = ?'); values.push(address); }
    if (contactPerson !== undefined) { fields.push('contact_person = ?'); values.push(contactPerson); }
    if (products !== undefined) { fields.push('products = ?'); values.push(products); }
    if (settlementType !== undefined) { fields.push('settlement_type = ?'); values.push(settlementType); }
    if (remark !== undefined) { fields.push('remark = ?'); values.push(remark); }
    if (status !== undefined) { fields.push('status = ?'); values.push(status); }

    if (fields.length === 0) {
      return await this.findById(id, userId);
    }

    values.push(id, userId);
    await pool.execute(
      `UPDATE suppliers SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
      values
    );

    return await this.findById(id, userId);
  }

  /**
   * 删除供应商
   * @param {number} id - 供应商ID
   * @param {number} userId - 用户ID
   * @returns {boolean} 是否成功
   */
  static async delete(id, userId) {
    // 检查是否有关联的交易记录
    const [count] = await pool.execute(
      'SELECT COUNT(*) as count FROM transactions WHERE counterparty_id = ? AND counterparty_type = 2',
      [id]
    );

    if (count[0].count > 0) {
      // 有关联记录，只禁用不删除
      await pool.execute(
        'UPDATE suppliers SET status = 0 WHERE id = ? AND user_id = ?',
        [id, userId]
      );
      return true;
    }

    // 删除附件
    await pool.execute(
      'DELETE FROM attachments WHERE ref_type = ? AND ref_id = ?',
      ['supplier', id]
    );

    const [result] = await pool.execute(
      'DELETE FROM suppliers WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    return result.affectedRows > 0;
  }

  /**
   * 获取供应商交易明细
   * @param {number} id - 供应商ID
   * @param {number} userId - 用户ID
   * @param {Object} params - 分页参数
   * @returns {Object} { list, total }
   */
  static async getTransactions(id, userId, params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const offset = (page - 1) * pageSize;

    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM transactions
       WHERE counterparty_id = ? AND counterparty_type = 2 AND user_id = ?`,
      [id, userId]
    );
    const total = countResult[0].total;

    const [list] = await pool.execute(
      `SELECT t.*, c.name as category_name, c.icon as category_icon
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.counterparty_id = ? AND t.counterparty_type = 2 AND t.user_id = ?
       ORDER BY t.date DESC, t.time DESC
       LIMIT ? OFFSET ?`,
      [id, userId, parseInt(pageSize), parseInt(offset)]
    );

    return { list, total };
  }

  /**
   * 减少供应商欠款
   * @param {number} id - 供应商ID
   * @param {number} amount - 金额
   */
  static async reduceOutstanding(id, amount) {
    await pool.execute(
      'UPDATE suppliers SET outstanding_amount = GREATEST(0, outstanding_amount - ?) WHERE id = ?',
      [amount, id]
    );
  }

  /**
   * 检查供应商是否存在且属于用户
   * @param {number} id - 供应商ID
   * @param {number} userId - 用户ID
   * @returns {boolean}
   */
  static async exists(id, userId) {
    const [rows] = await pool.execute(
      'SELECT 1 FROM suppliers WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows.length > 0;
  }
}

module.exports = SupplierModel;
