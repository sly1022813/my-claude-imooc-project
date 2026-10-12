package com.lightaccounting;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.lightaccounting.mapper")
public class LightAccountingApplication {
    public static void main(String[] args) {
        SpringApplication.run(LightAccountingApplication.class, args);
        System.out.println("");
        System.out.println("╔════════════════════════════════════════════════════════════╗");
        System.out.println("║                                                            ║");
        System.out.println("║           🎀 轻记账后端服务启动成功！ 🎀                   ║");
        System.out.println("║                                                            ║");
        System.out.println("║   服务地址: http://localhost:8080                          ║");
        System.out.println("║                                                            ║");
        System.out.println("╚════════════════════════════════════════════════════════════╝");
        System.out.println("");
    }
}
