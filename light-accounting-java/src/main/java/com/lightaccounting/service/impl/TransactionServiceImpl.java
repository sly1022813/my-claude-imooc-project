package com.lightaccounting.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lightaccounting.common.PageResult;
import com.lightaccounting.dto.request.CreateTransactionRequest;
import com.lightaccounting.dto.request.UpdateTransactionRequest;
import com.lightaccounting.entity.Category;
import com.lightaccounting.entity.Transaction;
import com.lightaccounting.mapper.TransactionMapper;
import com.lightaccounting.mapper.CategoryMapper;
import com.lightaccounting.mapper.CustomerMapper;
import com.lightaccounting.mapper.SupplierMapper;
import com.lightaccounting.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final TransactionMapper transactionMapper;
    private final CategoryMapper categoryMapper;
    private final CustomerMapper customerMapper;
    private final SupplierMapper supplierMapper;

    @Override
    @Transactional
    public Transaction create(Long userId, CreateTransactionRequest request) {
        // 验证分类
        Category category = categoryMapper.findById(request.getCategoryId(), userId);
        if (category == null) {
            throw new BusinessException(4001, "分类不存在");
        }
        if (category.getType() != request.getType()) {
            throw new BusinessException(4002, "分类类型与记录类型不匹配");
        }

        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setType(request.getType());
        transaction.setAmount(request.getAmount());
        transaction.setCategoryId(request.getCategoryId());
        transaction.setDate(request.getDate() != null ? request.getDate() : LocalDate.now());
        transaction.setTime(request.getTime() != null ? request.getTime() : LocalTime.now());
        transaction.setPaymentMethod(request.getPaymentMethod());
        transaction.setCounterparty(request.getCounterparty());
        transaction.setCounterpartyType(request.getCounterpartyType());
        transaction.setCounterpartyId(request.getCounterpartyId());
        transaction.setStatus(request.getStatus() != null ? request.getStatus() : 1);
        transaction.setRemark(request.getRemark());

        // 生成流水号
        transaction.setTransactionNo(generateTransactionNo());

        transactionMapper.insert(transaction);

        // 更新客户/供应商统计
        updateCounterpartyStats(transaction);

        return transactionMapper.findById(transaction.getId(), userId);
    }

    @Override
    public Transaction getById(Long id, Long userId) {
        Transaction transaction = transactionMapper.findById(id, userId);
        if (transaction == null) {
            throw new BusinessException(404, "记录不存在");
        }
        return transaction;
    }

    @Override
    public PageResult<Transaction> getList(Long userId, Map<String, Object> params) {
        Integer page = params.get("page") != null ? Integer.parseInt(params.get("page").toString()) : 1;
        Integer pageSize = params.get("pageSize") != null ? Integer.parseInt(params.get("pageSize").toString()) : 20;

        Page<Transaction> pageParam = new Page<>(page, pageSize);
        QueryWrapper<Transaction> wrapper = new QueryWrapper<>();
        wrapper.eq("user_id", userId);

        if (params.get("type") != null) {
            wrapper.eq("type", Integer.parseInt(params.get("type").toString()));
        }
        if (params.get("categoryId") != null) {
            wrapper.eq("category_id", Long.parseLong(params.get("categoryId").toString()));
        }
        if (params.get("status") != null) {
            wrapper.eq("status", Integer.parseInt(params.get("status").toString()));
        }
        if (params.get("counterpartyType") != null) {
            wrapper.eq("counterparty_type", Integer.parseInt(params.get("counterpartyType").toString()));
        }
        if (params.get("startDate") != null) {
            wrapper.ge("date", params.get("startDate").toString());
        }
        if (params.get("endDate") != null) {
            wrapper.le("date", params.get("endDate").toString());
        }
        if (params.get("keyword") != null && StringUtils.hasText(params.get("keyword").toString())) {
            String keyword = params.get("keyword").toString();
            wrapper.and(w -> w.like("remark", keyword).or().like("counterparty", keyword));
        }

        wrapper.orderByDesc("date", "time");

        Page<Transaction> result = transactionMapper.selectPage(pageParam, wrapper);

        return PageResult.of(result.getRecords(), result.getTotal(), (int) result.getCurrent(), (int) result.getSize());
    }

    @Override
    @Transactional
    public Transaction update(Long id, Long userId, UpdateTransactionRequest request) {
        Transaction transaction = getById(id, userId);

        if (request.getAmount() != null) {
            transaction.setAmount(request.getAmount());
        }
        if (request.getCategoryId() != null) {
            transaction.setCategoryId(request.getCategoryId());
        }
        if (request.getDate() != null) {
            transaction.setDate(request.getDate());
        }
        if (request.getTime() != null) {
            transaction.setTime(request.getTime());
        }
        if (request.getPaymentMethod() != null) {
            transaction.setPaymentMethod(request.getPaymentMethod());
        }
        if (request.getCounterparty() != null) {
            transaction.setCounterparty(request.getCounterparty());
        }
        if (request.getCounterpartyType() != null) {
            transaction.setCounterpartyType(request.getCounterpartyType());
        }
        if (request.getCounterpartyId() != null) {
            transaction.setCounterpartyId(request.getCounterpartyId());
        }
        if (request.getStatus() != null) {
            transaction.setStatus(request.getStatus());
        }
        if (request.getRemark() != null) {
            transaction.setRemark(request.getRemark());
        }

        transactionMapper.updateById(transaction);

        return transactionMapper.findById(id, userId);
    }

    @Override
    @Transactional
    public void delete(Long id, Long userId) {
        Transaction transaction = getById(id, userId);

        // 删除附件
        // attachmentMapper.deleteByRef("transaction", id);

        transactionMapper.deleteById(id);
    }

    @Override
    public Map<String, Object> getMonthlyStats(Long userId, String yearMonth) {
        Map<String, Object> stats = transactionMapper.getMonthlyStats(userId, yearMonth);
        List<Map<String, Object>> categoryStats = transactionMapper.getCategoryStats(userId, yearMonth);

        Map<String, Object> result = new HashMap<>();
        result.put("month", yearMonth);
        result.put("totalExpense", stats.get("total_expense") != null ? new BigDecimal(stats.get("total_expense").toString()) : BigDecimal.ZERO);
        result.put("totalIncome", stats.get("total_income") != null ? new BigDecimal(stats.get("total_income").toString()) : BigDecimal.ZERO);
        result.put("netProfit", result.get("totalIncome"));
        result.put("expenseCount", stats.get("expense_count") != null ? ((Number) stats.get("expense_count")).intValue() : 0);
        result.put("incomeCount", stats.get("income_count") != null ? ((Number) stats.get("income_count")).intValue() : 0);

        List<Map<String, Object>> expenseByCategory = categoryStats.stream()
                .filter(c -> c.get("type").toString().equals("1"))
                .map(this::convertCategoryStat)
                .collect(Collectors.toList());

        List<Map<String, Object>> incomeByCategory = categoryStats.stream()
                .filter(c -> c.get("type").toString().equals("2"))
                .map(this::convertCategoryStat)
                .collect(Collectors.toList());

        result.put("expenseByCategory", expenseByCategory);
        result.put("incomeByCategory", incomeByCategory);

        return result;
    }

    @Override
    public List<Map<String, Object>> getDailyTrend(Long userId, LocalDate startDate, LocalDate endDate) {
        return transactionMapper.getDailyTrend(userId, startDate, endDate);
    }

    @Override
    public PageResult<Transaction> getPendingList(Long userId, Integer type, Integer page, Integer pageSize) {
        Page<Transaction> pageParam = new Page<>(page, pageSize);
        Page<Transaction> result = transactionMapper.getPendingList(pageParam, userId, type);
        return PageResult.of(result.getRecords(), result.getTotal(), (int) result.getCurrent(), (int) result.getSize());
    }

    @Override
    @Transactional
    public Transaction settle(Long id, Long userId) {
        Transaction transaction = getById(id, userId);
        if (transaction.getStatus() == 1) {
            return transaction;
        }

        transaction.setStatus(1);
        transactionMapper.updateById(transaction);

        // 更新客户/供应商欠款
        updateCounterpartyStats(transaction);

        return transactionMapper.findById(id, userId);
    }

    @Override
    public Map<String, Object> getHomeData(Long userId, Integer year, Integer month) {
        if (year == null) year = LocalDate.now().getYear();
        if (month == null) month = LocalDate.now().getMonthValue();

        String yearMonth = String.format("%d-%02d", year, month);
        Map<String, Object> stats = getMonthlyStats(userId, yearMonth);

        Map<String, Object> result = new HashMap<>();
        result.put("year", year);
        result.put("month", month);
        result.put("yearMonth", yearMonth);
        result.put("totalIncome", stats.get("totalIncome"));
        result.put("totalExpense", stats.get("totalExpense"));
        result.put("netProfit", stats.get("netProfit"));

        // 最近3条记录
        Map<String, Object> recentParams = new HashMap<>();
        recentParams.put("page", 1);
        recentParams.put("pageSize", 3);
        recentParams.put("startDate", yearMonth + "-01");
        recentParams.put("endDate", yearMonth + "-31");
        PageResult<Transaction> recentResult = getList(userId, recentParams);
        result.put("recentTransactions", recentResult.getList());

        return result;
    }

    @Override
    public Map<String, Object> getYearlyStats(Long userId, Integer year) {
        String yearStr = String.valueOf(year);
        Map<String, Object> stats = transactionMapper.getMonthlyStats(userId, yearStr);
        List<Map<String, Object>> categoryStats = transactionMapper.getCategoryStats(userId, yearStr);

        Map<String, Object> result = new HashMap<>();
        result.put("year", year);
        result.put("totalExpense", stats.get("total_expense") != null ? new BigDecimal(stats.get("total_expense").toString()) : BigDecimal.ZERO);
        result.put("totalIncome", stats.get("total_income") != null ? new BigDecimal(stats.get("total_income").toString()) : BigDecimal.ZERO);
        result.put("netProfit", result.get("totalIncome"));
        result.put("expenseCount", stats.get("expense_count") != null ? ((Number) stats.get("expense_count")).intValue() : 0);
        result.put("incomeCount", stats.get("income_count") != null ? ((Number) stats.get("income_count")).intValue() : 0);

        List<Map<String, Object>> expenseByCategory = categoryStats.stream()
                .filter(c -> c.get("type").toString().equals("1"))
                .map(this::convertCategoryStat)
                .collect(Collectors.toList());

        List<Map<String, Object>> incomeByCategory = categoryStats.stream()
                .filter(c -> c.get("type").toString().equals("2"))
                .map(this::convertCategoryStat)
                .collect(Collectors.toList());

        result.put("expenseByCategory", expenseByCategory);
        result.put("incomeByCategory", incomeByCategory);

        return result;
    }

    @Override
    public List<Map<String, Object>> getYearlyMonthlyTrend(Long userId, Integer year) {
        LocalDate startDate = LocalDate.of(year, 1, 1);
        LocalDate endDate = LocalDate.of(year, 12, 31);

        List<Map<String, Object>> dailyData = transactionMapper.getDailyTrend(userId, startDate, endDate);

        // 按月份聚合
        Map<Integer, Map<String, Object>> monthlyMap = new TreeMap<>();
        for (int m = 1; m <= 12; m++) {
            Map<String, Object> monthData = new HashMap<>();
            monthData.put("month", m);
            monthData.put("month_name", m + "月");
            monthData.put("monthly_expense", BigDecimal.ZERO);
            monthData.put("monthly_income", BigDecimal.ZERO);
            monthData.put("monthly_profit", BigDecimal.ZERO);
            monthData.put("transaction_count", 0);
            monthlyMap.put(m, monthData);
        }

        for (Map<String, Object> day : dailyData) {
            LocalDate date = LocalDate.parse(day.get("date").toString());
            int month = date.getMonthValue();
            Map<String, Object> monthData = monthlyMap.get(month);

            if (day.get("daily_expense") != null) {
                monthData.put("monthly_expense",
                    new BigDecimal(monthData.get("monthly_expense").toString())
                    .add(new BigDecimal(day.get("daily_expense").toString())));
            }
            if (day.get("daily_income") != null) {
                monthData.put("monthly_income",
                    new BigDecimal(monthData.get("monthly_income").toString())
                    .add(new BigDecimal(day.get("daily_income").toString())));
            }
            if (day.get("transaction_count") != null) {
                monthData.put("transaction_count",
                    ((Number) monthData.get("transaction_count")).intValue() +
                    ((Number) day.get("transaction_count")).intValue());
            }
        }

        return new ArrayList<>(monthlyMap.values());
    }

    @Override
    public PageResult<Transaction> getYearlyList(Long userId, Integer year, Integer page, Integer pageSize, Integer type) {
        Map<String, Object> params = new HashMap<>();
        params.put("page", page != null ? page : 1);
        params.put("pageSize", pageSize != null ? pageSize : 50);
        if (type != null) {
            params.put("type", type);
        }
        // 添加年份范围
        params.put("startDate", year + "-01-01");
        params.put("endDate", year + "-12-31");

        return getList(userId, params);
    }

    private String generateTransactionNo() {
        String dateStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMdd"));
        return "TX" + dateStr + String.format("%06d", new Random().nextInt(999999));
    }

    private void updateCounterpartyStats(Transaction transaction) {
        if (transaction.getCounterpartyType() == null || transaction.getCounterpartyId() == null) {
            return;
        }

        BigDecimal outstandingChange = BigDecimal.ZERO;
        if (transaction.getStatus() == 2) { // 待收/待付状态
            if (transaction.getCounterpartyType() == 1 && transaction.getType() == 2) { // 客户-收入
                outstandingChange = transaction.getAmount();
            } else if (transaction.getCounterpartyType() == 2 && transaction.getType() == 1) { // 供应商-支出
                outstandingChange = transaction.getAmount();
            }
        }

        if (transaction.getCounterpartyType() == 1) {
            BigDecimal totalChange = transaction.getType() == 2 ? transaction.getAmount() : BigDecimal.ZERO;
            customerMapper.updateStats(transaction.getCounterpartyId(), totalChange, outstandingChange);
        } else if (transaction.getCounterpartyType() == 2) {
            BigDecimal totalChange = transaction.getType() == 1 ? transaction.getAmount() : BigDecimal.ZERO;
            supplierMapper.updateStats(transaction.getCounterpartyId(), totalChange, outstandingChange);
        }
    }

    private Map<String, Object> convertCategoryStat(Map<String, Object> stat) {
        Map<String, Object> result = new HashMap<>();
        result.put("category_id", stat.get("category_id"));
        result.put("category_name", stat.get("category_name"));
        result.put("category_icon", stat.get("category_icon"));
        result.put("category_color", stat.get("category_color"));
        result.put("total", stat.get("total_amount"));
        return result;
    }
}
