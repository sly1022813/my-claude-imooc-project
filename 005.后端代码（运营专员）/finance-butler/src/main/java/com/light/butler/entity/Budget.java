package com.light.butler.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 预算实体
 */
@Data
@TableName("fb_budgets")
@Schema(description = "预算实体")
public class Budget implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 预算ID
     */
    @TableId(type = IdType.AUTO)
    @Schema(description = "预算ID")
    private Long id;

    /**
     * 用户ID
     */
    @Schema(description = "用户ID")
    private Long userId;

    /**
     * 预算年度
     */
    @Schema(description = "预算年度")
    private Integer year;

    /**
     * 预算月份（0=年度预算, 1-12=月度预算）
     */
    @Schema(description = "预算月份")
    private Integer month;

    /**
     * 预算类型：1=收入预算, 2=支出预算
     */
    @Schema(description = "预算类型：1=收入预算, 2=支出预算")
    private Integer type;

    /**
     * 预算项目/分类
     */
    @Schema(description = "预算项目")
    private String category;

    /**
     * 预算金额
     */
    @Schema(description = "预算金额")
    private BigDecimal budgetAmount;

    /**
     * 已执行金额
     */
    @Schema(description = "已执行金额")
    private BigDecimal executedAmount;

    /**
     * 执行率
     */
    @Schema(description = "执行率")
    private BigDecimal executionRate;

    /**
     * 备注
     */
    @Schema(description = "备注")
    private String remark;

    /**
     * 状态：1=草稿, 2=已提交, 3=已审批, 4=执行中
     */
    @Schema(description = "状态：1=草稿, 2=已提交, 3=已审批, 4=执行中")
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
