package com.light.butler.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 应收账款实体
 */
@Data
@TableName("fb_ar_bills")
@Schema(description = "应收账款实体")
public class ArBill implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 账单ID
     */
    @TableId(type = IdType.AUTO)
    @Schema(description = "账单ID")
    private Long id;

    /**
     * 用户ID
     */
    @Schema(description = "用户ID")
    private Long userId;

    /**
     * 账单编号
     */
    @Schema(description = "账单编号")
    private String billNo;

    /**
     * 客户ID
     */
    @Schema(description = "客户ID")
    private Long customerId;

    /**
     * 客户名称（冗余）
     */
    @Schema(description = "客户名称")
    private String customerName;

    /**
     * 合同ID（可选）
     */
    @Schema(description = "合同ID")
    private Long contractId;

    /**
     * 发票ID（可选）
     */
    @Schema(description = "发票ID")
    private Long invoiceId;

    /**
     * 账单金额
     */
    @Schema(description = "账单金额")
    private BigDecimal amount;

    /**
     * 已核销金额
     */
    @Schema(description = "已核销金额")
    private BigDecimal writtenOffAmount;

    /**
     * 未核销金额
     */
    @Schema(description = "未核销金额")
    private BigDecimal pendingAmount;

    /**
     * 账单日期
     */
    @Schema(description = "账单日期")
    private LocalDate billDate;

    /**
     * 到期日期
     */
    @Schema(description = "到期日期")
    private LocalDate dueDate;

    /**
     * 账期类型：1=即时, 7=7天, 15=15天, 30=30天, 60=60天, 90=90天
     */
    @Schema(description = "账期类型")
    private Integer paymentTerm;

    /**
     * 状态：1=待确认, 2=待收款, 3=部分核销, 4=已核销, 5=逾期
     */
    @Schema(description = "状态：1=待确认, 2=待收款, 3=部分核销, 4=已核销, 5=逾期")
    private Integer status;

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
