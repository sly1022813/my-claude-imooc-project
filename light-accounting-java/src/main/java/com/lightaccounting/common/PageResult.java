package com.lightaccounting.common;

import lombok.Data;
import java.util.List;

@Data
public class PageResult<T> {
    private List<T> list;
    private Pagination pagination;

    @Data
    public static class Pagination {
        private Long total;
        private Integer page;
        private Integer pageSize;
        private Integer totalPages;
    }

    public static <T> PageResult<T> of(List<T> list, Long total, Integer page, Integer pageSize) {
        PageResult<T> result = new PageResult<>();
        result.setList(list);

        Pagination pagination = new Pagination();
        pagination.setTotal(total);
        pagination.setPage(page);
        pagination.setPageSize(pageSize);
        pagination.setTotalPages((int) Math.ceil((double) total / pageSize));
        result.setPagination(pagination);

        return result;
    }
}
