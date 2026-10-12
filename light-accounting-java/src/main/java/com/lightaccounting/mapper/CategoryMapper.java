package com.lightaccounting.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.lightaccounting.entity.Category;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CategoryMapper extends BaseMapper<Category> {

    @Select("SELECT * FROM categories WHERE id = #{id} AND (user_id = #{userId} OR user_id = 0)")
    Category findById(@Param("id") Long id, @Param("userId") Long userId);

    @Select("SELECT * FROM categories WHERE user_id = #{userId} OR user_id = 0 ORDER BY sort_order ASC")
    List<Category> findAllByUserId(@Param("userId") Long userId);

    @Select("SELECT * FROM categories WHERE (user_id = #{userId} OR user_id = 0) AND type = #{type} ORDER BY sort_order ASC")
    List<Category> findByType(@Param("userId") Long userId, @Param("type") Integer type);
}
