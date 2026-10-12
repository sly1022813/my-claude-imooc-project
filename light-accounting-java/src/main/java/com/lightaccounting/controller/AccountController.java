package com.lightaccounting.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.lightaccounting.common.PageResult;
import com.lightaccounting.common.Result;
import com.lightaccounting.entity.Account;
import com.lightaccounting.entity.Transaction;
import com.lightaccounting.entity.User;
import com.lightaccounting.mapper.TransactionMapper;
import com.lightaccounting.mapper.UserMapper;
import com.lightaccounting.service.AccountService;
import com.lightaccounting.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;
    private final TransactionMapper transactionMapper;

    /**
     * 获取用户个人信息
     * GET /api/accounts/profile
     */
    @GetMapping("/profile")
    public Result<Map<String, Object>> getProfile(@RequestHeader("Authorization") String authHeader) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        User user = userMapper.findById(userId);

        if (user == null) {
            return Result.error(404, "用户不存在");
        }

        // 获取统计信息
        QueryWrapper<Transaction> wrapper = new QueryWrapper<>();
        wrapper.eq("user_id", userId);
        Long totalRecords = transactionMapper.selectCount(wrapper);
        wrapper.select("DISTINCT DATE(date) as date");
        // 简化统计
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("username", user.getUsername());
        profile.put("nickname", user.getNickname());
        profile.put("phone", user.getPhone());
        profile.put("email", user.getEmail());
        profile.put("avatarUrl", user.getAvatarUrl());
        profile.put("userType", user.getUserType());
        profile.put("businessName", user.getBusinessName());
        profile.put("createdAt", user.getCreatedAt());
        profile.put("recordDays", totalRecords);
        profile.put("totalRecords", totalRecords);

        return Result.success(profile);
    }

    /**
     * 更新用户个人信息
     * PUT /api/accounts/profile
     */
    @PutMapping("/profile")
    public Result<?> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> params) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        User user = userMapper.findById(userId);

        if (user == null) {
            return Result.error(404, "用户不存在");
        }

        if (params.get("nickname") != null) {
            user.setNickname(params.get("nickname").toString());
        }
        if (params.get("phone") != null) {
            user.setPhone(params.get("phone").toString());
        }
        if (params.get("email") != null) {
            user.setEmail(params.get("email").toString());
        }
        if (params.get("businessName") != null) {
            user.setBusinessName(params.get("businessName").toString());
        }

        userMapper.updateById(user);
        return Result.success("更新成功");
    }

    /**
     * 修改密码
     * PUT /api/accounts/password
     */
    @PutMapping("/password")
    public Result<?> changePassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> params) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));

        String oldPassword = params.get("oldPassword");
        String newPassword = params.get("newPassword");

        if (oldPassword == null || newPassword == null) {
            return Result.error(400, "请填写完整的密码信息");
        }

        if (newPassword.length() < 6) {
            return Result.error(400, "新密码长度不能少于6位");
        }

        User user = userMapper.findById(userId);
        if (user == null) {
            return Result.error(404, "用户不存在");
        }

        // 验证旧密码 (简化版，与Node.js兼容)
        String oldHash = com.lightaccounting.util.PasswordUtil.simpleHashStatic(oldPassword);
        if (!oldHash.equals(user.getPasswordHash())) {
            return Result.error(400, "原密码错误");
        }

        // 更新新密码
        String newHash = com.lightaccounting.util.PasswordUtil.simpleHashStatic(newPassword);
        user.setPasswordHash(newHash);
        userMapper.updateById(user);

        return Result.success("密码修改成功");
    }

    /**
     * 上传头像
     * POST /api/accounts/avatar
     */
    @PostMapping("/avatar")
    public Result<Map<String, String>> uploadAvatar(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));

        String avatarUrl = body.get("avatarUrl");
        if (avatarUrl == null || avatarUrl.isEmpty()) {
            return Result.error(400, "请提供头像URL");
        }

        User user = userMapper.findById(userId);
        if (user == null) {
            return Result.error(404, "用户不存在");
        }

        user.setAvatarUrl(avatarUrl);
        userMapper.updateById(user);

        Map<String, String> result = new HashMap<>();
        result.put("avatarUrl", avatarUrl);
        return Result.success(result, "头像上传成功");
    }

    @GetMapping
    public Result<PageResult<Account>> getList(@RequestHeader("Authorization") String authHeader) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        PageResult<Account> result = accountService.getList(userId);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    public Result<Account> getById(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        Account account = accountService.getById(id, userId);
        return Result.success(account);
    }

    @PostMapping
    public Result<Account> create(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Account account) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        Account created = accountService.create(userId, account);
        return Result.success(created, "创建成功");
    }

    @PutMapping("/{id}")
    public Result<Account> update(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @RequestBody Account account) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        Account updated = accountService.update(id, userId, account);
        return Result.success(updated, "更新成功");
    }

    @DeleteMapping("/{id}")
    public Result<?> delete(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.replace("Bearer ", ""));
        accountService.delete(id, userId);
        return Result.success("删除成功");
    }
}
