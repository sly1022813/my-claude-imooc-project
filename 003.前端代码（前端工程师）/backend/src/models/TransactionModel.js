/**
 * 收支记录模型
 */
const { pool } = require('../config/database');

class TransactionModel {
  /**
   * 生成交易流水号
   * @returns {string} 流水号 TX + 年月日 + 6位序号
   */
  static async generateTransactionNo() {
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');

    // 获取今日最大序号
    const [rows] = await pool.execute(
      `SELECT COALESCE(MAX(CAST(RIGHT(transaction_no, 6) AS UNSIGNED)), 0) + 1 as next_seq
       FROM transactions
       WHERE LEFT(transaction_no, 8) = CONCAT('TX', ?)`,
      [dateStr]
    );

    const seq = rows[0].next_seq || 1;
    return `TX${dateStr}${String(seq).padStart(6, '0')}`;
  }

  /**
   * 创建收支记录
   * @param {Object} data - 记录数据
   * @returns {Object} 创建的记录
   */
  static async create(data) {
    const {
      userId, type, amount, categoryId, date, time,
      paymentMethod, counterparty, counterpartyType, counterpartyId,
      status = 1, remark
    } = data;

    // 生成流水号
    const transactionNo = await this.generateTransactionNo();

    const [result] = await pool.execute(
      `INSERT INTO transactions (
        user_id, transaction_no, type, amount, category_id,
        date, time, payment_method, counterparty, counterparty_type,
        counterparty_id, status, remark
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId, transactionNo, type, amount, categoryId,
        date || new Date().toISOString().slice(0, 10),
        time || new Date().toTimeString().slice(0, 8),
        paymentMethod || null,
        counterparty || null,
        counterpartyType || null,
        counterpartyId || null,
        status,
        remark || null
      ]
    );

    // 更新客户/供应商统计
    if (counterpartyType && counterpartyId) {
      await this.updateCounterpartyStats(counterpartyType, counterpartyId, type, amount, status);
    }

    return await this.findById(result.insertId, userId);
  }

  /**
   * 根据ID获取记录
   * @param {number} id - 记录ID
   * @param {number} userId - 用户ID
   * @returns {Object|null} 记录对象
   */
  static async findById(id, userId) {
    const [rows] = await pool.execute(
      `SELECT t.*,
              c.name as category_name, c.icon as category_icon, c.color as category_color,
              CASE t.payment_method
                WHEN 1 THEN '现金'
                WHEN 2 THEN '微信支付'
                WHEN 3 THEN '支付宝'
                WHEN 4 THEN '银行卡'
                WHEN 5 THEN '其他'
                ELSE '其他'
              END as payment_method_name,
              CASE t.counterparty_type
                WHEN 1 THEN '客户'
                WHEN 2 THEN '供应商'
                WHEN 3 THEN '其他'
                ELSE NULL
              END as counterparty_type_name
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.id = ? AND t.user_id = ?`,
      [id, userId]
    );
    return rows[0] || null;
  }

  /**
   * 更新收支记录
   * @param {number} id - 记录ID
   * @param {number} userId - 用户ID
   * @param {Object} data - 更新数据
   * @returns {Object|null} 更新后的记录
   */
  static async update(id, userId, data) {
    const transaction = await this.findById(id, userId);
    if (!transaction) return null;

    const {
      amount, categoryId, date, time,
      paymentMethod, counterparty, counterpartyType, counterpartyId,
      status, remark
    } = data;

    // 如果涉及对方信息变更，需要还原旧统计
    if (transaction.counterparty_type && transaction.counterparty_id) {
      await this.updateCounterpartyStats(
        transaction.counterparty_type,
        transaction.counterparty_id,
        transaction.type,
        transaction.amount,
        -transaction.status // 用负数表示还原
      );
    }

    // 构建更新SQL
    const fields = [];
    const values = [];

    if (amount !== undefined) { fields.push('amount = ?'); values.push(amount); }
    if (categoryId !== undefined) { fields.push('category_id = ?'); values.push(categoryId); }
    if (date !== undefined) { fields.push('date = ?'); values.push(date); }
    if (time !== undefined) { fields.push('time = ?'); values.push(time); }
    if (paymentMethod !== undefined) { fields.push('payment_method = ?'); values.push(paymentMethod); }
    if (counterparty !== undefined) { fields.push('counterparty = ?'); values.push(counterparty); }
    if (counterpartyType !== undefined) { fields.push('counterparty_type = ?'); values.push(counterpartyType); }
    if (counterpartyId !== undefined) { fields.push('counterparty_id = ?'); values.push(counterpartyId); }
    if (status !== undefined) { fields.push('status = ?'); values.push(status); }
    if (remark !== undefined) { fields.push('remark = ?'); values.push(remark); }

    if (fields.length > 0) {
      values.push(id, userId);
      await pool.execute(
        `UPDATE transactions SET ${fields.join(', ')} WHERE id = ? AND user_id = ?`,
        values
      );
    }

    // 更新新对方统计
    if (counterpartyType && counterpartyId) {
      await this.updateCounterpartyStats(counterpartyType, counterpartyId, transaction.type, amount || transaction.amount, status || transaction.status);
    }

    return await this.findById(id, userId);
  }

  /**
   * 删除收支记录
   * @param {number} id - 记录ID
   * @param {number} userId - 用户ID
   * @returns {boolean} 是否成功
   */
  static async delete(id, userId) {
    const transaction = await this.findById(id, userId);
    if (!transaction) return false;

    // 还原客户/供应商统计
    if (transaction.counterparty_type && transaction.counterparty_id) {
      await this.updateCounterpartyStats(
        transaction.counterparty_type,
        transaction.counterparty_id,
        transaction.type,
        transaction.amount,
        -transaction.status
      );
    }

    // 删除附件
    await pool.execute(
      'DELETE FROM attachments WHERE ref_type = ? AND ref_id = ?',
      ['transaction', id]
    );

    // 删除记录
    const [result] = await pool.execute(
      'DELETE FROM transactions WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    return result.affectedRows > 0;
  }

  /**
   * 获取收支记录列表（分页）
   * @param {number} userId - 用户ID
   * @param {Object} params - 查询参数
   * @returns {Object} { list, total }
   */
  static async getList(userId, params = {}) {
    const {
      page = 1,
      pageSize = 20,
      type, // 1=支出, 2=收入
      categoryId,
      status,
      counterpartyType,
      startDate,
      endDate,
      keyword // 搜索备注、对方
    } = params;

    const offset = (page - 1) * pageSize;
    const conditions = ['t.user_id = ?'];
    const values = [userId];

    if (type) {
      conditions.push('t.type = ?');
      values.push(type);
    }
    if (categoryId) {
      conditions.push('t.category_id = ?');
      values.push(categoryId);
    }
    if (status !== undefined && status !== '') {
      conditions.push('t.status = ?');
      values.push(status);
    }
    if (counterpartyType) {
      conditions.push('t.counterparty_type = ?');
      values.push(counterpartyType);
    }
    if (startDate) {
      conditions.push('t.date >= ?');
      values.push(startDate);
    }
    if (endDate) {
      conditions.push('t.date <= ?');
      values.push(endDate);
    }
    if (keyword) {
      conditions.push('(t.remark LIKE ? OR t.counterparty LIKE ?)');
      values.push(`%${keyword}%`, `%${keyword}%`);
    }

    const whereClause = conditions.join(' AND ');

    // 获取总数
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM transactions t WHERE ${whereClause}`,
      values
    );
    const total = countResult[0].total;

    // 获取列表
    const [list] = await pool.execute(
      `SELECT t.*,
              c.name as category_name, c.icon as category_icon, c.color as category_color,
              CASE t.payment_method
                WHEN 1 THEN '现金'
                WHEN 2 THEN '微信支付'
                WHEN 3 THEN '支付宝'
                WHEN 4 THEN '银行卡'
                WHEN 5 THEN '其他'
                ELSE '其他'
              END as payment_method_name
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE ${whereClause}
       ORDER BY t.date DESC, t.time DESC
       LIMIT ? OFFSET ?`,
      [...values, parseInt(pageSize), parseInt(offset)]
    );

    return { list, total };
  }

