package com.light.butler.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 用户实体
 */
@Data
@TableName("fb_users")
@Schema(description = "用户实体")
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 用户ID
     */
    @TableId(type = IdType.AUTO)
    @Schema(description = "用户ID")
    private Long id;

    /**
     * 用户名
     */
    @Schema(description = "用户名")
    private String username;

    /**
     * 密码哈希
     */
    @Schema(description = "密码哈希")
    private String passwordHash;

    /**
     * 用户类型：1=个人, 2=个体户, 3=企业
     */
    @Schema(description = "用户类型：1=个人, 2=个体户, 3=企业")
    private Integer userType;

    /**
     * 昵称
     */
    @Schema(description = "昵称")
    private String nickname;

    /**
     * 手机号
     */
    @Schema(description = "手机号")
    private String phone;

    /**
     * 邮箱
     */
    @Schema(description = "邮箱")
    private String email;

    /**
     * 头像URL
     */
    @Schema(description = "头像URL")
    private String avatarUrl;

    /**
     * 企业/商户名称
     */
    @Schema(description = "企业/商户名称")
    private String businessName;

    /**
     * 统一社会信用代码
     */
    @Schema(description = "统一社会信用代码")
    private String creditCode;

    /**
     * 状态：1=正常, 0=禁用
     */
    @Schema(description = "状态：1=正常, 0=禁用")
    private Integer status;

    /**
     * 最后登录时间
     */
    @Schema(description = "最后登录时间")
    private LocalDateTime lastLoginAt;

    /**
     * 最后登录IP
     */
    @Schema(description = "最后登录IP")
    private String lastLoginIp;

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
