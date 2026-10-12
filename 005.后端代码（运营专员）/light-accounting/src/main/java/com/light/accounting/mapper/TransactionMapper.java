package com.light.accounting.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.light.accounting.entity.Transaction;
import org.apache.ibatis.annotations.Mapper;

/**
 * 收支记录 Mapper
 */
@Mapper
public interface TransactionMapper extends BaseMapper<Transaction> {
}
