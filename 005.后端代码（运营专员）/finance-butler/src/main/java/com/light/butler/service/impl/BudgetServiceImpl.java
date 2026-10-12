package com.light.butler.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.light.butler.entity.Budget;
import com.light.butler.mapper.BudgetMapper;
import com.light.butler.service.BudgetService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 预算 Service 实现
 */
@Service
public class BudgetServiceImpl extends ServiceImpl<BudgetMapper, Budget> implements BudgetService {

    @Override
    public IPage<Budget> pageBudgets(Long userId, int page, int pageSize, Integer year, Integer month, Integer type) {
        Page<Budget> pageParam = new Page<>(page, pageSize);
        LambdaQueryWrapper<Budget> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Budget::getUserId, userId);

        if (year != null) {
            wrapper.eq(Budget::getYear, year);
        }

        if (month != null) {
            wrapper.eq(Budget::getMonth, month);
        }

        if (type != null) {
            wrapper.eq(Budget::getType, type);
        }

        wrapper.orderByDesc(Budget::getCreatedAt);

        return this.page(pageParam, wrapper);
    }

    @Override
    public Budget getBudget(Long userId, Long budgetId) {
        LambdaQueryWrapper<Budget> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Budget::getUserId, userId)
                .eq(Budget::getId, budgetId);
        return this.getOne(wrapper);
    }

    @Override
    public Map<String, Object> getYearSummary(Long userId, Integer year) {
        LambdaQueryWrapper<Budget> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Budget::getUserId, userId)
                .eq(Budget::getYear, year);

        List<Budget> budgets = this.list(wrapper);

        BigDecimal totalIncomeBudget = BigDecimal.ZERO;
        BigDecimal totalExpenseBudget = BigDecimal.ZERO;
        BigDecimal totalIncomeExecuted = BigDecimal.ZERO;
        BigDecimal totalExpenseExecuted = BigDecimal.ZERO;

        for (Budget budget : budgets) {
            if (budget.getType() == 1) { // 收入
                totalIncomeBudget = totalIncomeBudget.add(budget.getBudgetAmount());
                totalIncomeExecuted = totalIncomeExecuted.add(budget.getExecutedAmount());
            } else { // 支出
                totalExpenseBudget = totalExpenseBudget.add(budget.getBudgetAmount());
                totalExpenseExecuted = totalExpenseExecuted.add(budget.getExecutedAmount());
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalIncomeBudget", totalIncomeBudget);
        result.put("totalIncomeExecuted", totalIncomeExecuted);
        result.put("totalIncomeRate", totalIncomeBudget.compareTo(BigDecimal.ZERO) > 0
                ? totalIncomeExecuted.divide(totalIncomeBudget, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100))
                : BigDecimal.ZERO);
        result.put("totalExpenseBudget", totalExpenseBudget);
        result.put("totalExpenseExecuted", totalExpenseExecuted);
        result.put("totalExpenseRate", totalExpenseBudget.compareTo(BigDecimal.ZERO) > 0
                ? totalExpenseExecuted.divide(totalExpenseBudget, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100))
                : BigDecimal.ZERO);
        result.put("budgetCount", budgets.size());

        return result;
    }

    @Override
    public List<Budget> getMonthExecution(Long userId, Integer year, Integer month) {
        LambdaQueryWrapper<Budget> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Budget::getUserId, userId)
                .eq(Budget::getYear, year)
                .eq(Budget::getMonth, month)
                .orderByAsc(Budget::getType, Budget::getCategory);

        return this.list(wrapper);
    }
}
