package com.light.accounting.config;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * JWT 配置属性
 */
@Data
@Component
@ConfigurationProperties(prefix = "jwt")
@Schema(description = "JWT配置")
public class JwtConfig {

    /**
     * JWT 密钥
     */
    @Schema(description = "JWT密钥")
    private String secret;

    /**
     * 过期时间（毫秒）
     */
    @Schema(description = "过期时间")
    private long expiration;
}
