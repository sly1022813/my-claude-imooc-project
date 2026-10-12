package com.light.butler.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.light.butler.entity.Supplier;

/**
 * 供应商 Service
 */
public interface SupplierService extends IService<Supplier> {

    /**
     * 分页查询供应商
     */
    IPage<Supplier> pageSuppliers(Long userId, int page, int pageSize, String keyword, Integer status, Boolean hasOutstanding);

    /**
     * 获取供应商详情
     */
    Supplier getSupplier(Long userId, Long supplierId);
}
