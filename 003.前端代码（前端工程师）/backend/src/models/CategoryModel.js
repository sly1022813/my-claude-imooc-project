/**
 * 分类模型
 */
const { pool } = require('../config/database');

class CategoryModel {
  /**
   * 获取用户可用的分类列表
   * 包含系统分类( user_id=0 )和用户自定义分类
   * @param {number} userId - 用户ID
   * @param {number} type - 类型 1=支出, 2=收入
   * @returns {Array} 分类列表
   */
  static async getList(userId, type = null) {
    let sql = `SELECT id, user_id, type, name, icon, color, is_system, sort_order, status
               FROM categories
               WHERE (user_id = 0 OR user_id = ?) AND status = 1`;
    const params = [userId];

    if (type) {
      sql += ' AND type = ?';
      params.push(type);
    }

    sql += ' ORDER BY is_system DESC, sort_order ASC, id ASC';

    const [rows] = await pool.execute(sql, params);
    return rows;
  }

  /**
   * 根据ID获取分类
   * @param {number} id - 分类ID
   * @param {number} userId - 用户ID（用于验证权限）
   * @returns {Object|null} 分类对象
   */
  static async findById(id, userId = null) {
    let sql = `SELECT * FROM categories WHERE id = ?`;
    const params = [id];

    if (userId) {
      sql += ' AND (user_id = 0 OR user_id = ?)';
      params.push(userId);
    }

    const [rows] = await pool.execute(sql, params);
    return rows[0] || null;
  }

  /**
   * 创建自定义分类
   * @param {Object} data - 分类数据
   * @returns {Object} 创建的分类
   */
  static async create(data) {
    const { userId, type, name, icon, color } = data;

    // 获取最大排序值
    const [maxResult] = await pool.execute(
      'SELECT COALESCE(MAX(sort_order), 0) + 1 as next_order FROM categories WHERE user_id = ?',
      [userId]
    );
    const sortOrder = maxResult[0].next_order;

    const [result] = await pool.execute(
      `INSERT INTO categories (user_id, type, name, icon, color, is_system, sort_order, status)
       VALUES (?, ?, ?, ?, ?, 0, ?, 1)`,
      [userId, type, name, icon || '📌', color || '#999999', sortOrder]
    );

    return await this.findById(result.insertId);
  }

  /**
   * 更新分类
   * @param {number} id - 分类ID
   * @param {number} userId - 用户ID
   * @param {Object} data - 更新数据
   * @returns {Object|null} 更新后的分类
   */
  static async update(id, userId, data) {
    const { name, icon, color, sortOrder, status } = data;

    // 只能更新用户自己的分类，不能更新系统分类
    const category = await this.findById(id, userId);
    if (!category || category.is_system === 1) {
      return null;
    }

    const fields = [];
    const values = [];

    if (name !== undefined) {
      fields.push('name = ?');
      values.push(name);
    }
    if (icon !== undefined) {
      fields.push('icon = ?');
      values.push(icon);
    }
    if (color !== undefined) {
      fields.push('color = ?');
      values.push(color);
    }
    if (sortOrder !== undefined) {
      fields.push('sort_order = ?');
      values.push(sortOrder);
    }
    if (status !== undefined) {
      fields.push('status = ?');
      values.push(status);
    }

    if (fields.length === 0) {
      return category;
    }

    values.push(id, userId);
    await pool.execute(
      `UPDATE categories SET ${fields.join(', ')} WHERE id = ? AND user_id = ? AND is_system = 0`,
      values
    );

    return await this.findById(id);
  }

  /**
   * 删除分类（只能删除用户自定义分类）
   * @param {number} id - 分类ID
   * @param {number} userId - 用户ID
   * @returns {boolean} 是否成功
   */
  static async delete(id, userId) {
    const [result] = await pool.execute(
      'DELETE FROM categories WHERE id = ? AND user_id = ? AND is_system = 0',
      [id, userId]
    );
    return result.affectedRows > 0;
  }

  /**
   * 检查分类是否属于用户
   * @param {number} categoryId - 分类ID
   * @param {number} userId - 用户ID
   * @returns {boolean}
   */
  static async isOwner(categoryId, userId) {
    const [rows] = await pool.execute(
      'SELECT 1 FROM categories WHERE id = ? AND (user_id = 0 OR user_id = ?)',
      [categoryId, userId]
    );
    return rows.length > 0;
  }
}

module.exports = CategoryModel;
