package com.light.accounting.service.impl;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.light.accounting.entity.User;
import com.light.accounting.mapper.UserMapper;
import com.light.accounting.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * 用户 Service 实现
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    private final PasswordEncoder passwordEncoder;

    @Override
    public User findByUsername(String username) {
        if (StrUtil.isBlank(username)) {
            return null;
        }
        return getOne(new LambdaQueryWrapper<User>()
                .eq(User::getUsername, username));
    }

    @Override
    public boolean existsByUsername(String username) {
        return count(new LambdaQueryWrapper<User>()
                .eq(User::getUsername, username)) > 0;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public User register(User user) {
        // 密码加密
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        // 设置默认值
        user.setUserType(user.getUserType() != null ? user.getUserType() : 1);
        user.setStatus(1);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        // 保存用户
        save(user);
        return user;
    }

    @Override
    public void updateLoginInfo(Long userId, String loginIp) {
        User user = new User();
        user.setId(userId);
        user.setLastLoginAt(LocalDateTime.now());
        user.setLastLoginIp(loginIp);
        updateById(user);
    }
}
