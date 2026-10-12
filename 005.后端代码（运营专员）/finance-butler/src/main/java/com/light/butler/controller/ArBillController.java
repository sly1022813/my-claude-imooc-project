package com.light.butler.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.light.butler.common.Result;
import com.light.butler.entity.ArBill;
import com.light.butler.entity.CollectionRecord;
import com.light.butler.service.ArBillService;
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
 * 应收账款 Controller
 */
@RestController
@RequestMapping("/ar-bills")
@Tag(name = "应收账款", description = "应收账单相关接口")
@SecurityRequirement(name = "bearerAuth")
public class ArBillController {

    private final ArBillService arBillService;
    private final JwtUtils jwtUtils;

    public ArBillController(ArBillService arBillService, JwtUtils jwtUtils) {
        this.arBillService = arBillService;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping
    @Operation(summary = "分页查询应收账单")
    public Result<IPage<ArBill>> listArBills(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "10") int pageSize,
            @Parameter(description = "客户ID") @RequestParam(required = false) Long customerId,
            @Parameter(description = "状态") @RequestParam(required = false) Integer status) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        IPage<ArBill> result = arBillService.pageArBills(userId, page, pageSize, customerId, status);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取应收账单详情")
    public Result<ArBill> getArBill(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "账单ID") @PathVariable Long id) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        ArBill arBill = arBillService.getArBill(userId, id);
        return arBill != null ? Result.success(arBill) : Result.error("账单不存在");
    }

    @PostMapping
    @Operation(summary = "新增应收账单")
    public Result<Void> createArBill(
            @RequestHeader("Authorization") String token,
            @RequestBody ArBill arBill) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        arBill.setUserId(userId);
        arBill.setWrittenOffAmount(BigDecimal.ZERO);
        arBill.setPendingAmount(arBill.getAmount());
        arBill.setStatus(2); // 待收款
        arBillService.save(arBill);
        return Result.success("创建成功", null);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新应收账单")
    public Result<Void> updateArBill(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "账单ID") @PathVariable Long id,
            @RequestBody ArBill arBill) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        arBill.setId(id);
        arBill.setUserId(userId);
        arBillService.updateById(arBill);
        return Result.success("更新成功", null);
    }

    @PostMapping("/{id}/write-off")
    @Operation(summary = "核销应收账单（回款）")
    public Result<Void> writeOff(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "账单ID") @PathVariable Long id,
            @RequestBody CollectionRecord record) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        arBillService.writeOff(userId, id, record.getAmount(), record);
        return Result.success("核销成功", null);
    }

    @GetMapping("/summary")
    @Operation(summary = "获取客户应收汇总")
    public Result<List<ArBill>> getCustomerSummary(@RequestHeader("Authorization") String token) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        List<ArBill> result = arBillService.getCustomerSummary(userId);
        return Result.success(result);
    }

    @GetMapping("/overdue/count")
    @Operation(summary = "获取逾期账单数量")
    public Result<Map<String, Object>> countOverdue(@RequestHeader("Authorization") String token) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        long count = arBillService.countOverdue(userId);
        return Result.success(Map.of("count", count));
    }
}
