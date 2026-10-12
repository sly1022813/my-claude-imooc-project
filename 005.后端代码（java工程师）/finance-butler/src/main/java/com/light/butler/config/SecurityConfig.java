package com.light.butler.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security 配置
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 禁用 CSRF
            .csrf(csrf -> csrf.disable())
            // 禁用 Session
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // 配置权限
            .authorizeHttpRequests(auth -> auth
                // 允许匿名访问的接口
                .requestMatchers("/hello/**", "/auth/**", "/doc.html", "/swagger-ui/**", "/v3/api-docs/**", "/webjars/**").permitAll()
                // 其他接口需要认证
                .anyRequest().authenticated())
            // 禁用表单登录
            .formLogin(form -> form.disable())
            // 禁用 HTTP Basic
            .httpBasic(basic -> basic.disable());

        return http.build();
    }
}
