package com.lightaccounting.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdateCategoryRequest {
    @Size(max = 50, message = "分类名称最多50个字符")
    private String name;

    @Size(max = 50, message = "图标最多50个字符")
    private String icon;

    @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "颜色值格式错误")
    private String color;

    @Min(value = 0, message = "排序值需为非负整数")
    private Integer sortOrder;

    @Min(value = 0, message = "状态值需为0或1")
    @Max(value = 1, message = "状态值需为0或1")
    private Integer status;
}
