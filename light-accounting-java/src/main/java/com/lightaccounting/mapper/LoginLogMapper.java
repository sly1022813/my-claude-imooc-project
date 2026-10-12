package com.lightaccounting.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.lightaccounting.entity.LoginLog;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface LoginLogMapper extends BaseMapper<LoginLog> {

    @Select("SELECT COUNT(*) FROM login_logs WHERE username = #{username} AND login_status = 0 AND login_time > DATE_SUB(NOW(), INTERVAL #{minutes} MINUTE)")
    int countRecentFails(@Param("username") String username, @Param("minutes") int minutes);
}
