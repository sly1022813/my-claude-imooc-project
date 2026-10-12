package com.light.butler.controller;

import com.light.butler.common.Result;
import com.light.butler.entity.User;
import com.light.butler.service.UserService;
import com.light.butler.utils.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

/**
 * 用户 Controller
 */
@RestController
@RequestMapping("/user")
@Tag(name = "用户管理", description = "用户信息相关接口")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;
    private final JwtUtils jwtUtils;

    public UserController(UserService userService, JwtUtils jwtUtils) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping("/info")
    @Operation(summary = "获取当前用户信息")
    public Result<User> getUserInfo(@RequestHeader("Authorization") String token) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        User user = userService.getCurrentUser(userId);
        if (user != null) {
            user.setPasswordHash(null); // 不返回密码
        }
        return Result.success(user);
    }

    @PutMapping("/info")
    @Operation(summary = "更新用户信息")
    public Result<Void> updateUserInfo(
            @RequestHeader("Authorization") String token,
            @RequestBody User user) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        user.setId(userId);
        user.setPasswordHash(null); // 不允许通过此接口修改密码
        boolean success = userService.updateUser(user);
        return success ? Result.success("更新成功", null) : Result.error("更新失败");
    }
}
