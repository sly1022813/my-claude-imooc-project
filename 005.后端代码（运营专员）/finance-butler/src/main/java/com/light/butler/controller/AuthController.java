package com.light.butler.controller;

import com.light.butler.common.Result;
import com.light.butler.dto.*;
import com.light.butler.entity.LoginLog;
import com.light.butler.entity.User;
import com.light.butler.mapper.LoginLogMapper;
import com.light.butler.service.UserService;
import com.light.butler.utils.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 * 认证 Controller
 */
@RestController
@RequestMapping("/auth")
@Tag(name = "认证管理", description = "用户注册、登录相关接口")
public class AuthController {

    private final UserService userService;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;
    private final LoginLogMapper loginLogMapper;

    @Autowired
    public AuthController(UserService userService, JwtUtils jwtUtils,
                         PasswordEncoder passwordEncoder, LoginLogMapper loginLogMapper) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
        this.loginLogMapper = loginLogMapper;
    }

    @PostMapping("/register")
    @Operation(summary = "用户注册")
    public Result<LoginResponse> register(@Valid @RequestBody RegisterRequest request,
                                          HttpServletRequest httpRequest) {
        try {
            // 检查用户名是否存在
            if (userService.isUsernameAvailable(request.getUsername())) {
                return Result.badRequest("用户名已被注册");
            }

            LoginResponse response = userService.register(request);

            // 记录注册日志
            recordLoginLog(null, request.getUsername(), 1, "注册成功",
                    getClientIp(httpRequest), httpRequest.getHeader("User-Agent"));

            return Result.success("注册成功", response);
        } catch (RuntimeException e) {
            recordLoginLog(null, request.getUsername(), 0, e.getMessage(),
                    getClientIp(httpRequest), httpRequest.getHeader("User-Agent"));
            return Result.badRequest(e.getMessage());
        }
    }

    @PostMapping("/login")
    @Operation(summary = "用户登录")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest request,
                                       HttpServletRequest httpRequest) {
        String ip = getClientIp(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");

        try {
            LoginResponse response = userService.login(request);

            // 记录登录成功
            recordLoginLog(response.getUserId(), request.getUsername(), 1, "登录成功", ip, userAgent);

            return Result.success("登录成功", response);
        } catch (RuntimeException e) {
            // 记录登录失败
            String failReason = e.getMessage();
            recordLoginLog(null, request.getUsername(), 0, failReason, ip, userAgent);
            return Result.unauthorized(e.getMessage());
        }
    }

    @GetMapping("/check-username")
    @Operation(summary = "检查用户名是否可用")
    public Result<CheckUsernameResponse> checkUsername(
            @Parameter(description = "用户名") @RequestParam String username) {
        boolean available = userService.isUsernameAvailable(username);
        return Result.success(new CheckUsernameResponse(available));
    }

    @GetMapping("/me")
    @Operation(summary = "获取当前用户信息")
    public Result<User> getCurrentUser(
            @Parameter(description = "Authorization") @RequestHeader("Authorization") String token) {
        try {
            Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
            User user = userService.getCurrentUser(userId);
            if (user == null) {
                return Result.unauthorized("用户不存在或已删除");
            }
            // 清除敏感字段
            user.setPasswordHash(null);
            return Result.success(user);
        } catch (Exception e) {
            return Result.unauthorized("无效的Token");
        }
    }

    @PostMapping("/change-password")
    @Operation(summary = "修改密码")
    public Result<Void> changePassword(
            @Parameter(description = "Authorization") @RequestHeader("Authorization") String token,
            @Valid @RequestBody ChangePasswordRequest request) {
        try {
            Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));

            // 验证新密码确认
            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                return Result.badRequest("两次输入的新密码不一致");
            }

            // 验证新密码不能与旧密码相同
            if (request.getOldPassword().equals(request.getNewPassword())) {
                return Result.badRequest("新密码不能与旧密码相同");
            }

            // 获取用户
            User user = userService.getCurrentUser(userId);
            if (user == null) {
                return Result.unauthorized("用户不存在");
            }

            // 验证旧密码
            if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
                return Result.badRequest("原密码错误");
            }

            // 更新密码
            user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
            userService.updateUser(user);

            return Result.success("密码修改成功", null);
        } catch (Exception e) {
            return Result.unauthorized("无效的Token");
        }
    }

    private void recordLoginLog(Long userId, String username, int status, String failReason,
                               String ipAddress, String userAgent) {
        try {
            LoginLog log = new LoginLog();
            log.setUserId(userId);
            log.setUsername(username);
            log.setLoginStatus(status);
            log.setFailReason(status == 0 ? failReason : null);
            log.setIpAddress(ipAddress);
            log.setUserAgent(userAgent);
            log.setLoginTime(java.time.LocalDateTime.now());
            loginLogMapper.insert(log);
        } catch (Exception ignored) {
            // 日志记录失败不影响主流程
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        // 多级代理时取第一个IP
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip != null ? ip : "127.0.0.1";
    }
}
