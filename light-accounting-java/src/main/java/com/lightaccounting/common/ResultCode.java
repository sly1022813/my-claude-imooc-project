package com.lightaccounting.common;

public class ResultCode {
    // 成功
    public static final Integer SUCCESS = 0;

    // 认证模块错误码 1001-1999
    public static final Integer USERNAME_OR_PASSWORD_ERROR = 1001;
    public static final Integer ACCOUNT_DISABLED = 1002;
    public static final Integer LOGIN_LOCKED = 1003;

    // 注册模块错误码 2001-2999
    public static final Integer USERNAME_EXISTS = 2001;
    public static final Integer PASSWORD_NOT_MATCH = 2003;

    // 密码模块错误码 3001-3999
    public static final Integer OLD_PASSWORD_ERROR = 3001;

    // 分类模块错误码 4001-4999
    public static final Integer CATEGORY_NOT_EXISTS = 4001;
    public static final Integer CATEGORY_TYPE_MISMATCH = 4002;
}
