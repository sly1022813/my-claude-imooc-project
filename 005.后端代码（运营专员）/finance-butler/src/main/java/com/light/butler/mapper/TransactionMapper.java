package com.light.butler.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.light.butler.entity.Transaction;
import org.apache.ibatis.annotations.Mapper;

/**
 * 收支记录 Mapper
 */
@Mapper
public interface TransactionMapper extends BaseMapper<Transaction> {
}
