package com.lightaccounting.controller;

import com.lightaccounting.common.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/health")
    public Result<Map<String, Object>> health() {
        return Result.success(Map.of(
                "version", "1.0.0",
                "timestamp", LocalDateTime.now().toString()
        ), "服务运行正常");
    }
}
