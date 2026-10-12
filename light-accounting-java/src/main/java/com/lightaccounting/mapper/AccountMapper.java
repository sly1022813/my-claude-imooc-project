package com.lightaccounting.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.lightaccounting.entity.Account;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface AccountMapper extends BaseMapper<Account> {

    @Select("SELECT * FROM accounts WHERE id = #{id} AND user_id = #{userId}")
    Account findById(@Param("id") Long id, @Param("userId") Long userId);
}
