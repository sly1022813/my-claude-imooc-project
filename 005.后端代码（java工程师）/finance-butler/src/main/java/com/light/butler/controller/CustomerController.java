package com.light.butler.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.light.butler.common.Result;
import com.light.butler.entity.Customer;
import com.light.butler.entity.Transaction;
import com.light.butler.service.CustomerService;
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
 * 客户 Controller
 */
@RestController
@RequestMapping("/customers")
@Tag(name = "客户管理", description = "客户档案相关接口")
@SecurityRequirement(name = "bearerAuth")
public class CustomerController {

    private final CustomerService customerService;
    private final TransactionService transactionService;
    private final JwtUtils jwtUtils;

    public CustomerController(CustomerService customerService, TransactionService transactionService, JwtUtils jwtUtils) {
        this.customerService = customerService;
        this.transactionService = transactionService;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping
    @Operation(summary = "分页查询客户")
    public Result<IPage<Customer>> listCustomers(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "10") int pageSize,
            @Parameter(description = "关键词") @RequestParam(required = false) String keyword,
            @Parameter(description = "状态") @RequestParam(required = false) Integer status,
            @Parameter(description = "是否有欠款") @RequestParam(required = false) Boolean hasOutstanding) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        IPage<Customer> result = customerService.pageCustomers(userId, page, pageSize, keyword, status, hasOutstanding);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取客户详情")
    public Result<Customer> getCustomer(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "客户ID") @PathVariable Long id) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        Customer customer = customerService.getCustomer(userId, id);
        return customer != null ? Result.success(customer) : Result.error("客户不存在");
    }

    @GetMapping("/{id}/transactions")
    @Operation(summary = "获取客户交易明细")
    public Result<Map<String, Object>> getCustomerTransactions(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "客户ID") @PathVariable Long id,
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "20") int pageSize) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));

        Customer customer = customerService.getCustomer(userId, id);
        if (customer == null) {
            return Result.error("客户不存在");
        }

        IPage<Transaction> transactions = transactionService.pageTransactions(
                userId, page, pageSize, 2, null, null, null, null, null);

        Map<String, Object> result = new HashMap<>();
        result.put("customer", customer);
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
    @Operation(summary = "新增客户")
    public Result<Void> createCustomer(
            @RequestHeader("Authorization") String token,
            @RequestBody Customer customer) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        customer.setUserId(userId);
        customer.setStatus(1);
        customerService.save(customer);
        return Result.success("创建成功", null);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新客户")
    public Result<Void> updateCustomer(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "客户ID") @PathVariable Long id,
            @RequestBody Customer customer) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        customer.setId(id);
        customer.setUserId(userId);
        customerService.updateById(customer);
        return Result.success("更新成功", null);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除客户")
    public Result<Void> deleteCustomer(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "客户ID") @PathVariable Long id) {
        customerService.removeById(id);
        return Result.success("删除成功", null);
    }
}
