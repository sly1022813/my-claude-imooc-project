package com.light.butler.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 付款记录实体（核销应付）
 */
@Data
@TableName("fb_payment_records")
@Schema(description = "付款记录实体")
public class PaymentRecord implements Serializable {

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
     * 关联应付账单ID
     */
    @Schema(description = "关联应付账单ID")
    private Long apBillId;

    /**
     * 付款金额
     */
    @Schema(description = "付款金额")
    private BigDecimal amount;

    /**
     * 付款日期
     */
    @Schema(description = "付款日期")
    private LocalDate paymentDate;

    /**
     * 付款方式：1=银行转账, 2=现金, 3=支票, 4=汇票, 5=其他
     */
    @Schema(description = "付款方式")
    private Integer paymentMethod;

    /**
     * 银行名称
     */
    @Schema(description = "银行名称")
    private String bankName;

    /**
     * 银行流水号
     */
    @Schema(description = "银行流水号")
    private String transactionNo;

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
}
