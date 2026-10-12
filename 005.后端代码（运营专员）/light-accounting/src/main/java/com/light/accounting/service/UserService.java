package com.light.accounting.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.light.accounting.entity.User;

/**
 * 用户 Service 接口
 */
public interface UserService extends IService<User> {

    /**
     * 根据用户名查询用户
     *
     * @param username 用户名
     * @return 用户
     */
    User findByUsername(String username);

    /**
     * 检查用户名是否存在
     *
     * @param username 用户名
     * @return 是否存在
     */
    boolean existsByUsername(String username);

    /**
     * 用户注册
     *
     * @param user 用户信息
     * @return 注册的用户
     */
    User register(User user);

    /**
     * 更新最后登录信息
     *
     * @param userId   用户ID
     * @param loginIp  登录IP
     */
    void updateLoginInfo(Long userId, String loginIp);
}
