package com.lightaccounting.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.lightaccounting.entity.Supplier;
import org.apache.ibatis.annotations.*;

import java.math.BigDecimal;

@Mapper
public interface SupplierMapper extends BaseMapper<Supplier> {

    @Select("SELECT * FROM suppliers WHERE id = #{id} AND user_id = #{userId}")
    Supplier findById(@Param("id") Long id, @Param("userId") Long userId);

    @Update("UPDATE suppliers SET total_purchase = total_purchase + #{amount}, " +
            "outstanding_amount = outstanding_amount + #{outstandingChange} WHERE id = #{id}")
    void updateStats(@Param("id") Long id, @Param("amount") BigDecimal amount,
                     @Param("outstandingChange") BigDecimal outstandingChange);
}
