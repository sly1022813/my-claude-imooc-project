package com.light.accounting.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 分类实体
 */
@Data
@TableName("categories")
@Schema(description = "分类实体")
public class Category implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 分类ID
     */
    @TableId(type = IdType.AUTO)
    @Schema(description = "分类ID")
    private Long id;

    /**
     * 用户ID（0=系统分类）
     */
    @Schema(description = "用户ID")
    private Long userId;

    /**
     * 类型：1=支出, 2=收入
     */
    @Schema(description = "类型：1=支出, 2=收入")
    private Integer type;

    /**
     * 分类名称
     */
    @Schema(description = "分类名称")
    private String name;

    /**
     * 图标（Emoji）
     */
    @Schema(description = "图标")
    private String icon;

    /**
     * 颜色值
     */
    @Schema(description = "颜色")
    private String color;

    /**
     * 是否系统分类：1=是, 0=否
     */
    @Schema(description = "是否系统分类")
    private Integer isSystem;

    /**
     * 排序
     */
    @Schema(description = "排序")
    private Integer sortOrder;

    /**
     * 状态：1=启用, 0=禁用
     */
    @Schema(description = "状态")
    private Integer status;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;
}
