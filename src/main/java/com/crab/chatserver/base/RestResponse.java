package com.crab.chatserver.base;

public final class RestResponse<T> {
    /**
     * 成功代码
     */
    public final static int CODE_SUCCESS = 0;
    /**
     * 普通错误代码
     */
    public final static int CODE_NORMAL_ERROR = 1;


    /**
     * 返回码
     */
    private Integer code;

    /**
     * 出错消息
     */
    private String message;

    /**
     * 数据
     */
    private T data;

    /**
     * 不允许外部创建对象
     */
    private RestResponse(Integer code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    /**
     * 成功返回
     *
     * @param data 数据
     * @param <T>  数据类型
     */
    public static <T> RestResponse<T> success(T data) {
        return success(null, data);
    }

    /**
     * 成功返回
     *
     * @param data 数据
     * @param <T>  数据类型
     */
    public static <T> RestResponse<T> success(String message, T data) {
        return new RestResponse<>(CODE_SUCCESS, message, data);
    }

    /**
     * 错误返回
     *
     * @param message 错误消息
     */
    public static RestResponse error(String message) {
        return error(CODE_NORMAL_ERROR, message);
    }

    /**
     * 错误返回
     *
     * @param code    出错码
     * @param message 错误消息
     */
    public static RestResponse error(Integer code, String message) {
        if (code == null || code == CODE_SUCCESS) {
            code = CODE_NORMAL_ERROR;
        }
        return new RestResponse<>(code, message, null);
    }

    public static <T> RestResponse<T> message(Integer code, String message, T data) {
        return new RestResponse<>(code, message, data);
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
