package com.light.butler.common;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * 分页结果
 */
@Data
@Schema(description = "分页结果")
public class PageResult<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 总记录数
     */
    @Schema(description = "总记录数")
    private Long total;

    /**
     * 当前页
     */
    @Schema(description = "当前页")
    private Long page;

    /**
     * 每页大小
     */
    @Schema(description = "每页大小")
    private Long pageSize;

    /**
     * 总页数
     */
    @Schema(description = "总页数")
    private Long totalPages;

    /**
     * 数据列表
     */
    @Schema(description = "数据列表")
    private List<T> records;

    public PageResult() {
    }

    public PageResult(Long total, Long page, Long pageSize, List<T> records) {
        this.total = total;
        this.page = page;
        this.pageSize = pageSize;
        this.totalPages = (total + pageSize - 1) / pageSize;
        this.records = records;
    }

    /**
     * 构建分页结果
     */
    public static <T> PageResult<T> of(Long total, Long page, Long pageSize, List<T> records) {
        return new PageResult<>(total, page, pageSize, records);
    }
}
