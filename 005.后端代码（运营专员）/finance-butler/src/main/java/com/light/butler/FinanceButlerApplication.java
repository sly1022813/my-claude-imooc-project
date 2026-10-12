package com.light.butler;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 财务管家 - 主启动类
 */
@SpringBootApplication
@MapperScan("com.light.butler.mapper")
public class FinanceButlerApplication {

    public static void main(String[] args) {
        SpringApplication.run(FinanceButlerApplication.class, args);
    }
}