  /**
   * 获取月度统计
   * @param {number} userId - 用户ID
   * @param {string} yearMonth - 年月 (YYYY-MM)
   * @returns {Object} 统计数据
   */
  static async getMonthlyStats(userId, yearMonth) {
    // 基本统计
    const [stats] = await pool.execute(
      `SELECT
        SUM(CASE WHEN type = 1 THEN amount ELSE 0 END) as total_expense,
        SUM(CASE WHEN type = 2 THEN amount ELSE 0 END) as total_income,
        SUM(CASE WHEN type = 2 THEN amount ELSE -amount END) as net_profit,
        COUNT(CASE WHEN type = 1 THEN 1 END) as expense_count,
        COUNT(CASE WHEN type = 2 THEN 1 END) as income_count
       FROM transactions
       WHERE user_id = ? AND DATE_FORMAT(date, '%Y-%m') = ?`,
      [userId, yearMonth]
    );

    // 分类统计
    const [categoryStats] = await pool.execute(
      `SELECT
        t.category_id,
        c.name as category_name,
        c.icon as category_icon,
        c.color as category_color,
        t.type,
        SUM(t.amount) as total_amount,
        COUNT(*) as transaction_count
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = ? AND DATE_FORMAT(t.date, '%Y-%m') = ?
       GROUP BY t.category_id, c.name, c.icon, c.color, t.type
       ORDER BY t.type, total_amount DESC`,
      [userId, yearMonth]
    );

    return {
      ...stats[0],
      categoryStats
    };
  }

