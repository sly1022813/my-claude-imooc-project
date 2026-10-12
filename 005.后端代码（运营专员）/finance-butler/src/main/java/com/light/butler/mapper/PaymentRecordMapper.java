package com.light.butler.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.light.butler.entity.PaymentRecord;
import org.apache.ibatis.annotations.Mapper;

/**
 * 付款记录 Mapper
 */
@Mapper
public interface PaymentRecordMapper extends BaseMapper<PaymentRecord> {
}
