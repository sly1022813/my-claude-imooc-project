package com.lightaccounting.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateSupplierRequest {
    @NotBlank(message = "供应商名称不能为空")
    @Size(max = 100, message = "供应商名称最多100个字符")
    private String name;

    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String phone;

    @Size(max = 500, message = "地址最多500个字符")
    private String address;

    @Size(max = 50, message = "联系人姓名最多50个字符")
    private String contactPerson;

    @Size(max = 500, message = "主营商品最多500个字符")
    private String products;

    @Min(value = 1, message = "结算方式需为1(即时)、2(月结)或3(季结)")
    @Max(value = 3, message = "结算方式需为1(即时)、2(月结)或3(季结)")
    private Integer settlementType;

    @Size(max = 500, message = "备注最多500个字符")
    private String remark;
}
