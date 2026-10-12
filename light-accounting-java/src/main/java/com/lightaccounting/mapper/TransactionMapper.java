package com.lightaccounting.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lightaccounting.entity.Transaction;
import org.apache.ibatis.annotations.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Mapper
public interface TransactionMapper extends BaseMapper<Transaction> {

    @Select("SELECT t.*, c.name as category_name, c.icon as category_icon, c.color as category_color " +
            "FROM transactions t LEFT JOIN categories c ON t.category_id = c.id " +
            "WHERE t.id = #{id} AND t.user_id = #{userId}")
    Transaction findById(@Param("id") Long id, @Param("userId") Long userId);

    @Select("SELECT COUNT(*) FROM transactions t WHERE t.user_id = #{userId} AND " +
            "DATE_FORMAT(t.date, '%Y-%m') = #{yearMonth} AND t.type = #{type}")
    int countByMonthAndType(@Param("userId") Long userId, @Param("yearMonth") String yearMonth, @Param("type") Integer type);

    @Select("SELECT " +
            "SUM(CASE WHEN type = 1 THEN amount ELSE 0 END) as total_expense, " +
            "SUM(CASE WHEN type = 2 THEN amount ELSE 0 END) as total_income, " +
            "COUNT(CASE WHEN type = 1 THEN 1 END) as expense_count, " +
            "COUNT(CASE WHEN type = 2 THEN 1 END) as income_count " +
            "FROM transactions WHERE user_id = #{userId} AND DATE_FORMAT(date, '%Y-%m') = #{yearMonth}")
    Map<String, Object> getMonthlyStats(@Param("userId") Long userId, @Param("yearMonth") String yearMonth);

    @Select("SELECT t.category_id, c.name as category_name, c.icon as category_icon, c.color as category_color, " +
            "t.type, SUM(t.amount) as total_amount, COUNT(*) as transaction_count " +
            "FROM transactions t LEFT JOIN categories c ON t.category_id = c.id " +
            "WHERE t.user_id = #{userId} AND DATE_FORMAT(t.date, '%Y-%m') = #{yearMonth} " +
            "GROUP BY t.category_id, c.name, c.icon, c.color, t.type " +
            "ORDER BY t.type, total_amount DESC")
    List<Map<String, Object>> getCategoryStats(@Param("userId") Long userId, @Param("yearMonth") String yearMonth);

    @Select("SELECT date, " +
            "SUM(CASE WHEN type = 1 THEN amount ELSE 0 END) as daily_expense, " +
            "SUM(CASE WHEN type = 2 THEN amount ELSE 0 END) as daily_income, " +
            "COUNT(*) as transaction_count " +
            "FROM transactions WHERE user_id = #{userId} AND date BETWEEN #{startDate} AND #{endDate} " +
            "GROUP BY date ORDER BY date ASC")
    List<Map<String, Object>> getDailyTrend(@Param("userId") Long userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Select("SELECT * FROM transactions WHERE user_id = #{userId} AND type = #{type} AND status = 2 ORDER BY date ASC")
    Page<Transaction> getPendingList(Page<Transaction> page, @Param("userId") Long userId, @Param("type") Integer type);

    @Select("SELECT * FROM transactions WHERE user_id = #{userId} AND " +
            "(remark LIKE #{keyword} OR counterparty LIKE #{keyword}) ORDER BY date DESC, time DESC")
    Page<Transaction> searchByKeyword(Page<Transaction> page, @Param("userId") Long userId, @Param("keyword") String keyword);
}
