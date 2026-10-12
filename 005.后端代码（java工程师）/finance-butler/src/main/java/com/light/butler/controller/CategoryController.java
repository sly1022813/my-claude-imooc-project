package com.light.butler.controller;

import com.light.butler.common.Result;
import com.light.butler.dto.CategoryRequest;
import com.light.butler.entity.Category;
import com.light.butler.service.CategoryService;
import com.light.butler.utils.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 分类 Controller
 */
@RestController
@RequestMapping("/categories")
@Tag(name = "分类管理", description = "收支分类相关接口")
@SecurityRequirement(name = "bearerAuth")
public class CategoryController {

    private final CategoryService categoryService;
    private final JwtUtils jwtUtils;

    @Autowired
    public CategoryController(CategoryService categoryService, JwtUtils jwtUtils) {
        this.categoryService = categoryService;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping
    @Operation(summary = "获取分类列表")
    public Result<List<Category>> listCategories(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "类型：1=支出, 2=收入") @RequestParam(required = false) Integer type) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        List<Category> list = categoryService.getList(userId, type);
        return Result.success(list);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取分类详情")
    public Result<Category> getCategory(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "分类ID") @PathVariable Long id) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        Category category = categoryService.getById(id);

        if (category == null) {
            return Result.error("分类不存在");
        }

        // 检查是否有权限访问（系统分类或自己的分类）
        if (!category.getUserId().equals(0L) && !category.getUserId().equals(userId)) {
            return Result.error("无权限访问该分类");
        }

        return Result.success(category);
    }

    @PostMapping
    @Operation(summary = "创建分类")
    public Result<Category> createCategory(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody CategoryRequest request) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));

        Category category = new Category();
        category.setUserId(userId);
        category.setType(request.getType());
        category.setName(request.getName());
        category.setIcon(request.getIcon());
        category.setColor(request.getColor());
        category.setIsSystem(0); // 用户自定义分类
        category.setSortOrder(0);
        category.setStatus(1);

        categoryService.save(category);
        return Result.success("创建成功", category);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新分类")
    public Result<Category> updateCategory(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "分类ID") @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));

        Category category = categoryService.getById(id);
        if (category == null) {
            return Result.error("分类不存在");
        }

        // 不能更新系统分类
        if (category.getIsSystem() == 1) {
            return Result.error("系统分类不能修改");
        }

        // 只能更新自己的分类
        if (!category.getUserId().equals(userId)) {
            return Result.error("无权限修改该分类");
        }

        category.setName(request.getName());
        if (request.getIcon() != null) {
            category.setIcon(request.getIcon());
        }
        if (request.getColor() != null) {
            category.setColor(request.getColor());
        }

        categoryService.updateById(category);
        return Result.success("更新成功", category);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除分类")
    public Result<Void> deleteCategory(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "分类ID") @PathVariable Long id) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));

        Category category = categoryService.getById(id);
        if (category == null) {
            return Result.error("分类不存在");
        }

        // 不能删除系统分类
        if (category.getIsSystem() == 1) {
            return Result.error("系统分类不能删除");
        }

        // 只能删除自己的分类
        if (!category.getUserId().equals(userId)) {
            return Result.error("无权限删除该分类");
        }

        categoryService.removeById(id);
        return Result.success("删除成功", null);
    }
}
