package com.light.butler.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 分类请求
 */
@Data
@Schema(description = "分类请求")
public class CategoryRequest {

    @NotNull(message = "分类类型不能为空")
    @Min(value = 1, message = "类型值无效")
    @Max(value = 2, message = "类型值无效")
    @Schema(description = "类型：1=支出, 2=收入")
    private Integer type;

    @NotBlank(message = "分类名称不能为空")
    @Schema(description = "分类名称")
    private String name;

    @Schema(description = "图标")
    private String icon;

    @Schema(description = "颜色")
    private String color;
}
