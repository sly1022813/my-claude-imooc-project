package com.light.butler.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 注册请求
 */
@Data
@Schema(description = "注册请求")
public class RegisterRequest {

    @NotBlank(message = "用户名不能为空")
    @Schema(description = "用户名")
    private String username;

    @NotBlank(message = "密码不能为空")
    @Schema(description = "密码")
    private String password;

    @Schema(description = "用户类型：1=个人, 2=个体户, 3=企业")
    private Integer userType;

    @Schema(description = "昵称")
    private String nickname;

    @Schema(description = "企业/商户名称")
    private String businessName;

    @Schema(description = "手机号")
    private String phone;

    @Schema(description = "邮箱")
    private String email;
}
