package com.light.butler.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.light.butler.entity.Transaction;
import com.light.butler.dto.TransactionRequest;

import java.time.LocalDate;
import java.util.Map;

/**
 * 收支记录 Service
 */
public interface TransactionService extends IService<Transaction> {

    /**
     * 分页查询收支记录
     */
    IPage<Transaction> pageTransactions(Long userId, int page, int pageSize,
                                        Integer type, LocalDate startDate, LocalDate endDate,
                                        Long categoryId, Integer status, String keyword);

    /**
     * 获取收支记录详情
     */
    Transaction getTransaction(Long userId, Long id);

    /**
     * 创建收支记录
     */
    Transaction createTransaction(Long userId, TransactionRequest request);

    /**
     * 更新收支记录
     */
    Transaction updateTransaction(Long userId, Long id, TransactionRequest request);

    /**
     * 删除收支记录
     */
    boolean deleteTransaction(Long userId, Long id);

    /**
     * 收讫处理（更新状态为已支付）
     */
    Transaction settleTransaction(Long userId, Long id);

    /**
     * 月度统计
     */
    Map<String, Object> getMonthlyStats(Long userId, int year, int month);

    /**
     * 每日趋势
     */
    Map<String, Object> getDailyTrend(Long userId, int year, int month);

    /**
     * 年度统计
     */
    Map<String, Object> getYearlyStats(Long userId, int year);

    /**
     * 年度月度趋势
     */
    Map<String, Object> getYearlyMonthlyTrend(Long userId, int year);

    /**
     * 首页数据
     */
    Map<String, Object> getHomeData(Long userId);

    /**
     * 待收/待付款列表
     */
    IPage<Transaction> getPendingList(Long userId, int page, int pageSize, Integer type);

    /**
     * 年度收支记录列表
     */
    IPage<Transaction> getYearlyList(Long userId, int year, int page, int pageSize);
}
