package com.light.accounting.entity;

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
@TableName("accounts")
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
     * 账户类型：cash=现金, bank=银行卡, wechat=微信, alipay=支付宝, credit=信用卡, other=其他
     */
    @Schema(description = "账户类型")
    private String type;

    /**
     * 余额
     */
    @Schema(description = "余额")
    private BigDecimal balance;

    /**
     * 图标
     */
    @Schema(description = "图标")
    private String icon;

    /**
     * 颜色
     */
    @Schema(description = "颜色")
    private String color;

    /**
     * 排序
     */
    @Schema(description = "排序")
    private Integer sortOrder;

    /**
     * 备注
     */
    @Schema(description = "备注")
    private String remark;

    /**
     * 状态：1=正常, 0=禁用
     */
    @Schema(description = "状态")
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
