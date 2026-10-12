package com.light.accounting.common;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;

/**
 * 统一响应结果
 *
 * @param <T> 数据类型
 */
@Data
@Schema(description = "统一响应结果")
public class Result<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 状态码
     */
    @Schema(description = "状态码，0表示成功")
    private int code;

    /**
     * 消息
     */
    @Schema(description = "响应消息")
    private String message;

    /**
     * 数据
     */
    @Schema(description = "响应数据")
    private T data;

    /**
     * 时间戳
     */
    @Schema(description = "响应时间戳")
    private long timestamp;

    /**
     * 成功响应（无数据）
     */
    public static <T> Result<T> success() {
        return success(null);
    }

    /**
     * 成功响应（有数据）
     */
    public static <T> Result<T> success(T data) {
        return success(data, "操作成功");
    }

    /**
     * 成功响应（自定义消息）
     */
    public static <T> Result<T> success(T data, String message) {
        Result<T> result = new Result<>();
        result.setCode(0);
        result.setMessage(message);
        result.setData(data);
        result.setTimestamp(System.currentTimeMillis());
        return result;
    }

    /**
     * 失败响应
     */
    public static <T> Result<T> error(String message) {
        return error(500, message);
    }

    /**
     * 失败响应（自定义状态码）
     */
    public static <T> Result<T> error(int code, String message) {
        Result<T> result = new Result<>();
        result.setCode(code);
        result.setMessage(message);
        result.setTimestamp(System.currentTimeMillis());
        return result;
    }

    /**
     * 业务失败响应
     */
    public static <T> Result<T> fail(String message) {
        return error(400, message);
    }

    /**
     * 业务失败响应（自定义状态码）
     */
    public static <T> Result<T> fail(int code, String message) {
        return error(code, message);
    }

    /**
     * 未授权
     */
    public static <T> Result<T> unauthorized(String message) {
        return error(401, message);
    }

    /**
     * 禁止访问
     */
    public static <T> Result<T> forbidden(String message) {
        return error(403, message);
    }

    /**
     * 资源不存在
     */
    public static <T> Result<T> notFound(String message) {
        return error(404, message);
    }
}
