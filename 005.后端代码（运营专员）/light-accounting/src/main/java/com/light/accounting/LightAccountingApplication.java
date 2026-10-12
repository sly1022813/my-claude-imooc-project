package com.light.accounting;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 轻记账 - 主启动类
 *
 * @author Light Team
 */
@SpringBootApplication
@MapperScan("com.light.accounting.mapper")
public class LightAccountingApplication {

    public static void main(String[] args) {
        SpringApplication.run(LightAccountingApplication.class, args);
        System.out.println();
        System.out.println("╔═══════════════════════════════════════════════════════════╗");
        System.out.println("║                                                           ║");
        System.out.println("║        💕 轻记账后端服务启动成功！ 💕                   ║");
        System.out.println("║                                                           ║");
        System.out.println("║   API地址: http://localhost:8080/api                      ║");
        System.out.println("║   文档地址: http://localhost:8080/api/doc.html            ║");
        System.out.println("║                                                           ║");
        System.out.println("╚═══════════════════════════════════════════════════════════╝");
        System.out.println();
    }
}
