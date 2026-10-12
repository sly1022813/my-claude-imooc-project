package com.lightaccounting.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateCustomerRequest {
    @NotBlank(message = "客户名称不能为空")
    @Size(max = 100, message = "客户名称最多100个字符")
    private String name;

    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;

    @Size(max = 500, message = "地址最多500个字符")
    private String address;

    @Min(value = 1, message = "客户类型需为1(个人)或2(企业)")
    @Max(value = 2, message = "客户类型需为1(个人)或2(企业)")
    private Integer customerType;

    @DecimalMin(value = "0", message = "信用额度需为非负数")
    private BigDecimal creditLimit;

    @Size(max = 500, message = "备注最多500个字符")
    private String remark;
}
