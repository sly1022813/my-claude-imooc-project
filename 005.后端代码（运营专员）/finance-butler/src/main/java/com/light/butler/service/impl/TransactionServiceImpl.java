package com.light.butler.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.light.butler.entity.Transaction;
import com.light.butler.entity.Category;
import com.light.butler.mapper.TransactionMapper;
import com.light.butler.service.TransactionService;
import com.light.butler.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;

/**
 * 收支记录 Service 实现
 */
@Service
public class TransactionServiceImpl extends ServiceImpl<TransactionMapper, Transaction> implements TransactionService {

    @Autowired
    private CategoryService categoryService;

    @Override
    public IPage<Transaction> pageTransactions(Long userId, int page, int pageSize,
                                                Integer type, LocalDate startDate, LocalDate endDate,
                                                Long categoryId, Integer status, String keyword) {
        Page<Transaction> pageParam = new Page<>(page, pageSize);

        LambdaQueryWrapper<Transaction> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Transaction::getUserId, userId);

        if (type != null) {
            wrapper.eq(Transaction::getType, type);
        }
        if (startDate != null) {
            wrapper.ge(Transaction::getTransactionDate, startDate);
        }
        if (endDate != null) {
            wrapper.le(Transaction::getTransactionDate, endDate);
        }
        if (categoryId != null) {
            wrapper.eq(Transaction::getCategoryId, categoryId);
        }
        if (status != null) {
            wrapper.eq(Transaction::getStatus, status);
        }
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(Transaction::getDescription, keyword)
                           .or()
                           .like(Transaction::getInvoiceNo, keyword));
        }

        wrapper.orderByDesc(Transaction::getTransactionDate)
               .orderByDesc(Transaction::getCreatedAt);

        IPage<Transaction> result = this.page(pageParam, wrapper);

        // 填充分类名称
        fillCategoryNames(result.getRecords());

        return result;
    }

    @Override
    public Transaction getTransaction(Long userId, Long id) {
        Transaction transaction = this.getById(id);
        if (transaction != null && transaction.getUserId().equals(userId)) {
            fillCategoryName(transaction);
            return transaction;
        }
        return null;
    }

    @Override
    public Transaction createTransaction(Long userId, com.light.butler.dto.TransactionRequest request) {
        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setType(request.getType());
        transaction.setCategoryId(request.getCategoryId());
        transaction.setAmount(request.getAmount());
        transaction.setDescription(request.getDescription());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setAccountId(request.getAccountId());
        transaction.setCustomerId(request.getCustomerId());
        transaction.setSupplierId(request.getSupplierId());
        transaction.setStatus(request.getStatus() != null ? request.getStatus() : 1);
        transaction.setPaymentMethod(request.getPaymentMethod());
        transaction.setInvoiceNo(request.getInvoiceNo());

        this.save(transaction);
        return transaction;
    }

    @Override
    public Transaction updateTransaction(Long userId, Long id, com.light.butler.dto.TransactionRequest request) {
        Transaction transaction = this.getTransaction(userId, id);
        if (transaction == null) {
            return null;
        }

        if (request.getType() != null) transaction.setType(request.getType());
        if (request.getCategoryId() != null) transaction.setCategoryId(request.getCategoryId());
        if (request.getAmount() != null) transaction.setAmount(request.getAmount());
        if (request.getDescription() != null) transaction.setDescription(request.getDescription());
        if (request.getTransactionDate() != null) transaction.setTransactionDate(request.getTransactionDate());
        if (request.getAccountId() != null) transaction.setAccountId(request.getAccountId());
        if (request.getCustomerId() != null) transaction.setCustomerId(request.getCustomerId());
        if (request.getSupplierId() != null) transaction.setSupplierId(request.getSupplierId());
        if (request.getStatus() != null) transaction.setStatus(request.getStatus());
        if (request.getPaymentMethod() != null) transaction.setPaymentMethod(request.getPaymentMethod());
        if (request.getInvoiceNo() != null) transaction.setInvoiceNo(request.getInvoiceNo());

        this.updateById(transaction);
        return transaction;
    }

    @Override
    public boolean deleteTransaction(Long userId, Long id) {
        Transaction transaction = this.getTransaction(userId, id);
        if (transaction == null) {
            return false;
        }
        return this.removeById(id);
    }

    @Override
    public Transaction settleTransaction(Long userId, Long id) {
        Transaction transaction = this.getTransaction(userId, id);
        if (transaction == null) {
            return null;
        }
        transaction.setStatus(1); // 已支付
        this.updateById(transaction);
        return transaction;
    }

    @Override
    public Map<String, Object> getMonthlyStats(Long userId, int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = YearMonth.of(year, month).atEndOfMonth();

        LambdaQueryWrapper<Transaction> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Transaction::getUserId, userId)
               .ge(Transaction::getTransactionDate, startDate)
               .le(Transaction::getTransactionDate, endDate)
               .eq(Transaction::getStatus, 1); // 只统计已支付

        List<Transaction> transactions = this.list(wrapper);

        // 按分类统计
        Map<Long, BigDecimal> expenseByCategory = new LinkedHashMap<>();
        Map<Long, BigDecimal> incomeByCategory = new LinkedHashMap<>();
        BigDecimal totalExpense = BigDecimal.ZERO;
        BigDecimal totalIncome = BigDecimal.ZERO;

        for (Transaction t : transactions) {
            if (t.getType() == 1) { // 支出
                totalExpense = totalExpense.add(t.getAmount());
                expenseByCategory.merge(t.getCategoryId(), t.getAmount(), BigDecimal::add);
            } else { // 收入
                totalIncome = totalIncome.add(t.getAmount());
                incomeByCategory.merge(t.getCategoryId(), t.getAmount(), BigDecimal::add);
            }
        }

        // 获取分类名称
        List<Category> categories = categoryService.list();
        Map<Long, String> categoryNames = new HashMap<>();
        for (Category c : categories) {
            categoryNames.put(c.getId(), c.getName());
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalExpense", totalExpense);
        result.put("totalIncome", totalIncome);
        result.put("netIncome", totalIncome.subtract(totalExpense));
        result.put("expenseByCategory", expenseByCategory);
        result.put("incomeByCategory", incomeByCategory);
        result.put("categoryNames", categoryNames);

        return result;
    }

    @Override
    public Map<String, Object> getDailyTrend(Long userId, int year, int month) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = YearMonth.of(year, month).atEndOfMonth();

        LambdaQueryWrapper<Transaction> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Transaction::getUserId, userId)
               .ge(Transaction::getTransactionDate, startDate)
               .le(Transaction::getTransactionDate, endDate)
               .eq(Transaction::getStatus, 1);

        List<Transaction> transactions = this.list(wrapper);

        // 按日期统计
        Map<LocalDate, BigDecimal> dailyExpense = new LinkedHashMap<>();
        Map<LocalDate, BigDecimal> dailyIncome = new LinkedHashMap<>();

        // 初始化所有日期
        LocalDate current = startDate;
        while (!current.isAfter(endDate)) {
            dailyExpense.put(current, BigDecimal.ZERO);
            dailyIncome.put(current, BigDecimal.ZERO);
            current = current.plusDays(1);
        }

        for (Transaction t : transactions) {
            LocalDate date = t.getTransactionDate();
            if (t.getType() == 1) {
                dailyExpense.merge(date, t.getAmount(), BigDecimal::add);
            } else {
                dailyIncome.merge(date, t.getAmount(), BigDecimal::add);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("dailyExpense", dailyExpense);
        result.put("dailyIncome", dailyIncome);

        return result;
    }

    @Override
    public Map<String, Object> getYearlyStats(Long userId, int year) {
        LocalDate startDate = LocalDate.of(year, 1, 1);
        LocalDate endDate = LocalDate.of(year, 12, 31);

        LambdaQueryWrapper<Transaction> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Transaction::getUserId, userId)
               .ge(Transaction::getTransactionDate, startDate)
               .le(Transaction::getTransactionDate, endDate)
               .eq(Transaction::getStatus, 1);

        List<Transaction> transactions = this.list(wrapper);

        BigDecimal totalExpense = BigDecimal.ZERO;
        BigDecimal totalIncome = BigDecimal.ZERO;
        Map<Integer, BigDecimal> monthlyExpense = new LinkedHashMap<>();
        Map<Integer, BigDecimal> monthlyIncome = new LinkedHashMap<>();

        // 初始化12个月
        for (int i = 1; i <= 12; i++) {
            monthlyExpense.put(i, BigDecimal.ZERO);
            monthlyIncome.put(i, BigDecimal.ZERO);
        }

        for (Transaction t : transactions) {
            int month = t.getTransactionDate().getMonthValue();
            if (t.getType() == 1) {
                totalExpense = totalExpense.add(t.getAmount());
                monthlyExpense.merge(month, t.getAmount(), BigDecimal::add);
            } else {
                totalIncome = totalIncome.add(t.getAmount());
                monthlyIncome.merge(month, t.getAmount(), BigDecimal::add);
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("totalExpense", totalExpense);
        result.put("totalIncome", totalIncome);
        result.put("netIncome", totalIncome.subtract(totalExpense));
        result.put("monthlyExpense", monthlyExpense);
        result.put("monthlyIncome", monthlyIncome);

        return result;
    }

    @Override
    public Map<String, Object> getYearlyMonthlyTrend(Long userId, int year) {
        return getYearlyStats(userId, year);
    }

    @Override
    public Map<String, Object> getHomeData(Long userId) {
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate endOfMonth = YearMonth.from(today).atEndOfMonth();

        // 本月支出
        LambdaQueryWrapper<Transaction> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Transaction::getUserId, userId)
               .ge(Transaction::getTransactionDate, startOfMonth)
               .le(Transaction::getTransactionDate, endOfMonth)
               .eq(Transaction::getStatus, 1);

        List<Transaction> monthTransactions = this.list(wrapper);

        BigDecimal monthExpense = BigDecimal.ZERO;
        BigDecimal monthIncome = BigDecimal.ZERO;
        for (Transaction t : monthTransactions) {
            if (t.getType() == 1) {
                monthExpense = monthExpense.add(t.getAmount());
            } else {
                monthIncome = monthIncome.add(t.getAmount());
            }
        }

        // 待收/待付金额
        LambdaQueryWrapper<Transaction> pendingWrapper = new LambdaQueryWrapper<>();
        pendingWrapper.eq(Transaction::getUserId, userId)
                      .eq(Transaction::getStatus, 2);

        List<Transaction> pendingList = this.list(pendingWrapper);
        BigDecimal pendingExpense = BigDecimal.ZERO;
        BigDecimal pendingIncome = BigDecimal.ZERO;
        for (Transaction t : pendingList) {
            if (t.getType() == 1) {
                pendingExpense = pendingExpense.add(t.getAmount());
            } else {
                pendingIncome = pendingIncome.add(t.getAmount());
            }
        }

        // 本月记录数
        long monthCount = monthTransactions.size();

        Map<String, Object> result = new HashMap<>();
        result.put("monthExpense", monthExpense);
        result.put("monthIncome", monthIncome);
        result.put("monthNetIncome", monthIncome.subtract(monthExpense));
        result.put("pendingExpense", pendingExpense);
        result.put("pendingIncome", pendingIncome);
        result.put("monthRecordCount", monthCount);

        return result;
    }

    @Override
    public IPage<Transaction> getPendingList(Long userId, int page, int pageSize, Integer type) {
        Page<Transaction> pageParam = new Page<>(page, pageSize);

        LambdaQueryWrapper<Transaction> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Transaction::getUserId, userId)
               .eq(Transaction::getStatus, 2); // 待收/待付

        if (type != null) {
            wrapper.eq(Transaction::getType, type);
        }

        wrapper.orderByDesc(Transaction::getTransactionDate);

        IPage<Transaction> result = this.page(pageParam, wrapper);
        fillCategoryNames(result.getRecords());
        return result;
    }

    @Override
    public IPage<Transaction> getYearlyList(Long userId, int year, int page, int pageSize) {
        Page<Transaction> pageParam = new Page<>(page, pageSize);

        LocalDate startDate = LocalDate.of(year, 1, 1);
        LocalDate endDate = LocalDate.of(year, 12, 31);

        LambdaQueryWrapper<Transaction> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Transaction::getUserId, userId)
               .ge(Transaction::getTransactionDate, startDate)
               .le(Transaction::getTransactionDate, endDate)
               .orderByDesc(Transaction::getTransactionDate)
               .orderByDesc(Transaction::getCreatedAt);

        IPage<Transaction> result = this.page(pageParam, wrapper);
        fillCategoryNames(result.getRecords());
        return result;
    }

    private void fillCategoryName(Transaction transaction) {
        if (transaction != null && transaction.getCategoryId() != null) {
            Category category = categoryService.getById(transaction.getCategoryId());
            if (category != null) {
                transaction.setCategoryName(category.getName());
            }
        }
    }

    private void fillCategoryNames(List<Transaction> transactions) {
        for (Transaction t : transactions) {
            fillCategoryName(t);
        }
    }
}
