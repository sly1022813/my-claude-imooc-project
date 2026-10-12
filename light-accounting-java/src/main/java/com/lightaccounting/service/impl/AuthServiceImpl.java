package com.lightaccounting.service.impl;

import com.lightaccounting.common.ResultCode;
import com.lightaccounting.dto.request.LoginRequest;
import com.lightaccounting.dto.request.RegisterRequest;
import com.lightaccounting.entity.LoginLog;
import com.lightaccounting.entity.User;
import com.lightaccounting.mapper.LoginLogMapper;
import com.lightaccounting.mapper.UserMapper;
import com.lightaccounting.service.AuthService;
import com.lightaccounting.util.JwtUtil;
import com.lightaccounting.util.PasswordUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserMapper userMapper;
    private final LoginLogMapper loginLogMapper;
    private final JwtUtil jwtUtil;
    private final PasswordUtil passwordUtil;

    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final int LOGIN_LOCK_MINUTES = 30;

    @Override
    @Transactional
    public Map<String, Object> login(LoginRequest request, String ipAddress, String userAgent) {
        String username = request.getUsername();
        String password = request.getPassword();

        // 检查登录失败次数
        int recentFails = loginLogMapper.countRecentFails(username, LOGIN_LOCK_MINUTES);
        if (recentFails >= MAX_LOGIN_ATTEMPTS) {
            saveLoginLog(null, username, 0, "登录失败次数过多，账号被临时锁定", ipAddress, userAgent);
            throw new BusinessException(ResultCode.LOGIN_LOCKED, "登录失败次数过多，请 " + LOGIN_LOCK_MINUTES + " 分钟后再试");
        }

        // 查找用户
        User user = userMapper.findByUsername(username);
        if (user == null) {
            saveLoginLog(null, username, 0, "用户不存在", ipAddress, userAgent);
            throw new BusinessException(ResultCode.USERNAME_OR_PASSWORD_ERROR, "用户名或密码错误");
        }

        // 验证密码
        if (!passwordUtil.verifyPassword(password, user.getPasswordHash())) {
            saveLoginLog(user.getId(), username, 0, "密码错误", ipAddress, userAgent);
            throw new BusinessException(ResultCode.USERNAME_OR_PASSWORD_ERROR, "用户名或密码错误");
        }

        // 检查账号状态
        if (user.getStatus() == 0) {
            saveLoginLog(user.getId(), username, 0, "账号已被禁用", ipAddress, userAgent);
            throw new BusinessException(ResultCode.ACCOUNT_DISABLED, "账号已被禁用，请联系管理员");
        }

        // 更新最后登录信息
        userMapper.updateLastLogin(user.getId(), ipAddress);
        saveLoginLog(user.getId(), username, 1, null, ipAddress, userAgent);

        // 生成Token
        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getUserType());

        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("user", convertUser(user));

        return result;
    }

    @Override
    @Transactional
    public Map<String, Object> register(RegisterRequest request) {
        // 验证密码确认
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BusinessException(ResultCode.PASSWORD_NOT_MATCH, "两次输入的密码不一致");
        }

        // 检查用户名是否存在
        if (userMapper.existsByUsername(request.getUsername())) {
            throw new BusinessException(ResultCode.USERNAME_EXISTS, "该用户名已被注册");
        }

        // 创建用户
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordUtil.simpleHash(request.getPassword()));
        user.setUserType(request.getUserType() != null ? request.getUserType() : 1);
        user.setNickname(request.getNickname() != null ? request.getNickname() : request.getUsername());
        user.setPhone(request.getPhone());
        user.setStatus(1);
        userMapper.insert(user);

        // 生成Token
        String token = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getUserType());

        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("user", convertUser(user));

        return result;
    }

    @Override
    public User getCurrentUser(Long userId) {
        User user = userMapper.findById(userId);
        if (user == null) {
            throw new BusinessException(401, "用户不存在或已被删除");
        }
        return user;
    }

    @Override
    @Transactional
    public void changePassword(Long userId, String oldPassword, String newPassword, String confirmPassword) {
        // 验证新密码确认
        if (!newPassword.equals(confirmPassword)) {
            throw new BusinessException(ResultCode.PASSWORD_NOT_MATCH, "两次输入的新密码不一致");
        }

        // 验证新密码不能与旧密码相同
        if (oldPassword.equals(newPassword)) {
            throw new BusinessException(3004, "新密码不能与旧密码相同");
        }

        // 获取用户信息
        User user = userMapper.findById(userId);
        if (user == null) {
            throw new BusinessException(401, "用户不存在");
        }

        // 验证旧密码
        if (!passwordUtil.verifyPassword(oldPassword, user.getPasswordHash())) {
            throw new BusinessException(ResultCode.OLD_PASSWORD_ERROR, "原密码错误");
        }

        // 更新密码
        user.setPasswordHash(passwordUtil.simpleHash(newPassword));
        userMapper.updateById(user);
    }

    @Override
    public boolean checkUsername(String username) {
        return !userMapper.existsByUsername(username);
    }

    private void saveLoginLog(Long userId, String username, Integer status, String failReason, String ipAddress, String userAgent) {
        LoginLog log = new LoginLog();
        log.setUserId(userId);
        log.setUsername(username);
        log.setLoginStatus(status);
        log.setFailReason(failReason);
        log.setIpAddress(ipAddress);
        log.setUserAgent(userAgent);
        log.setLoginTime(LocalDateTime.now());
        loginLogMapper.insert(log);
    }

    private Map<String, Object> convertUser(User user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("username", user.getUsername());
        map.put("userType", user.getUserType());
        map.put("nickname", user.getNickname());
        map.put("phone", user.getPhone());
        map.put("email", user.getEmail());
        map.put("avatarUrl", user.getAvatarUrl());
        map.put("businessName", user.getBusinessName());
        return map;
    }
}
