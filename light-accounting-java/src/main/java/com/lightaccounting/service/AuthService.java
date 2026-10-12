package com.lightaccounting.service;

import com.lightaccounting.dto.request.LoginRequest;
import com.lightaccounting.dto.request.RegisterRequest;
import com.lightaccounting.entity.User;
import java.util.Map;

public interface AuthService {

    /**
     * 用户登录
     */
    Map<String, Object> login(LoginRequest request, String ipAddress, String userAgent);

    /**
     * 用户注册
     */
    Map<String, Object> register(RegisterRequest request);

    /**
     * 获取当前用户信息
     */
    User getCurrentUser(Long userId);

    /**
     * 修改密码
     */
    void changePassword(Long userId, String oldPassword, String newPassword, String confirmPassword);

    /**
     * 检查用户名是否可用
     */
    boolean checkUsername(String username);
}
