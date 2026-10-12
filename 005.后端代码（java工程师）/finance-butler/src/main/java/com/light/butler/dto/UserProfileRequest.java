package com.light.butler.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 用户资料更新请求
 */
@Data
@Schema(description = "用户资料更新请求")
public class UserProfileRequest {

    @Schema(description = "昵称")
    private String nickname;

    @Schema(description = "手机号")
    private String phone;

    @Schema(description = "邮箱")
    private String email;

    @Schema(description = "头像URL")
    private String avatarUrl;

    @Schema(description = "企业/商户名称")
    private String businessName;
}
