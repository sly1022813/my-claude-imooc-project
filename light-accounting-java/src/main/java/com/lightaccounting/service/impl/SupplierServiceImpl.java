package com.lightaccounting.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lightaccounting.common.PageResult;
import com.lightaccounting.entity.Supplier;
import com.lightaccounting.entity.Transaction;
import com.lightaccounting.mapper.SupplierMapper;
import com.lightaccounting.mapper.TransactionMapper;
import com.lightaccounting.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierServiceImpl implements SupplierService {

    private final SupplierMapper supplierMapper;
    private final TransactionMapper transactionMapper;

    @Override
    public PageResult<Supplier> getList(Long userId, Integer page, Integer pageSize, String keyword) {
        Page<Supplier> pageParam = new Page<>(page != null ? page : 1, pageSize != null ? pageSize : 20);
        QueryWrapper<Supplier> wrapper = new QueryWrapper<>();
        wrapper.eq("user_id", userId);

        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like("name", keyword).or().like("phone", keyword));
        }

        wrapper.orderByDesc("created_at");

        Page<Supplier> result = supplierMapper.selectPage(pageParam, wrapper);
        return PageResult.of(result.getRecords(), result.getTotal(), (int) result.getCurrent(), (int) result.getSize());
    }

    @Override
    public Supplier getById(Long id, Long userId) {
        Supplier supplier = supplierMapper.findById(id, userId);
        if (supplier == null) {
            throw new BusinessException(404, "供应商不存在");
        }
        return supplier;
    }

    @Override
    @Transactional
    public Supplier create(Long userId, Supplier supplier) {
        supplier.setUserId(userId);
        supplier.setStatus(1);
        supplier.setTotalPurchase(java.math.BigDecimal.ZERO);
        supplier.setOutstandingAmount(java.math.BigDecimal.ZERO);
        supplierMapper.insert(supplier);
        return supplier;
    }

    @Override
    @Transactional
    public Supplier update(Long id, Long userId, Supplier supplier) {
        Supplier existing = getById(id, userId);

        if (supplier.getName() != null) existing.setName(supplier.getName());
        if (supplier.getPhone() != null) existing.setPhone(supplier.getPhone());
        if (supplier.getAddress() != null) existing.setAddress(supplier.getAddress());
        if (supplier.getContactPerson() != null) existing.setContactPerson(supplier.getContactPerson());
        if (supplier.getProducts() != null) existing.setProducts(supplier.getProducts());
        if (supplier.getSettlementType() != null) existing.setSettlementType(supplier.getSettlementType());
        if (supplier.getRemark() != null) existing.setRemark(supplier.getRemark());
        if (supplier.getStatus() != null) existing.setStatus(supplier.getStatus());

        supplierMapper.updateById(existing);
        return existing;
    }

    @Override
    @Transactional
    public void delete(Long id, Long userId) {
        getById(id, userId);
        supplierMapper.deleteById(id);
    }

    @Override
    public List<Transaction> getTransactions(Long id, Long userId) {
        getById(id, userId);
        QueryWrapper<Transaction> wrapper = new QueryWrapper<>();
        wrapper.eq("user_id", userId);
        wrapper.eq("counterparty_type", 2);
        wrapper.eq("counterparty_id", id);
        wrapper.orderByDesc("date");
        wrapper.last("LIMIT 100");
        return transactionMapper.selectList(wrapper);
    }
}
