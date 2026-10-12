package com.lightaccounting.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.lightaccounting.common.PageResult;
import com.lightaccounting.entity.Account;
import com.lightaccounting.mapper.AccountMapper;
import com.lightaccounting.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {

    private final AccountMapper accountMapper;

    @Override
    public PageResult<Account> getList(Long userId) {
        QueryWrapper<Account> wrapper = new QueryWrapper<>();
        wrapper.eq("user_id", userId);
        wrapper.orderByDesc("created_at");
        List<Account> list = accountMapper.selectList(wrapper);
        return PageResult.of(list, (long) list.size(), 1, list.size());
    }

    @Override
    public Account getById(Long id, Long userId) {
        Account account = accountMapper.findById(id, userId);
        if (account == null) {
            throw new BusinessException(404, "账户不存在");
        }
        return account;
    }

    @Override
    @Transactional
    public Account create(Long userId, Account account) {
        account.setUserId(userId);
        account.setStatus(1);
        accountMapper.insert(account);
        return account;
    }

    @Override
    @Transactional
    public Account update(Long id, Long userId, Account account) {
        Account existing = getById(id, userId);

        if (account.getName() != null) existing.setName(account.getName());
        if (account.getType() != null) existing.setType(account.getType());
        if (account.getBalance() != null) existing.setBalance(account.getBalance());
        if (account.getRemark() != null) existing.setRemark(account.getRemark());
        if (account.getStatus() != null) existing.setStatus(account.getStatus());

        accountMapper.updateById(existing);
        return existing;
    }

    @Override
    @Transactional
    public void delete(Long id, Long userId) {
        getById(id, userId);
        accountMapper.deleteById(id);
    }
}
