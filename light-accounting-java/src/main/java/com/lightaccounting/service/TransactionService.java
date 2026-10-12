package com.lightaccounting.service;

import com.lightaccounting.common.PageResult;
import com.lightaccounting.dto.request.CreateTransactionRequest;
import com.lightaccounting.dto.request.UpdateTransactionRequest;
import com.lightaccounting.entity.Transaction;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface TransactionService {
    Transaction create(Long userId, CreateTransactionRequest request);
    Transaction getById(Long id, Long userId);
    PageResult<Transaction> getList(Long userId, Map<String, Object> params);
    Transaction update(Long id, Long userId, UpdateTransactionRequest request);
    void delete(Long id, Long userId);
    Map<String, Object> getMonthlyStats(Long userId, String yearMonth);
    List<Map<String, Object>> getDailyTrend(Long userId, LocalDate startDate, LocalDate endDate);
    PageResult<Transaction> getPendingList(Long userId, Integer type, Integer page, Integer pageSize);
    Transaction settle(Long id, Long userId);
    Map<String, Object> getHomeData(Long userId, Integer year, Integer month);
    Map<String, Object> getYearlyStats(Long userId, Integer year);
    List<Map<String, Object>> getYearlyMonthlyTrend(Long userId, Integer year);
    PageResult<Transaction> getYearlyList(Long userId, Integer year, Integer page, Integer pageSize, Integer type);
}
