package com.lightaccounting.controller;

import com.lightaccounting.common.PageResult;
import com.lightaccounting.common.Result;
import com.lightaccounting.entity.Supplier;
import com.lightaccounting.entity.Transaction;
import com.lightaccounting.service.SupplierService;
import com.lightaccounting.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierService supplierService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public Result<PageResult<Supplier>> getList(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer pageSize,
            @RequestParam(required = false) String keyword) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        PageResult<Supplier> result = supplierService.getList(userId, page, pageSize, keyword);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<Supplier> getById(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        Supplier supplier = supplierService.getById(id, userId);
        return Result.success(supplier);
    }

    @GetMapping("/{id}/transactions")
    public Result<List<Transaction>> getTransactions(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        List<Transaction> transactions = supplierService.getTransactions(id, userId);
        return Result.success(transactions);
    }

    @PostMapping
    public Result<Supplier> create(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Supplier supplier) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        Supplier created = supplierService.create(userId, supplier);
        return Result.success(created, "创建成功");
    }

    @PutMapping("/{id}")
    public Result<Supplier> update(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @RequestBody Supplier supplier) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        Supplier updated = supplierService.update(id, userId, supplier);
        return Result.success(updated, "更新成功");
    }

    @DeleteMapping("/{id}")
    public Result<?> delete(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        supplierService.delete(id, userId);
        return Result.success("删除成功");
    }
}
