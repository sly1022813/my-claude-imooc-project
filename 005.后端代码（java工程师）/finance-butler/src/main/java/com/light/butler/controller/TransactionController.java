package com.light.butler.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.light.butler.common.Result;
import com.light.butler.dto.TransactionRequest;
import com.light.butler.entity.Transaction;
import com.light.butler.service.TransactionService;
import com.light.butler.utils.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

/**
 * 收支记录 Controller
 */
@RestController
@RequestMapping("/transactions")
@Tag(name = "收支记录", description = "收支记录相关接口")
@SecurityRequirement(name = "bearerAuth")
public class TransactionController {

    private final TransactionService transactionService;
    private final JwtUtils jwtUtils;

    @Autowired
    public TransactionController(TransactionService transactionService, JwtUtils jwtUtils) {
        this.transactionService = transactionService;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping
    @Operation(summary = "获取收支记录列表")
    public Result<IPage<Transaction>> listTransactions(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "20") int pageSize,
            @Parameter(description = "类型：1=支出, 2=收入") @RequestParam(required = false) Integer type,
            @Parameter(description = "开始日期") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @Parameter(description = "结束日期") @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate,
            @Parameter(description = "分类ID") @RequestParam(required = false) Long categoryId,
            @Parameter(description = "状态") @RequestParam(required = false) Integer status,
            @Parameter(description = "关键词") @RequestParam(required = false) String keyword) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        IPage<Transaction> result = transactionService.pageTransactions(
                userId, page, pageSize, type, startDate, endDate, categoryId, status, keyword);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取收支记录详情")
    public Result<Transaction> getTransaction(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "记录ID") @PathVariable Long id) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        Transaction transaction = transactionService.getTransaction(userId, id);
        if (transaction == null) {
            return Result.error("记录不存在");
        }
        return Result.success(transaction);
    }

    @PostMapping
    @Operation(summary = "创建收支记录")
    public Result<Transaction> createTransaction(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody TransactionRequest request) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        Transaction transaction = transactionService.createTransaction(userId, request);
        return Result.success("创建成功", transaction);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新收支记录")
    public Result<Transaction> updateTransaction(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "记录ID") @PathVariable Long id,
            @Valid @RequestBody TransactionRequest request) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        Transaction transaction = transactionService.updateTransaction(userId, id, request);
        if (transaction == null) {
            return Result.error("记录不存在");
        }
        return Result.success("更新成功", transaction);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除收支记录")
    public Result<Void> deleteTransaction(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "记录ID") @PathVariable Long id) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        boolean success = transactionService.deleteTransaction(userId, id);
        if (!success) {
            return Result.error("记录不存在");
        }
        return Result.success("删除成功", null);
    }

    @PostMapping("/{id}/settle")
    @Operation(summary = "收讫处理")
    public Result<Transaction> settleTransaction(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "记录ID") @PathVariable Long id) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        Transaction transaction = transactionService.settleTransaction(userId, id);
        if (transaction == null) {
            return Result.error("记录不存在");
        }
        return Result.success("收讫处理成功", transaction);
    }

    @GetMapping("/stats/monthly")
    @Operation(summary = "月度统计")
    public Result<Map<String, Object>> getMonthlyStats(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "年份") @RequestParam int year,
            @Parameter(description = "月份") @RequestParam int month) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        Map<String, Object> stats = transactionService.getMonthlyStats(userId, year, month);
        return Result.success(stats);
    }

    @GetMapping("/stats/daily-trend")
    @Operation(summary = "每日趋势")
    public Result<Map<String, Object>> getDailyTrend(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "年份") @RequestParam int year,
            @Parameter(description = "月份") @RequestParam int month) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        Map<String, Object> stats = transactionService.getDailyTrend(userId, year, month);
        return Result.success(stats);
    }

    @GetMapping("/stats/yearly")
    @Operation(summary = "年度统计")
    public Result<Map<String, Object>> getYearlyStats(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "年份") @RequestParam int year) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        Map<String, Object> stats = transactionService.getYearlyStats(userId, year);
        return Result.success(stats);
    }

    @GetMapping("/stats/yearly-monthly")
    @Operation(summary = "年度月度趋势")
    public Result<Map<String, Object>> getYearlyMonthlyTrend(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "年份") @RequestParam int year) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        Map<String, Object> stats = transactionService.getYearlyMonthlyTrend(userId, year);
        return Result.success(stats);
    }

    @GetMapping("/home")
    @Operation(summary = "首页数据")
    public Result<Map<String, Object>> getHomeData(
            @RequestHeader("Authorization") String token) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        Map<String, Object> data = transactionService.getHomeData(userId);
        return Result.success(data);
    }

    @GetMapping("/pending")
    @Operation(summary = "待收/待付款列表")
    public Result<IPage<Transaction>> getPendingList(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "20") int pageSize,
            @Parameter(description = "类型：1=待付, 2=待收") @RequestParam(required = false) Integer type) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        IPage<Transaction> result = transactionService.getPendingList(userId, page, pageSize, type);
        return Result.success(result);
    }

    @GetMapping("/yearly-list")
    @Operation(summary = "年度收支记录列表")
    public Result<IPage<Transaction>> getYearlyList(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "年份") @RequestParam int year,
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "20") int pageSize) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        IPage<Transaction> result = transactionService.getYearlyList(userId, year, page, pageSize);
        return Result.success(result);
    }
}
