package com.light.butler.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 收支记录请求
 */
@Data
@Schema(description = "收支记录请求")
public class TransactionRequest {

    @NotNull(message = "类型不能为空")
    @Min(value = 1, message = "类型值无效")
    @Max(value = 2, message = "类型值无效")
    @Schema(description = "类型：1=支出, 2=收入")
    private Integer type;

    @Schema(description = "分类ID")
    private Long categoryId;

    @NotNull(message = "金额不能为空")
    @DecimalMin(value = "0.01", message = "金额必须大于0")
    @Schema(description = "金额")
    private BigDecimal amount;

    @Schema(description = "描述/备注")
    private String description;

    @NotNull(message = "交易日期不能为空")
    @Schema(description = "交易日期")
    private LocalDate transactionDate;

    @Schema(description = "账户ID")
    private Long accountId;

    @Schema(description = "客户ID")
    private Long customerId;

    @Schema(description = "供应商ID")
    private Long supplierId;

    @Schema(description = "状态：1=已支付, 2=待收/待付")
    private Integer status;

    @Schema(description = "支付方式：1=现金, 2=银行转账, 3=微信, 4=支付宝, 5=其他")
    private Integer paymentMethod;

    @Schema(description = "发票号")
    private String invoiceNo;
}
