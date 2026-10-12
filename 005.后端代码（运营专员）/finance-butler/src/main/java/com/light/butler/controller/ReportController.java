package com.light.butler.controller;

import com.light.butler.common.Result;
import com.light.butler.utils.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

/**
 * 财务报表 Controller
 */
@RestController
@RequestMapping("/reports")
@Tag(name = "财务报表", description = "财务报表相关接口")
@SecurityRequirement(name = "bearerAuth")
public class ReportController {

    private final JwtUtils jwtUtils;

    public ReportController(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "获取仪表盘数据")
    public Result<Map<String, Object>> getDashboard(
            @RequestHeader("Authorization") String token) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));

        Map<String, Object> dashboard = new HashMap<>();

        // TODO: 实际项目中应从数据库汇总计算
        // 这里返回模拟数据，实际使用时应连接数据库查询
        dashboard.put("totalReceivable", BigDecimal.ZERO);
        dashboard.put("totalPayable", BigDecimal.ZERO);
        dashboard.put("totalInvoiceAmount", BigDecimal.ZERO);
        dashboard.put("arOverdueCount", 0);
        dashboard.put("apOverdueCount", 0);
        dashboard.put("contractExpiringCount", 0);
        dashboard.put("recentTransactions", java.util.Collections.emptyList());

        return Result.success(dashboard);
    }

    @GetMapping("/profit-statement")
    @Operation(summary = "获取利润表")
    public Result<Map<String, Object>> getProfitStatement(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "开始日期") String startDate,
            @Parameter(description = "结束日期") String endDate) {

        Map<String, Object> statement = new HashMap<>();

        // 收入
        statement.put("revenue", BigDecimal.ZERO);
        statement.put("costOfSales", BigDecimal.ZERO);
        statement.put("grossProfit", BigDecimal.ZERO);

        // 费用
        statement.put("operatingExpenses", BigDecimal.ZERO);
        statement.put("sellingExpenses", BigDecimal.ZERO);
        statement.put("administrativeExpenses", BigDecimal.ZERO);
        statement.put("financialExpenses", BigDecimal.ZERO);

        // 利润
        statement.put("operatingProfit", BigDecimal.ZERO);
        statement.put("totalProfit", BigDecimal.ZERO);
        statement.put("netProfit", BigDecimal.ZERO);

        return Result.success(statement);
    }

    @GetMapping("/balance-sheet")
    @Operation(summary = "获取资产负债表")
    public Result<Map<String, Object>> getBalanceSheet(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "报表日期") String reportDate) {

        Map<String, Object> balanceSheet = new HashMap<>();

        // 资产
        balanceSheet.put("totalAssets", BigDecimal.ZERO);
        balanceSheet.put("currentAssets", BigDecimal.ZERO);
        balanceSheet.put("fixedAssets", BigDecimal.ZERO);

        // 负债
        balanceSheet.put("totalLiabilities", BigDecimal.ZERO);
        balanceSheet.put("currentLiabilities", BigDecimal.ZERO);
        balanceSheet.put("longTermLiabilities", BigDecimal.ZERO);

        // 所有者权益
        balanceSheet.put("totalEquity", BigDecimal.ZERO);
        balanceSheet.put("paidInCapital", BigDecimal.ZERO);
        balanceSheet.put("retainedEarnings", BigDecimal.ZERO);

        return Result.success(balanceSheet);
    }

    @GetMapping("/cash-flow")
    @Operation(summary = "获取现金流量表")
    public Result<Map<String, Object>> getCashFlow(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "开始日期") String startDate,
            @Parameter(description = "结束日期") String endDate) {

        Map<String, Object> cashFlow = new HashMap<>();

        // 经营活动
        cashFlow.put("operatingCashInflow", BigDecimal.ZERO);
        cashFlow.put("operatingCashOutflow", BigDecimal.ZERO);
        cashFlow.put("netOperatingCashFlow", BigDecimal.ZERO);

        // 投资活动
        cashFlow.put("investingCashInflow", BigDecimal.ZERO);
        cashFlow.put("investingCashOutflow", BigDecimal.ZERO);
        cashFlow.put("netInvestingCashFlow", BigDecimal.ZERO);

        // 筹资活动
        cashFlow.put("financingCashInflow", BigDecimal.ZERO);
        cashFlow.put("financingCashOutflow", BigDecimal.ZERO);
        cashFlow.put("netFinancingCashFlow", BigDecimal.ZERO);

        // 净流量
        cashFlow.put("netCashIncrease", BigDecimal.ZERO);
        cashFlow.put("beginningBalance", BigDecimal.ZERO);
        cashFlow.put("endingBalance", BigDecimal.ZERO);

        return Result.success(cashFlow);
    }
}
