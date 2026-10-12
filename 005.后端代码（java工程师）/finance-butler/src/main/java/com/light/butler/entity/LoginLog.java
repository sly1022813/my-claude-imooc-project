package com.light.butler.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 登录日志实体
 */
@Data
@TableName("fb_login_logs")
@Schema(description = "登录日志实体")
public class LoginLog implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 日志ID
     */
    @TableId(type = IdType.AUTO)
    @Schema(description = "日志ID")
    private Long id;

    /**
     * 用户ID
     */
    @Schema(description = "用户ID")
    private Long userId;

    /**
     * 用户名
     */
    @Schema(description = "用户名")
    private String username;

    /**
     * 登录状态：1=成功, 0=失败
     */
    @Schema(description = "登录状态：1=成功, 0=失败")
    private Integer loginStatus;

    /**
     * 失败原因
     */
    @Schema(description = "失败原因")
    private String failReason;

    /**
     * IP地址
     */
    @Schema(description = "IP地址")
    private String ipAddress;

    /**
     * User-Agent
     */
    @Schema(description = "User-Agent")
    private String userAgent;

    /**
     * 登录时间
     */
    @TableField(fill = FieldFill.INSERT)
    @Schema(description = "登录时间")
    private LocalDateTime loginTime;
}
