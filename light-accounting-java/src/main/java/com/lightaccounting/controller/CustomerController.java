package com.lightaccounting.controller;

import com.lightaccounting.common.PageResult;
import com.lightaccounting.common.Result;
import com.lightaccounting.entity.Customer;
import com.lightaccounting.entity.Transaction;
import com.lightaccounting.service.CustomerService;
import com.lightaccounting.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public Result<PageResult<Customer>> getList(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer pageSize,
            @RequestParam(required = false) String keyword) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        PageResult<Customer> result = customerService.getList(userId, page, pageSize, keyword);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<Customer> getById(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        Customer customer = customerService.getById(id, userId);
        return Result.success(customer);
    }

    @GetMapping("/{id}/transactions")
    public Result<List<Transaction>> getTransactions(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        List<Transaction> transactions = customerService.getTransactions(id, userId);
        return Result.success(transactions);
    }

    @PostMapping
    public Result<Customer> create(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Customer customer) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        Customer created = customerService.create(userId, customer);
        return Result.success(created, "创建成功");
    }

    @PutMapping("/{id}")
    public Result<Customer> update(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @RequestBody Customer customer) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        Customer updated = customerService.update(id, userId, customer);
        return Result.success(updated, "更新成功");
    }

    @DeleteMapping("/{id}")
    public Result<?> delete(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        customerService.delete(id, userId);
        return Result.success("删除成功");
    }
}
