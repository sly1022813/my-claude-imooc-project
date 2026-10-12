package com.light.butler.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

/**
 * 账户请求
 */
@Data
@Schema(description = "账户请求")
public class AccountRequest {

    @NotBlank(message = "账户名称不能为空")
    @Schema(description = "账户名称")
    private String name;

    @Schema(description = "账户类型：1=现金, 2=银行, 3=微信, 4=支付宝, 5=其他")
    private Integer type;

    @Schema(description = "余额")
    private BigDecimal balance;

    @Schema(description = "卡号")
    private String cardNo;

    @Schema(description = "开户银行")
    private String bankName;

    @Schema(description = "备注")
    private String remark;
}