  /**
   * 获取每日收支趋势
   * @param {number} userId - 用户ID
   * @param {string} startDate - 开始日期
   * @param {string} endDate - 结束日期
   * @returns {Array} 每日数据
   */
  static async getDailyTrend(userId, startDate, endDate) {
    const [rows] = await pool.execute(
      `SELECT
        date,
        SUM(CASE WHEN type = 1 THEN amount ELSE 0 END) as daily_expense,
        SUM(CASE WHEN type = 2 THEN amount ELSE 0 END) as daily_income,
        SUM(CASE WHEN type = 2 THEN amount ELSE -amount END) as daily_profit,
        COUNT(*) as transaction_count
       FROM transactions
       WHERE user_id = ? AND date BETWEEN ? AND ?
       GROUP BY date
       ORDER BY date ASC`,
      [userId, startDate, endDate]
    );
    return rows;
  }

  /**
   * 获取待收/待付款列表
   * @param {number} userId - 用户ID
   * @param {number} type - 类型 1=支出(待付), 2=收入(待收)
   * @param {Object} params - 分页参数
   * @returns {Object} { list, total }
   */
  static async getPendingList(userId, type, params = {}) {
    const { page = 1, pageSize = 20 } = params;
    const offset = (page - 1) * pageSize;

    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM transactions
       WHERE user_id = ? AND type = ? AND status = 2`,
      [userId, type]
    );
    const total = countResult[0].total;

    const [list] = await pool.execute(
      `SELECT t.*, c.name as category_name, c.icon as category_icon
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = ? AND t.type = ? AND t.status = 2
       ORDER BY t.date ASC
       LIMIT ? OFFSET ?`,
      [userId, type, parseInt(pageSize), parseInt(offset)]
    );

    return { list, total };
  }

  /**
   * 收讫处理（将待收/待付标记为已完成）
   * @param {number} id - 记录ID
   * @param {number} userId - 用户ID
   * @returns {Object|null} 更新后的记录
   */
  static async settle(id, userId) {
    const transaction = await this.findById(id, userId);
    if (!transaction) return null;
    if (transaction.status === 1) return transaction; // 已收讫

    // 更新状态
    await pool.execute(
      'UPDATE transactions SET status = 1, updated_at = NOW() WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    // 减少对方欠款
    if (transaction.counterparty_type && transaction.counterparty_id) {
      await this.updateCounterpartyStats(
        transaction.counterparty_type,
        transaction.counterparty_id,
        transaction.type,
        transaction.amount,
        -1 // 减少欠款
      );
    }

    return await this.findById(id, userId);
  }

  /**
   * 更新客户/供应商统计
   * @param {number} counterpartyType - 对方类型 1=客户, 2=供应商
   * @param {number} counterpartyId - 对方ID
   * @param {number} type - 收支类型
   * @param {number} amount - 金额
   * @param {number} multiplier - 乘数 1=增加, -1=减少
   */
  static async updateCounterpartyStats(counterpartyType, counterpartyId, type, amount, multiplier) {
    if (counterpartyType === 1) {
      // 客户
      if (type === 2) {
        // 收入增加累计交易
        await pool.execute(
          'UPDATE customers SET total_transaction = total_transaction + ? * ? WHERE id = ?',
          [amount, multiplier, counterpartyId]
        );
      }
      // 待收状态更新欠款
      if (multiplier > 0) {
        await pool.execute(
          'UPDATE customers SET outstanding_amount = outstanding_amount + ? * ? WHERE id = ?',
          [amount, multiplier === 1 ? (type === 2 ? 1 : -1) : (type === 2 ? -1 : 1), counterpartyId]
        );
      } else {
        await pool.execute(
          'UPDATE customers SET outstanding_amount = GREATEST(0, outstanding_amount - ?) WHERE id = ?',
          [amount, counterpartyId]
        );
      }
    } else if (counterpartyType === 2) {
      // 供应商
      if (type === 1) {
        // 支出增加累计采购
        await pool.execute(
          'UPDATE suppliers SET total_purchase = total_purchase + ? * ? WHERE id = ?',
          [amount, multiplier, counterpartyId]
        );
      }
      // 待付状态更新欠款
      if (multiplier > 0) {
        await pool.execute(
          'UPDATE suppliers SET outstanding_amount = outstanding_amount + ? * ? WHERE id = ?',
          [amount, multiplier === 1 ? (type === 1 ? 1 : -1) : (type === 1 ? -1 : 1), counterpartyId]
        );
      } else {
        await pool.execute(
          'UPDATE suppliers SET outstanding_amount = GREATEST(0, outstanding_amount - ?) WHERE id = ?',
          [amount, counterpartyId]
        );
      }
    }
  }
}

module.exports = TransactionModel;
