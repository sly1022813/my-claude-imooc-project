package com.light.butler.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.light.butler.common.Result;
import com.light.butler.entity.Budget;
import com.light.butler.service.BudgetService;
import com.light.butler.utils.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 预算 Controller
 */
@RestController
@RequestMapping("/budgets")
@Tag(name = "预算管理", description = "预算相关接口")
@SecurityRequirement(name = "bearerAuth")
public class BudgetController {

    private final BudgetService budgetService;
    private final JwtUtils jwtUtils;

    public BudgetController(BudgetService budgetService, JwtUtils jwtUtils) {
        this.budgetService = budgetService;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping
    @Operation(summary = "分页查询预算")
    public Result<IPage<Budget>> listBudgets(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "10") int pageSize,
            @Parameter(description = "年度") @RequestParam(required = false) Integer year,
            @Parameter(description = "月份") @RequestParam(required = false) Integer month,
            @Parameter(description = "类型") @RequestParam(required = false) Integer type) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        IPage<Budget> result = budgetService.pageBudgets(userId, page, pageSize, year, month, type);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取预算详情")
    public Result<Budget> getBudget(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "预算ID") @PathVariable Long id) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        Budget budget = budgetService.getBudget(userId, id);
        return budget != null ? Result.success(budget) : Result.error("预算不存在");
    }

    @PostMapping
    @Operation(summary = "新增预算")
    public Result<Void> createBudget(
            @RequestHeader("Authorization") String token,
            @RequestBody Budget budget) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        budget.setUserId(userId);
        budget.setExecutedAmount(java.math.BigDecimal.ZERO);
        budget.setExecutionRate(java.math.BigDecimal.ZERO);
        budget.setStatus(1); // 草稿
        budgetService.save(budget);
        return Result.success("创建成功", null);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新预算")
    public Result<Void> updateBudget(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "预算ID") @PathVariable Long id,
            @RequestBody Budget budget) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        budget.setId(id);
        budget.setUserId(userId);
        budgetService.updateById(budget);
        return Result.success("更新成功", null);
    }

    @GetMapping("/year-summary")
    @Operation(summary = "获取年度预算汇总")
    public Result<Map<String, Object>> getYearSummary(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "年度") @RequestParam(required = false) Integer year) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        if (year == null) {
            year = java.time.LocalDate.now().getYear();
        }
        Map<String, Object> result = budgetService.getYearSummary(userId, year);
        return Result.success(result);
    }

    @GetMapping("/month-execution")
    @Operation(summary = "获取月度预算执行情况")
    public Result<List<Budget>> getMonthExecution(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "年度") @RequestParam(required = false) Integer year,
            @Parameter(description = "月份") @RequestParam(required = false) Integer month) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        java.time.LocalDate now = java.time.LocalDate.now();
        if (year == null) year = now.getYear();
        if (month == null) month = now.getMonthValue();
        List<Budget> result = budgetService.getMonthExecution(userId, year, month);
        return Result.success(result);
    }
}
