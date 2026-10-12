package com.light.accounting.common;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * 分页结果
 *
 * @param <T> 数据类型
 */
@Data
@Schema(description = "分页结果")
public class PageResult<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 数据列表
     */
    @Schema(description = "数据列表")
    private List<T> list;

    /**
     * 总记录数
     */
    @Schema(description = "总记录数")
    private long total;

    /**
     * 当前页
     */
    @Schema(description = "当前页")
    private long page;

    /**
     * 每页大小
     */
    @Schema(description = "每页大小")
    private long pageSize;

    /**
     * 总页数
     */
    @Schema(description = "总页数")
    private long totalPages;

    /**
     * 是否有上一页
     */
    @Schema(description = "是否有上一页")
    private boolean hasPrevious;

    /**
     * 是否有下一页
     */
    @Schema(description = "是否有下一页")
    private boolean hasNext;

    /**
     * 创建分页结果
     */
    public static <T> PageResult<T> of(List<T> list, long total, long page, long pageSize) {
        PageResult<T> result = new PageResult<>();
        result.setList(list);
        result.setTotal(total);
        result.setPage(page);
        result.setPageSize(pageSize);
        result.setTotalPages((total + pageSize - 1) / pageSize);
        result.setHasPrevious(page > 1);
        result.setHasNext(page * pageSize < total);
        return result;
    }
}
