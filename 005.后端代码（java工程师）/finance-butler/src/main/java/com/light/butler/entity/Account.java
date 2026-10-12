package com.light.butler.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 账户实体
 */
@Data
@TableName("fb_accounts")
@Schema(description = "账户实体")
public class Account implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 账户ID
     */
    @TableId(type = IdType.AUTO)
    @Schema(description = "账户ID")
    private Long id;

    /**
     * 用户ID
     */
    @Schema(description = "用户ID")
    private Long userId;

    /**
     * 账户名称
     */
    @Schema(description = "账户名称")
    private String name;

    /**
     * 账户类型：1=现金, 2=银行, 3=微信, 4=支付宝, 5=其他
     */
    @Schema(description = "账户类型")
    private Integer type;

    /**
     * 余额
     */
    @Schema(description = "余额")
    private BigDecimal balance;

    /**
     * 卡号
     */
    @Schema(description = "卡号")
    private String cardNo;

    /**
     * 开户银行
     */
    @Schema(description = "开户银行")
    private String bankName;

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
