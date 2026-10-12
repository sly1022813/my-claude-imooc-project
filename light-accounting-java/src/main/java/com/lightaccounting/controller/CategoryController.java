package com.lightaccounting.controller;

import com.lightaccounting.common.Result;
import com.lightaccounting.dto.request.CreateCategoryRequest;
import com.lightaccounting.dto.request.UpdateCategoryRequest;
import com.lightaccounting.entity.Category;
import com.lightaccounting.service.CategoryService;
import com.lightaccounting.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public Result<List<Category>> getList(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) Integer type) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        List<Category> list = categoryService.getList(userId, type);
        return Result.success(list);
    }

    @GetMapping("/{id}")
    public Result<Category> getById(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        Category category = categoryService.getById(id, userId);
        return Result.success(category);
    }

    @PostMapping
    public Result<Category> create(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody CreateCategoryRequest request) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        Category category = new Category();
        category.setType(request.getType());
        category.setName(request.getName());
        category.setIcon(request.getIcon());
        category.setColor(request.getColor());
        category.setSortOrder(request.getSortOrder() != null ? request.getSortOrder() : 0);
        Category created = categoryService.create(userId, category);
        return Result.success(created, "创建成功");
    }

    @PutMapping("/{id}")
    public Result<Category> update(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @Valid @RequestBody UpdateCategoryRequest request) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        Category category = new Category();
        category.setName(request.getName());
        category.setIcon(request.getIcon());
        category.setColor(request.getColor());
        category.setSortOrder(request.getSortOrder());
        category.setStatus(request.getStatus());
        Category updated = categoryService.update(id, userId, category);
        return Result.success(updated, "更新成功");
    }

    @DeleteMapping("/{id}")
    public Result<?> delete(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        categoryService.delete(id, userId);
        return Result.success("删除成功");
    }
}
