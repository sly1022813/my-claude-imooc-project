package com.light.butler.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.light.butler.entity.Category;
import com.light.butler.mapper.CategoryMapper;
import com.light.butler.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 分类 Service 实现
 */
@Service
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category> implements CategoryService {

    @Override
    public List<Category> getList(Long userId, Integer type) {
        LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<>();
        // 获取系统分类(user_id=0)和用户自定义分类
        wrapper.and(w -> w.eq(Category::getUserId, 0).or().eq(Category::getUserId, userId));
        wrapper.eq(Category::getStatus, 1); // 只获取启用状态

        if (type != null) {
            wrapper.eq(Category::getType, type);
        }

        wrapper.orderByAsc(Category::getIsSystem)
               .orderByAsc(Category::getSortOrder)
               .orderByAsc(Category::getId);

        return this.list(wrapper);
    }

    @Override
    public boolean isUsernameAvailable(String username) {
        LambdaQueryWrapper<Category> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Category::getName, username);
        return this.count(wrapper) == 0;
    }
}
