package com.lightaccounting.controller;

import com.lightaccounting.common.PageResult;
import com.lightaccounting.common.Result;
import com.lightaccounting.dto.request.CreateTransactionRequest;
import com.lightaccounting.dto.request.UpdateTransactionRequest;
import com.lightaccounting.entity.Transaction;
import com.lightaccounting.service.TransactionService;
import com.lightaccounting.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public Result<PageResult<Transaction>> getList(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer pageSize,
            @RequestParam(required = false) Integer type,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Integer counterpartyType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String keyword) {

        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));

        Map<String, Object> params = Map.of(
                "page", page != null ? page : 1,
                "pageSize", pageSize != null ? pageSize : 20,
                "type", type != null ? type : "",
                "categoryId", categoryId != null ? categoryId : "",
                "status", status != null ? status : "",
                "counterpartyType", counterpartyType != null ? counterpartyType : "",
                "startDate", startDate != null ? startDate.toString() : "",
                "endDate", endDate != null ? endDate.toString() : "",
                "keyword", keyword != null ? keyword : ""
        );

        PageResult<Transaction> result = transactionService.getList(userId, params);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<Transaction> getById(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        Transaction transaction = transactionService.getById(id, userId);
        return Result.success(transaction);
    }

    @PostMapping
    public Result<Transaction> create(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody CreateTransactionRequest request) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        Transaction created = transactionService.create(userId, request);
        return Result.success(created, "创建成功");
    }

    @PutMapping("/{id}")
    public Result<Transaction> update(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @Valid @RequestBody UpdateTransactionRequest request) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        Transaction updated = transactionService.update(id, userId, request);
        return Result.success(updated, "更新成功");
    }

    @DeleteMapping("/{id}")
    public Result<?> delete(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        transactionService.delete(id, userId);
        return Result.success("删除成功");
    }

    @GetMapping("/stats/monthly")
    public Result<Map<String, Object>> getMonthlyStats(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) String yearMonth) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        if (yearMonth == null) {
            yearMonth = java.time.LocalDate.now().toString().substring(0, 7);
        }
        Map<String, Object> stats = transactionService.getMonthlyStats(userId, yearMonth);
        return Result.success(stats);
    }

    @GetMapping("/stats/daily-trend")
    public Result<Map<String, Object>> getDailyTrend(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) Integer days) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        int d = days != null ? days : 7;
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(d - 1);
        List<Map<String, Object>> trend = transactionService.getDailyTrend(userId, startDate, endDate);
        return Result.success(Map.of(
                "startDate", startDate.toString(),
                "endDate", endDate.toString(),
                "days", d,
                "data", trend
        ));
    }

    @GetMapping("/pending")
    public Result<PageResult<Transaction>> getPendingList(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) Integer type,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer pageSize) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        PageResult<Transaction> result = transactionService.getPendingList(userId, type != null ? type : 2, page != null ? page : 1, pageSize != null ? pageSize : 20);
        return Result.success(result);
    }

    @PostMapping("/{id}/settle")
    public Result<Transaction> settle(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        Transaction settled = transactionService.settle(id, userId);
        return Result.success(settled, "收讫成功");
    }

    @GetMapping("/home")
    public Result<Map<String, Object>> getHomeData(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        Map<String, Object> data = transactionService.getHomeData(userId, year, month);
        return Result.success(data);
    }

    @GetMapping("/stats/yearly")
    public Result<Map<String, Object>> getYearlyStats(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) Integer year) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        if (year == null) year = java.time.LocalDate.now().getYear();
        Map<String, Object> stats = transactionService.getYearlyStats(userId, year);
        return Result.success(stats);
    }

    @GetMapping("/stats/yearly-monthly")
    public Result<Map<String, Object>> getYearlyMonthlyTrend(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) Integer year) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        if (year == null) year = java.time.LocalDate.now().getYear();
        List<Map<String, Object>> trend = transactionService.getYearlyMonthlyTrend(userId, year);
        return Result.success(Map.of("year", year, "data", trend));
    }

    @GetMapping("/yearly-list")
    public Result<PageResult<Transaction>> getYearlyList(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer pageSize,
            @RequestParam(required = false) Integer type) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        if (year == null) year = java.time.LocalDate.now().getYear();
        PageResult<Transaction> result = transactionService.getYearlyList(userId, year, page, pageSize, type);
        return Result.success(result);
    }
}
