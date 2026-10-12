package com.light.butler.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.light.butler.entity.Supplier;
import com.light.butler.mapper.SupplierMapper;
import com.light.butler.service.SupplierService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * 供应商 Service 实现
 */
@Service
public class SupplierServiceImpl extends ServiceImpl<SupplierMapper, Supplier> implements SupplierService {

    @Override
    public IPage<Supplier> pageSuppliers(Long userId, int page, int pageSize, String keyword, Integer status, Boolean hasOutstanding) {
        Page<Supplier> pageParam = new Page<>(page, pageSize);
        LambdaQueryWrapper<Supplier> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Supplier::getUserId, userId);

        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(Supplier::getName, keyword)
                    .or().like(Supplier::getCode, keyword)
                    .or().like(Supplier::getContact, keyword));
        }

        if (status != null) {
            wrapper.eq(Supplier::getStatus, status);
        }

        if (hasOutstanding != null && hasOutstanding) {
            // 有欠款的供应商：应付余额 > 已付余额
            wrapper.apply("payable_balance > paid_balance");
        }

        wrapper.orderByDesc(Supplier::getCreatedAt);

        return this.page(pageParam, wrapper);
    }

    @Override
    public Supplier getSupplier(Long userId, Long supplierId) {
        LambdaQueryWrapper<Supplier> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Supplier::getUserId, userId)
                .eq(Supplier::getId, supplierId);
        return this.getOne(wrapper);
    }
}
