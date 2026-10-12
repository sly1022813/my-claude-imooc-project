package com.light.butler.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.light.butler.entity.Account;
import com.light.butler.entity.User;
import com.light.butler.mapper.AccountMapper;
import com.light.butler.mapper.UserMapper;
import com.light.butler.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * 账户 Service 实现
 */
@Service
public class AccountServiceImpl extends ServiceImpl<AccountMapper, Account> implements AccountService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public IPage<Account> pageAccounts(Long userId, int page, int pageSize, String keyword, Integer status) {
        Page<Account> pageParam = new Page<>(page, pageSize);

        LambdaQueryWrapper<Account> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Account::getUserId, userId);

        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(Account::getName, keyword)
                           .or()
                           .like(Account::getBankName, keyword));
        }

        if (status != null) {
            wrapper.eq(Account::getStatus, status);
        }

        wrapper.orderByDesc(Account::getCreatedAt);

        return this.page(pageParam, wrapper);
    }

    @Override
    public Account getAccount(Long userId, Long id) {
        Account account = this.getById(id);
        if (account != null && account.getUserId().equals(userId)) {
            return account;
        }
        return null;
    }

    @Override
    public Account createAccount(Long userId, com.light.butler.dto.AccountRequest request) {
        Account account = new Account();
        account.setUserId(userId);
        account.setName(request.getName());
        account.setType(request.getType() != null ? request.getType() : 1);
        account.setBalance(request.getBalance() != null ? request.getBalance() : java.math.BigDecimal.ZERO);
        account.setCardNo(request.getCardNo());
        account.setBankName(request.getBankName());
        account.setRemark(request.getRemark());
        account.setStatus(1);

        this.save(account);
        return account;
    }

    @Override
    public Account updateAccount(Long userId, Long id, com.light.butler.dto.AccountRequest request) {
        Account account = this.getAccount(userId, id);
        if (account == null) {
            return null;
        }

        if (StringUtils.hasText(request.getName())) account.setName(request.getName());
        if (request.getType() != null) account.setType(request.getType());
        if (request.getBalance() != null) account.setBalance(request.getBalance());
        if (request.getCardNo() != null) account.setCardNo(request.getCardNo());
        if (request.getBankName() != null) account.setBankName(request.getBankName());
        if (request.getRemark() != null) account.setRemark(request.getRemark());

        this.updateById(account);
        return account;
    }

    @Override
    public boolean deleteAccount(Long userId, Long id) {
        Account account = this.getAccount(userId, id);
        if (account == null) {
            return false;
        }
        return this.removeById(id);
    }

    @Override
    public User getUserProfile(Long userId) {
        return userMapper.selectById(userId);
    }

    @Override
    public boolean updateUserProfile(Long userId, com.light.butler.dto.UserProfileRequest request) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            return false;
        }

        if (StringUtils.hasText(request.getNickname())) user.setNickname(request.getNickname());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getEmail() != null) user.setEmail(request.getEmail());
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());
        if (request.getBusinessName() != null) user.setBusinessName(request.getBusinessName());

        return userMapper.updateById(user) > 0;
    }

    @Override
    public boolean changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            return false;
        }

        // 验证旧密码
        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            return false;
        }

        // 更新新密码
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        return userMapper.updateById(user) > 0;
    }

    @Override
    public boolean uploadAvatar(Long userId, String avatarUrl) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            return false;
        }

        user.setAvatarUrl(avatarUrl);
        return userMapper.updateById(user) > 0;
    }
}
