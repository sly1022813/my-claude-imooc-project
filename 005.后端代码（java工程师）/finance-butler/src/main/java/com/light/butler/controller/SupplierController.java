package com.light.butler.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.light.butler.common.Result;
import com.light.butler.entity.Supplier;
import com.light.butler.entity.Transaction;
import com.light.butler.service.SupplierService;
import com.light.butler.service.TransactionService;
import com.light.butler.utils.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 供应商 Controller
 */
@RestController
@RequestMapping("/suppliers")
@Tag(name = "供应商管理", description = "供应商档案相关接口")
@SecurityRequirement(name = "bearerAuth")
public class SupplierController {

    private final SupplierService supplierService;
    private final TransactionService transactionService;
    private final JwtUtils jwtUtils;

    public SupplierController(SupplierService supplierService, TransactionService transactionService, JwtUtils jwtUtils) {
        this.supplierService = supplierService;
        this.transactionService = transactionService;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping
    @Operation(summary = "分页查询供应商")
    public Result<IPage<Supplier>> listSuppliers(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "10") int pageSize,
            @Parameter(description = "关键词") @RequestParam(required = false) String keyword,
            @Parameter(description = "状态") @RequestParam(required = false) Integer status,
            @Parameter(description = "是否有欠款") @RequestParam(required = false) Boolean hasOutstanding) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        IPage<Supplier> result = supplierService.pageSuppliers(userId, page, pageSize, keyword, status, hasOutstanding);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取供应商详情")
    public Result<Supplier> getSupplier(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "供应商ID") @PathVariable Long id) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        Supplier supplier = supplierService.getSupplier(userId, id);
        return supplier != null ? Result.success(supplier) : Result.error("供应商不存在");
    }

    @GetMapping("/{id}/transactions")
    @Operation(summary = "获取供应商交易明细")
    public Result<Map<String, Object>> getSupplierTransactions(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "供应商ID") @PathVariable Long id,
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "20") int pageSize) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));

        Supplier supplier = supplierService.getSupplier(userId, id);
        if (supplier == null) {
            return Result.error("供应商不存在");
        }

        IPage<Transaction> transactions = transactionService.pageTransactions(
                userId, page, pageSize, 1, null, null, null, null, null);

        Map<String, Object> result = new HashMap<>();
        result.put("supplier", supplier);
        result.put("list", transactions.getRecords());
        result.put("pagination", Map.of(
                "total", transactions.getTotal(),
                "page", transactions.getCurrent(),
                "pageSize", transactions.getSize(),
                "totalPages", transactions.getPages()
        ));

        return Result.success(result);
    }

    @PostMapping
    @Operation(summary = "新增供应商")
    public Result<Void> createSupplier(
            @RequestHeader("Authorization") String token,
            @RequestBody Supplier supplier) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        supplier.setUserId(userId);
        supplier.setStatus(1);
        supplierService.save(supplier);
        return Result.success("创建成功", null);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新供应商")
    public Result<Void> updateSupplier(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "供应商ID") @PathVariable Long id,
            @RequestBody Supplier supplier) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        supplier.setId(id);
        supplier.setUserId(userId);
        supplierService.updateById(supplier);
        return Result.success("更新成功", null);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除供应商")
    public Result<Void> deleteSupplier(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "供应商ID") @PathVariable Long id) {
        supplierService.removeById(id);
        return Result.success("删除成功", null);
    }
}
