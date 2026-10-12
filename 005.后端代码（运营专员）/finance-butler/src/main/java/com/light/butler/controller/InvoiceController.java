package com.light.butler.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.light.butler.common.Result;
import com.light.butler.entity.Invoice;
import com.light.butler.service.InvoiceService;
import com.light.butler.utils.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

/**
 * 发票 Controller
 */
@RestController
@RequestMapping("/invoices")
@Tag(name = "发票管理", description = "发票相关接口")
@SecurityRequirement(name = "bearerAuth")
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final JwtUtils jwtUtils;

    public InvoiceController(InvoiceService invoiceService, JwtUtils jwtUtils) {
        this.invoiceService = invoiceService;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping
    @Operation(summary = "分页查询发票")
    public Result<IPage<Invoice>> listInvoices(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "10") int pageSize,
            @Parameter(description = "方向：1=销项, 2=进项") @RequestParam(required = false) Integer direction,
            @Parameter(description = "类型") @RequestParam(required = false) Integer type,
            @Parameter(description = "对方ID") @RequestParam(required = false) Long partyId) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        IPage<Invoice> result = invoiceService.pageInvoices(userId, page, pageSize, direction, type, partyId);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取发票详情")
    public Result<Invoice> getInvoice(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "发票ID") @PathVariable Long id) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        Invoice invoice = invoiceService.getInvoice(userId, id);
        return invoice != null ? Result.success(invoice) : Result.error("发票不存在");
    }

    @PostMapping
    @Operation(summary = "新增发票")
    public Result<Void> createInvoice(
            @RequestHeader("Authorization") String token,
            @RequestBody Invoice invoice) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        invoice.setUserId(userId);

        // 计算税额
        if (invoice.getAmount() != null && invoice.getTaxRate() != null) {
            BigDecimal taxAmount = invoice.getAmount()
                    .multiply(invoice.getTaxRate())
                    .divide(BigDecimal.valueOf(100), 2, BigDecimal.ROUND_HALF_UP);
            invoice.setTaxAmount(taxAmount);
            invoice.setTotalAmount(invoice.getAmount().add(taxAmount));
        }

        invoice.setStatus(2); // 已开具
        invoiceService.save(invoice);
        return Result.success("创建成功", null);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新发票")
    public Result<Void> updateInvoice(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "发票ID") @PathVariable Long id,
            @RequestBody Invoice invoice) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        invoice.setId(id);
        invoice.setUserId(userId);
        invoiceService.updateById(invoice);
        return Result.success("更新成功", null);
    }

    @GetMapping("/statistics")
    @Operation(summary = "发票统计")
    public Result<Map<String, Object>> getStatistics(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "年份") @RequestParam(required = false) Integer year,
            @Parameter(description = "月份") @RequestParam(required = false) Integer month) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        Map<String, Object> result = invoiceService.getStatistics(userId, year, month);
        return Result.success(result);
    }
}
