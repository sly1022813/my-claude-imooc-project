package com.light.butler.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.light.butler.entity.Category;

/**
 * 分类 Service
 */
public interface CategoryService extends IService<Category> {

    /**
     * 获取用户可用的分类列表（包含系统分类）
     */
    java.util.List<Category> getList(Long userId, Integer type);

    /**
     * 检查用户名是否可用
     */
    boolean isUsernameAvailable(String username);
}
