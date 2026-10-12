package com.lightaccounting.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.lightaccounting.common.ResultCode;
import com.lightaccounting.entity.Category;
import com.lightaccounting.mapper.CategoryMapper;
import com.lightaccounting.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryMapper categoryMapper;

    @Override
    public List<Category> getList(Long userId, Integer type) {
        QueryWrapper<Category> wrapper = new QueryWrapper<>();
        wrapper.and(w -> w.eq("user_id", userId).or().eq("user_id", 0));
        if (type != null) {
            wrapper.eq("type", type);
        }
        wrapper.orderByAsc("sort_order");
        return categoryMapper.selectList(wrapper);
    }

    @Override
    public Category getById(Long id, Long userId) {
        Category category = categoryMapper.findById(id, userId);
        if (category == null) {
            throw new BusinessException(ResultCode.CATEGORY_NOT_EXISTS, "分类不存在");
        }
        return category;
    }

    @Override
    @Transactional
    public Category create(Long userId, Category category) {
        category.setUserId(userId);
        category.setIsSystem(0);
        category.setStatus(1);
        categoryMapper.insert(category);
        return category;
    }

    @Override
    @Transactional
    public Category update(Long id, Long userId, Category category) {
        Category existing = getById(id, userId);
        if (existing.getIsSystem() == 1) {
            throw new BusinessException(4003, "系统分类不能修改");
        }
        if (category.getName() != null) {
            existing.setName(category.getName());
        }
        if (category.getIcon() != null) {
            existing.setIcon(category.getIcon());
        }
        if (category.getColor() != null) {
            existing.setColor(category.getColor());
        }
        if (category.getSortOrder() != null) {
            existing.setSortOrder(category.getSortOrder());
        }
        if (category.getStatus() != null) {
            existing.setStatus(category.getStatus());
        }
        categoryMapper.updateById(existing);
        return existing;
    }

    @Override
    @Transactional
    public void delete(Long id, Long userId) {
        Category existing = getById(id, userId);
        if (existing.getIsSystem() == 1) {
            throw new BusinessException(4004, "系统分类不能删除");
        }
        categoryMapper.deleteById(id);
    }
}
