package com.light.butler.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 检查用户名响应
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "检查用户名响应")
public class CheckUsernameResponse {

    @Schema(description = "是否可用")
    private boolean available;
}
