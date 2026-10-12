package com.light.butler.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.light.butler.entity.Budget;
import org.apache.ibatis.annotations.Mapper;

/**
 * 预算 Mapper
 */
@Mapper
public interface BudgetMapper extends BaseMapper<Budget> {
}
