package com.light.butler.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.light.butler.entity.Budget;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * 预算 Service
 */
public interface BudgetService extends IService<Budget> {

    /**
     * 分页查询预算
     */
    IPage<Budget> pageBudgets(Long userId, int page, int pageSize, Integer year, Integer month, Integer type);

    /**
     * 获取预算详情
     */
    Budget getBudget(Long userId, Long budgetId);

    /**
     * 获取年度预算汇总
     */
    Map<String, Object> getYearSummary(Long userId, Integer year);

    /**
     * 获取月度预算执行情况
     */
    List<Budget> getMonthExecution(Long userId, Integer year, Integer month);
}
