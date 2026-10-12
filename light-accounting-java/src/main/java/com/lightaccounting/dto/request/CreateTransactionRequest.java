package com.lightaccounting.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class CreateTransactionRequest {
    @NotNull(message = "记录类型不能为空")
    @Min(value = 1, message = "记录类型需为1(支出)或2(收入)")
    @Max(value = 2, message = "记录类型需为1(支出)或2(收入)")
    private Integer type;

    @NotNull(message = "金额不能为空")
    @DecimalMin(value = "0.01", message = "金额需大于0")
    @DecimalMax(value = "999999999.99", message = "金额超出范围")
    private BigDecimal amount;

    @NotNull(message = "分类不能为空")
    @Min(value = 1, message = "分类ID无效")
    private Long categoryId;

    private LocalDate date;
    private LocalTime time;

    @Min(value = 1, message = "支付方式需为1-5")
    @Max(value = 5, message = "支付方式需为1-5")
    private Integer paymentMethod;

    private String counterparty;

    @Min(value = 1, message = "对方类型需为1-3")
    @Max(value = 3, message = "对方类型需为1-3")
    private Integer counterpartyType;

    @Min(value = 1, message = "对方ID无效")
    private Long counterpartyId;

    @Min(value = 1, message = "状态需为1(已收付)或2(待收付)")
    @Max(value = 2, message = "状态需为1(已收付)或2(待收付)")
    private Integer status;

    @Size(max = 500, message = "备注最多500个字符")
    private String remark;
}
