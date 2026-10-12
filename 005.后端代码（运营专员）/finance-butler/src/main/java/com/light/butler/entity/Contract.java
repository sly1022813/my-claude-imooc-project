package com.light.butler.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 合同实体
 */
@Data
@TableName("fb_contracts")
@Schema(description = "合同实体")
public class Contract implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 合同ID
     */
    @TableId(type = IdType.AUTO)
    @Schema(description = "合同ID")
    private Long id;

    /**
     * 用户ID
     */
    @Schema(description = "用户ID")
    private Long userId;

    /**
     * 合同编号
     */
    @Schema(description = "合同编号")
    private String contractNo;

    /**
     * 合同名称
     */
    @Schema(description = "合同名称")
    private String name;

    /**
     * 合同类型：1=销售合同, 2=采购合同, 3=服务合同, 4=租赁合同, 5=其他
     */
    @Schema(description = "合同类型：1=销售合同, 2=采购合同, 3=服务合同, 4=租赁合同, 5=其他")
    private Integer type;

    /**
     * 签约方向：1=我方签约, 2=对方签约
     */
    @Schema(description = "签约方向：1=我方签约, 2=对方签约")
    private Integer direction;

    /**
     * 客户ID（销售合同时）
     */
    @Schema(description = "客户ID")
    private Long customerId;

    /**
     * 供应商ID（采购合同时）
     */
    @Schema(description = "供应商ID")
    private Long supplierId;

    /**
     * 签约方名称
     */
    @Schema(description = "签约方名称")
    private String partyName;

    /**
     * 合同金额
     */
    @Schema(description = "合同金额")
    private BigDecimal amount;

    /**
     * 已执行金额
     */
    @Schema(description = "已执行金额")
    private BigDecimal executedAmount;

    /**
     * 合同开始日期
     */
    @Schema(description = "合同开始日期")
    private LocalDate startDate;

    /**
     * 合同结束日期
     */
    @Schema(description = "合同结束日期")
    private LocalDate endDate;

    /**
     * 签订日期
     */
    @Schema(description = "签订日期")
    private LocalDate signDate;

    /**
     * 合同附件URL
     */
    @Schema(description = "合同附件URL")
    private String attachmentUrl;

    /**
     * 合同状态：1=拟定中, 2=审批中, 3=执行中, 4=已完成, 5=已终止
     */
    @Schema(description = "合同状态：1=拟定中, 2=审批中, 3=执行中, 4=已完成, 5=已终止")
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
