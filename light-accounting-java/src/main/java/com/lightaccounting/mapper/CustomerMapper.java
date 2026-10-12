package com.lightaccounting.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.lightaccounting.entity.Customer;
import org.apache.ibatis.annotations.*;

import java.math.BigDecimal;

@Mapper
public interface CustomerMapper extends BaseMapper<Customer> {

    @Select("SELECT * FROM customers WHERE id = #{id} AND user_id = #{userId}")
    Customer findById(@Param("id") Long id, @Param("userId") Long userId);

    @Update("UPDATE customers SET total_transaction = total_transaction + #{amount}, " +
            "outstanding_amount = outstanding_amount + #{outstandingChange} WHERE id = #{id}")
    void updateStats(@Param("id") Long id, @Param("amount") BigDecimal amount,
                     @Param("outstandingChange") BigDecimal outstandingChange);
}
