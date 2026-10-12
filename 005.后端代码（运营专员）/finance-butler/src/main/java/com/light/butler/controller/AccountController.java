package com.light.butler.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.light.butler.common.Result;
import com.light.butler.dto.AccountRequest;
import com.light.butler.dto.UserProfileRequest;
import com.light.butler.entity.Account;
import com.light.butler.entity.User;
import com.light.butler.service.AccountService;
import com.light.butler.utils.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 账户 Controller
 */
@RestController
@RequestMapping("/accounts")
@Tag(name = "账户管理", description = "账户和用户资料相关接口")
@SecurityRequirement(name = "bearerAuth")
public class AccountController {

    private final AccountService accountService;
    private final JwtUtils jwtUtils;

    @Autowired
    public AccountController(AccountService accountService, JwtUtils jwtUtils) {
        this.accountService = accountService;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping
    @Operation(summary = "获取账户列表")
    public Result<IPage<Account>> listAccounts(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "10") int pageSize,
            @Parameter(description = "关键词") @RequestParam(required = false) String keyword,
            @Parameter(description = "状态") @RequestParam(required = false) Integer status) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        IPage<Account> result = accountService.pageAccounts(userId, page, pageSize, keyword, status);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取账户详情")
    public Result<Account> getAccount(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "账户ID") @PathVariable Long id) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        Account account = accountService.getAccount(userId, id);
        if (account == null) {
            return Result.error("账户不存在");
        }
        return Result.success(account);
    }

    @PostMapping
    @Operation(summary = "创建账户")
    public Result<Account> createAccount(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody AccountRequest request) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        Account account = accountService.createAccount(userId, request);
        return Result.success("创建成功", account);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新账户")
    public Result<Account> updateAccount(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "账户ID") @PathVariable Long id,
            @Valid @RequestBody AccountRequest request) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        Account account = accountService.updateAccount(userId, id, request);
        if (account == null) {
            return Result.error("账户不存在");
        }
        return Result.success("更新成功", account);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "删除账户")
    public Result<Void> deleteAccount(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "账户ID") @PathVariable Long id) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        boolean success = accountService.deleteAccount(userId, id);
        if (!success) {
            return Result.error("账户不存在");
        }
        return Result.success("删除成功", null);
    }

    @GetMapping("/profile")
    @Operation(summary = "获取用户资料")
    public Result<User> getProfile(
            @RequestHeader("Authorization") String token) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        User user = accountService.getUserProfile(userId);
        if (user == null) {
            return Result.error("用户不存在");
        }
        // 清除敏感字段
        user.setPasswordHash(null);
        return Result.success(user);
    }

    @PutMapping("/profile")
    @Operation(summary = "更新用户资料")
    public Result<Void> updateProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody UserProfileRequest request) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        boolean success = accountService.updateUserProfile(userId, request);
        if (!success) {
            return Result.error("更新失败");
        }
        return Result.success("更新成功", null);
    }

    @PutMapping("/password")
    @Operation(summary = "修改密码")
    public Result<Void> changePassword(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody com.light.butler.dto.ChangePasswordRequest request) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));

        // 验证新密码确认
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return Result.badRequest("两次输入的新密码不一致");
        }

        // 验证新密码不能与旧密码相同
        if (request.getOldPassword().equals(request.getNewPassword())) {
            return Result.badRequest("新密码不能与旧密码相同");
        }

        boolean success = accountService.changePassword(userId, request.getOldPassword(), request.getNewPassword());
        if (!success) {
            return Result.badRequest("原密码错误");
        }
        return Result.success("密码修改成功", null);
    }

    @PostMapping("/avatar")
    @Operation(summary = "上传头像")
    public Result<Void> uploadAvatar(
            @RequestHeader("Authorization") String token,
            @RequestBody java.util.Map<String, String> body) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        String avatarUrl = body.get("avatarUrl");
        if (avatarUrl == null || avatarUrl.isEmpty()) {
            return Result.badRequest("头像URL不能为空");
        }
        boolean success = accountService.uploadAvatar(userId, avatarUrl);
        if (!success) {
            return Result.error("上传失败");
        }
        return Result.success("头像上传成功", null);
    }
}
