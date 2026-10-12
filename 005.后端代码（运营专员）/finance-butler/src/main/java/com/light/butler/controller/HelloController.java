package com.light.butler.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Hello World 测试 Controller
 */
@RestController
@RequestMapping("/hello")
public class HelloController {

    @GetMapping
    public Map<String, Object> hello() {
        Map<String, Object> result = new HashMap<>();
        result.put("message", "Hello, 财务管家!");
        result.put("status", "success");
        result.put("timestamp", LocalDateTime.now().toString());
        result.put("version", "1.0.0");
        return result;
    }

    @GetMapping("/world")
    public String helloWorld() {
        return "Hello World! 欢迎使用财务管家 API";
    }

    @GetMapping("/info")
    public Map<String, Object> info() {
        Map<String, Object> info = new HashMap<>();
        info.put("name", "财务管家 (Finance Butler)");
        info.put("description", "企业财务管理系统后端API");
        info.put("version", "1.0.0");
        info.put("author", "财务管家团队");
        info.put("apiDoc", "http://localhost:8081/api/doc.html");
        return info;
    }
}
