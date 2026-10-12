package com.light.butler.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.light.butler.dto.LoginRequest;
import com.light.butler.dto.LoginResponse;
import com.light.butler.dto.RegisterRequest;
import com.light.butler.entity.User;

/**
 * 用户 Service
 */
public interface UserService extends IService<User> {

    /**
     * 注册
     */
    LoginResponse register(RegisterRequest request);

    /**
     * 登录
     */
    LoginResponse login(LoginRequest request);

    /**
     * 获取当前用户信息
     */
    User getCurrentUser(Long userId);

    /**
     * 更新用户信息
     */
    boolean updateUser(User user);

    /**
     * 检查用户名是否可用
     */
    boolean isUsernameAvailable(String username);
}
