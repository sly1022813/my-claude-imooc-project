package com.lightaccounting.controller;

import com.lightaccounting.common.Result;
import com.lightaccounting.dto.request.LoginRequest;
import com.lightaccounting.dto.request.RegisterRequest;
import com.lightaccounting.entity.User;
import com.lightaccounting.service.AuthService;
import com.lightaccounting.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public Result<Map<String, Object>> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String ipAddress = getClientIp(httpRequest);
        String userAgent = httpRequest.getHeader("User-Agent");
        Map<String, Object> result = authService.login(request, ipAddress, userAgent);
        return Result.success(result, "登录成功");
    }

    @PostMapping("/register")
    public Result<Map<String, Object>> register(@Valid @RequestBody RegisterRequest request) {
        Map<String, Object> result = authService.register(request);
        return Result.success(result, "注册成功");
    }

    @GetMapping("/me")
    public Result<User> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        User user = authService.getCurrentUser(userId);
        return Result.success(user);
    }

    @PostMapping("/change-password")
    public Result<?> changePassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> params) {
        Long userId = extractUserId(authHeader);
        String oldPassword = params.get("oldPassword");
        String newPassword = params.get("newPassword");
        String confirmPassword = params.get("confirmPassword");
        authService.changePassword(userId, oldPassword, newPassword, confirmPassword);
        return Result.success("密码修改成功");
    }

    @GetMapping("/check-username")
    public Result<Map<String, Object>> checkUsername(@RequestParam String username) {
        boolean available = authService.checkUsername(username);
        Map<String, Object> result = Map.of("available", available);
        return Result.success(result, available ? "用户名可用" : "用户名已被占用");
    }

    private Long extractUserId(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        return jwtUtil.getUserIdFromToken(token);
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
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
