package com.lightaccounting.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateCategoryRequest {
    @NotNull(message = "分类类型不能为空")
    @Min(value = 1, message = "分类类型需为1(支出)或2(收入)")
    @Max(value = 2, message = "分类类型需为1(支出)或2(收入)")
    private Integer type;

    @NotBlank(message = "分类名称不能为空")
    @Size(max = 50, message = "分类名称最多50个字符")
    private String name;

    @Size(max = 50, message = "图标最多50个字符")
    private String icon;

    @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "颜色值格式错误")
    private String color;

    private Integer sortOrder;
}
