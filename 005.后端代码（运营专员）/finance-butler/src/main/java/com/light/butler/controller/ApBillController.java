package com.light.butler.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.light.butler.common.Result;
import com.light.butler.entity.ApBill;
import com.light.butler.entity.PaymentRecord;
import com.light.butler.service.ApBillService;
import com.light.butler.utils.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * 应付账款 Controller
 */
@RestController
@RequestMapping("/ap-bills")
@Tag(name = "应付账款", description = "应付账单相关接口")
@SecurityRequirement(name = "bearerAuth")
public class ApBillController {

    private final ApBillService apBillService;
    private final JwtUtils jwtUtils;

    public ApBillController(ApBillService apBillService, JwtUtils jwtUtils) {
        this.apBillService = apBillService;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping
    @Operation(summary = "分页查询应付账单")
    public Result<IPage<ApBill>> listApBills(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "10") int pageSize,
            @Parameter(description = "供应商ID") @RequestParam(required = false) Long supplierId,
            @Parameter(description = "状态") @RequestParam(required = false) Integer status) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        IPage<ApBill> result = apBillService.pageApBills(userId, page, pageSize, supplierId, status);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取应付账单详情")
    public Result<ApBill> getApBill(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "账单ID") @PathVariable Long id) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        ApBill apBill = apBillService.getApBill(userId, id);
        return apBill != null ? Result.success(apBill) : Result.error("账单不存在");
    }

    @PostMapping
    @Operation(summary = "新增应付账单")
    public Result<Void> createApBill(
            @RequestHeader("Authorization") String token,
            @RequestBody ApBill apBill) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        apBill.setUserId(userId);
        apBill.setWrittenOffAmount(BigDecimal.ZERO);
        apBill.setPendingAmount(apBill.getAmount());
        apBill.setStatus(2); // 待付款
        apBillService.save(apBill);
        return Result.success("创建成功", null);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新应付账单")
    public Result<Void> updateApBill(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "账单ID") @PathVariable Long id,
            @RequestBody ApBill apBill) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        apBill.setId(id);
        apBill.setUserId(userId);
        apBillService.updateById(apBill);
        return Result.success("更新成功", null);
    }

    @PostMapping("/{id}/write-off")
    @Operation(summary = "核销应付账单（付款）")
    public Result<Void> writeOff(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "账单ID") @PathVariable Long id,
            @RequestBody PaymentRecord record) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        apBillService.writeOff(userId, id, record.getAmount(), record);
        return Result.success("核销成功", null);
    }

    @GetMapping("/summary")
    @Operation(summary = "获取供应商应付汇总")
    public Result<List<ApBill>> getSupplierSummary(@RequestHeader("Authorization") String token) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        List<ApBill> result = apBillService.getSupplierSummary(userId);
        return Result.success(result);
    }

    @GetMapping("/overdue/count")
    @Operation(summary = "获取逾期账单数量")
    public Result<Map<String, Object>> countOverdue(@RequestHeader("Authorization") String token) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        long count = apBillService.countOverdue(userId);
        return Result.success(Map.of("count", count));
    }
}
