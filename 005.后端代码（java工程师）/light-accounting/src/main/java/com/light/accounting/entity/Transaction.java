package com.light.accounting.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

/**
 * 收支记录实体
 */
@Data
@TableName("transactions")
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
     * 流水号
     */
    @Schema(description = "流水号")
    private String transactionNo;

    /**
     * 类型：1=支出, 2=收入
     */
    @Schema(description = "类型：1=支出, 2=收入")
    private Integer type;

    /**
     * 金额
     */
    @Schema(description = "金额")
    private BigDecimal amount;

    /**
     * 分类ID
     */
    @Schema(description = "分类ID")
    private Long categoryId;

    /**
     * 交易日期
     */
    @Schema(description = "交易日期")
    private LocalDate date;

    /**
     * 交易时间
     */
    @Schema(description = "交易时间")
    private LocalTime time;

    /**
     * 支付方式：1=现金, 2=微信, 3=支付宝, 4=银行卡, 5=其他
     */
    @Schema(description = "支付方式")
    private Integer paymentMethod;

    /**
     * 对方单位/客户/供应商名称
     */
    @Schema(description = "对方单位")
    private String counterparty;

    /**
     * 对方类型：1=客户, 2=供应商, 3=其他
     */
    @Schema(description = "对方类型")
    private Integer counterpartyType;

    /**
     * 对方ID
     */
    @Schema(description = "对方ID")
    private Long counterpartyId;

    /**
     * 状态：1=已支付/已收讫, 2=挂账/待收
     */
    @Schema(description = "状态")
    private Integer status;

    /**
     * 关联记录ID
     */
    @Schema(description = "关联记录ID")
    private Long relatedTransactionId;

    /**
     * 备注
     */
    @Schema(description = "备注")
    private String remark;

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
