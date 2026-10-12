package com.lightaccounting.service;

import com.lightaccounting.common.PageResult;
import com.lightaccounting.entity.Account;
import java.util.List;

public interface AccountService {
    PageResult<Account> getList(Long userId);
    Account getById(Long id, Long userId);
    Account create(Long userId, Account account);
    Account update(Long id, Long userId, Account account);
    void delete(Long id, Long userId);
}
