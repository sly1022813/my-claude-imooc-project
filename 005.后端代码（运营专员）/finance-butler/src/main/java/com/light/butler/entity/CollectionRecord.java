package com.light.butler.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 回款记录实体（核销应收）
 */
@Data
@TableName("fb_collection_records")
@Schema(description = "回款记录实体")
public class CollectionRecord implements Serializable {

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
     * 关联应收账单ID
     */
    @Schema(description = "关联应收账单ID")
    private Long arBillId;

    /**
     * 回款金额
     */
    @Schema(description = "回款金额")
    private BigDecimal amount;

    /**
     * 回款日期
     */
    @Schema(description = "回款日期")
    private LocalDate collectionDate;

    /**
     * 回款方式：1=银行转账, 2=现金, 3=支票, 4=汇票, 5=其他
     */
    @Schema(description = "回款方式")
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
