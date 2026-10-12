package com.light.butler.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 收支记录实体
 */
@Data
@TableName("fb_transactions")
@Schema(description = "收支记录实体")
public class Transaction implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 记录ID
     */
    @TableId(type = IdType.AUTO)
    @Schema(description = "记录ID")
    private Long id;

    /**
     * 用户ID
     */
    @Schema(description = "用户ID")
    private Long userId;

    /**
     * 类型：1=支出, 2=收入
     */
    @Schema(description = "类型：1=支出, 2=收入")
    private Integer type;

    /**
     * 分类ID
     */
    @Schema(description = "分类ID")
    private Long categoryId;

    /**
     * 金额
     */
    @Schema(description = "金额")
    private BigDecimal amount;

    /**
     * 描述/备注
     */
    @Schema(description = "描述/备注")
    private String description;

    /**
     * 交易日期
     */
    @Schema(description = "交易日期")
    private LocalDate transactionDate;

    /**
     * 账户ID
     */
    @Schema(description = "账户ID")
    private Long accountId;

    /**
     * 客户ID（收入时关联）
     */
    @Schema(description = "客户ID")
    private Long customerId;

    /**
     * 供应商ID（支出时关联）
     */
    @Schema(description = "供应商ID")
    private Long supplierId;

    /**
     * 状态：1=已支付, 2=待收/待付
     */
    @Schema(description = "状态：1=已支付, 2=待收/待付")
    private Integer status;

    /**
     * 支付方式：1=现金, 2=银行转账, 3=微信, 4=支付宝, 5=其他
     */
    @Schema(description = "支付方式")
    private Integer paymentMethod;

    /**
     * 发票号
     */
    @Schema(description = "发票号")
    private String invoiceNo;

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

    // ========== 扩展字段（用于关联查询）==========

    /**
     * 分类名称
     */
    @TableField(exist = false)
    @Schema(description = "分类名称")
    private String categoryName;

    /**
     * 客户名称
     */
    @TableField(exist = false)
    @Schema(description = "客户名称")
    private String customerName;

    /**
     * 供应商名称
     */
    @TableField(exist = false)
    @Schema(description = "供应商名称")
    private String supplierName;
}
