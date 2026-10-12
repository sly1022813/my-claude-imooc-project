package com.light.butler.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 客户实体
 */
@Data
@TableName("fb_customers")
@Schema(description = "客户实体")
public class Customer implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 客户ID
     */
    @TableId(type = IdType.AUTO)
    @Schema(description = "客户ID")
    private Long id;

    /**
     * 用户ID（所属用户）
     */
    @Schema(description = "用户ID")
    private Long userId;

    /**
     * 客户编码
     */
    @Schema(description = "客户编码")
    private String code;

    /**
     * 客户名称
     */
    @Schema(description = "客户名称")
    private String name;

    /**
     * 客户类型：1=个人, 2=企业
     */
    @Schema(description = "客户类型：1=个人, 2=企业")
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
     * 应收余额
     */
    @Schema(description = "应收余额")
    private BigDecimal receivableBalance;

    /**
     * 已收余额
     */
    @Schema(description = "已收余额")
    private BigDecimal receivedBalance;

    /**
     * 客户等级：1=普通, 2=重要, 3=VIP
     */
    @Schema(description = "客户等级：1=普通, 2=重要, 3=VIP")
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
