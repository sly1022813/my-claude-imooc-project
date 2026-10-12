package com.light.accounting.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 登录响应
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "登录响应")
public class LoginResponse {

    @Schema(description = "JWT Token")
    private String token;

    @Schema(description = "用户信息")
    private UserVO user;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserVO {
        @Schema(description = "用户ID")
        private Long id;

        @Schema(description = "用户名")
        private String username;

        @Schema(description = "用户类型")
        private Integer userType;

        @Schema(description = "昵称")
        private String nickname;

        @Schema(description = "手机号")
        private String phone;

        @Schema(description = "邮箱")
        private String email;

        @Schema(description = "头像URL")
        private String avatarUrl;

        @Schema(description = "商户名称")
        private String businessName;
    }
}
