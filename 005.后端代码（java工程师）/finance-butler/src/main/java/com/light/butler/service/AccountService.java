package com.light.butler.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.light.butler.entity.Account;
import com.light.butler.dto.AccountRequest;
import com.light.butler.dto.UserProfileRequest;
import com.light.butler.entity.User;

/**
 * 账户 Service
 */
public interface AccountService extends IService<Account> {

    /**
     * 分页查询账户
     */
    IPage<Account> pageAccounts(Long userId, int page, int pageSize, String keyword, Integer status);

    /**
     * 获取账户详情
     */
    Account getAccount(Long userId, Long id);

    /**
     * 创建账户
     */
    Account createAccount(Long userId, AccountRequest request);

    /**
     * 更新账户
     */
    Account updateAccount(Long userId, Long id, AccountRequest request);

    /**
     * 删除账户
     */
    boolean deleteAccount(Long userId, Long id);

    /**
     * 获取用户资料
     */
    User getUserProfile(Long userId);

    /**
     * 更新用户资料
     */
    boolean updateUserProfile(Long userId, UserProfileRequest request);

    /**
     * 修改密码
     */
    boolean changePassword(Long userId, String oldPassword, String newPassword);

    /**
     * 上传头像
     */
    boolean uploadAvatar(Long userId, String avatarUrl);
}
