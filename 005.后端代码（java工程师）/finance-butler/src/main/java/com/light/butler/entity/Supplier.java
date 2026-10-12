package com.light.butler.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 供应商实体
 */
@Data
@TableName("fb_suppliers")
@Schema(description = "供应商实体")
public class Supplier implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 供应商ID
     */
    @TableId(type = IdType.AUTO)
    @Schema(description = "供应商ID")
    private Long id;

    /**
     * 用户ID（所属用户）
     */
    @Schema(description = "用户ID")
    private Long userId;

    /**
     * 供应商编码
     */
    @Schema(description = "供应商编码")
    private String code;

    /**
     * 供应商名称
     */
    @Schema(description = "供应商名称")
    private String name;

    /**
     * 供应商类型：1=个人, 2=企业
     */
    @Schema(description = "供应商类型：1=个人, 2=企业")
    private Integer type;

    /**
     * 联系人
     */
    @Schema(description = "联系人")
    private String contact;

    /**
     * 联系电话
     */
    @Schema(description = "联系电话")
    private String phone;

    /**
     * 邮箱
     */
    @Schema(description = "邮箱")
    private String email;

    /**
     * 地址
     */
    @Schema(description = "地址")
    private String address;

    /**
     * 统一社会信用代码
     */
    @Schema(description = "统一社会信用代码")
    private String creditCode;

    /**
     * 开户银行
     */
    @Schema(description = "开户银行")
    private String bankName;

    /**
     * 银行账号
     */
    @Schema(description = "银行账号")
    private String bankAccount;

    /**
     * 应付余额
     */
    @Schema(description = "应付余额")
    private BigDecimal payableBalance;

    /**
     * 已付余额
     */
    @Schema(description = "已付余额")
    private BigDecimal paidBalance;

    /**
     * 供应商等级：1=普通, 2=重要, 3=核心
     */
    @Schema(description = "供应商等级：1=普通, 2=重要, 3=核心")
    private Integer level;

    /**
     * 备注
     */
    @Schema(description = "备注")
    private String remark;

    /**
     * 状态：1=正常, 0=禁用
     */
    @Schema(description = "状态：1=正常, 0=禁用")
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
