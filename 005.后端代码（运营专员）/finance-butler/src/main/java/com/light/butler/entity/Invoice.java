package com.light.butler.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 发票实体
 */
@Data
@TableName("fb_invoices")
@Schema(description = "发票实体")
public class Invoice implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 发票ID
     */
    @TableId(type = IdType.AUTO)
    @Schema(description = "发票ID")
    private Long id;

    /**
     * 用户ID
     */
    @Schema(description = "用户ID")
    private Long userId;

    /**
     * 发票编号
     */
    @Schema(description = "发票编号")
    private String invoiceNo;

    /**
     * 发票类型：1=增值税专用发票, 2=增值税普通发票, 3=电子发票, 4=收据
     */
    @Schema(description = "发票类型：1=增值税专用发票, 2=增值税普通发票, 3=电子发票, 4=收据")
    private Integer type;

    /**
     * 发票方向：1=销项发票(开给客户), 2=进项发票(收到供应商)
     */
    @Schema(description = "发票方向：1=销项发票, 2=进项发票")
    private Integer direction;

    /**
     * 客户ID（销项时）
     */
    @Schema(description = "客户ID")
    private Long customerId;

    /**
     * 供应商ID（进项时）
     */
    @Schema(description = "供应商ID")
    private Long supplierId;

    /**
     * 客户/供应商名称
     */
    @Schema(description = "客户/供应商名称")
    private String partyName;

    /**
     * 合同ID（可选）
     */
    @Schema(description = "合同ID")
    private Long contractId;

    /**
     * 发票金额（不含税）
     */
    @Schema(description = "发票金额（不含税）")
    private BigDecimal amount;

    /**
     * 税率
     */
    @Schema(description = "税率")
    private BigDecimal taxRate;

    /**
     * 税额
     */
    @Schema(description = "税额")
    private BigDecimal taxAmount;

    /**
     * 发票金额（含税）
     */
    @Schema(description = "发票金额（含税）")
    private BigDecimal totalAmount;

    /**
     * 开票日期
     */
    @Schema(description = "开票日期")
    private LocalDate invoiceDate;

    /**
     * 发票代码（纸质发票）
     */
    @Schema(description = "发票代码")
    private String invoiceCode;

    /**
     * 发票号码
     */
    @Schema(description = "发票号码")
    private String invoiceNumber;

    /**
     * 发票状态：1=未开具, 2=已开具, 3=已认证, 4=已作废
     */
    @Schema(description = "发票状态：1=未开具, 2=已开具, 3=已认证, 4=已作废")
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
