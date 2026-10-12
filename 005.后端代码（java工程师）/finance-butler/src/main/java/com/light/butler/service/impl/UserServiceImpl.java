package com.light.butler.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.light.butler.dto.LoginRequest;
import com.light.butler.dto.LoginResponse;
import com.light.butler.dto.RegisterRequest;
import com.light.butler.entity.User;
import com.light.butler.mapper.UserMapper;
import com.light.butler.service.UserService;
import com.light.butler.utils.JwtUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * 用户 Service 实现
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public UserServiceImpl(PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public LoginResponse register(RegisterRequest request) {
        // 检查用户名是否已存在
        if (!isUsernameAvailable(request.getUsername())) {
            throw new RuntimeException("用户名已存在");
        }

        // 创建用户
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setUserType(request.getUserType() != null ? request.getUserType() : 1);
        user.setNickname(request.getNickname());
        user.setBusinessName(request.getBusinessName());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        user.setStatus(1);
        this.save(user);

        // 生成Token
        String token = jwtUtils.generateToken(user.getId(), user.getUsername());

        return buildLoginResponse(user, token);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        // 查找用户
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUsername, request.getUsername());
        User user = this.getOne(wrapper);

        if (user == null) {
            throw new RuntimeException("用户名或密码错误");
        }

        // 验证密码
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("用户名或密码错误");
        }

        // 检查状态
        if (user.getStatus() == 0) {
            throw new RuntimeException("账号已被禁用");
        }

        // 更新登录信息
        user.setLastLoginAt(java.time.LocalDateTime.now());
        this.updateById(user);

        // 生成Token
        String token = jwtUtils.generateToken(user.getId(), user.getUsername());

        return buildLoginResponse(user, token);
    }

    @Override
    public User getCurrentUser(Long userId) {
        return this.getById(userId);
    }

    @Override
    public boolean updateUser(User user) {
        return this.updateById(user);
    }

    @Override
    public boolean isUsernameAvailable(String username) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getUsername, username);
        return this.count(wrapper) == 0;
    }

    private LoginResponse buildLoginResponse(User user, String token) {
        return new LoginResponse(
                token,
                user.getId(),
                user.getUsername(),
                user.getNickname(),
                user.getUserType(),
                user.getBusinessName()
        );
    }
}
