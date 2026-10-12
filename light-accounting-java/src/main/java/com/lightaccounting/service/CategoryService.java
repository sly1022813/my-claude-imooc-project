package com.lightaccounting.service;

import com.lightaccounting.entity.Category;
import java.util.List;

public interface CategoryService {
    List<Category> getList(Long userId, Integer type);
    Category getById(Long id, Long userId);
    Category create(Long userId, Category category);
    Category update(Long id, Long userId, Category category);
    void delete(Long id, Long userId);
}
