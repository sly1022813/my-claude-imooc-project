package com.lightaccounting.common;

import lombok.Data;

@Data
public class Result<T> {
    private Integer code;
    private Boolean success;
    private String message;
    private T data;

    public static <T> Result<T> success(T data) {
        return success(data, "操作成功");
    }

    public static <T> Result<T> success(T data, String message) {
        Result<T> result = new Result<>();
        result.setCode(0);
        result.setSuccess(true);
        result.setMessage(message);
        result.setData(data);
        return result;
    }

    public static <T> Result<T> success(String message) {
        return success(null, message);
    }

    public static <T> Result<T> error(String message) {
        return error(500, message);
    }

    public static <T> Result<T> error(Integer code, String message) {
        Result<T> result = new Result<>();
        result.setCode(code);
        result.setSuccess(false);
        result.setMessage(message);
        return result;
    }

    public static <T> Result<T> businessError(String message, Integer code) {
        return error(code, message);
    }
}
