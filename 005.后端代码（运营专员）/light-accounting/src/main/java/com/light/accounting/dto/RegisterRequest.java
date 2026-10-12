package com.light.accounting.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 注册请求
 */
@Data
@Schema(description = "注册请求")
public class RegisterRequest {

    @NotBlank(message = "用户名不能为空")
    @Pattern(regexp = "^[a-zA-Z][a-zA-Z0-9]{2,19}$", message = "用户名需为3-20位字母数字组合，字母开头")
    @Schema(description = "用户名")
    private String username;

    @NotBlank(message = "密码不能为空")
    @Size(min = 6, message = "密码长度不能少于6位")
    @Schema(description = "密码")
    private String password;

    @NotBlank(message = "确认密码不能为空")
    @Schema(description = "确认密码")
    private String confirmPassword;

    @Schema(description = "用户类型：1=个人, 2=个体户, 3=企业")
    private Integer userType = 1;

    @Schema(description = "昵称")
    private String nickname;

    @Schema(description = "手机号")
    private String phone;
}
