package com.lightaccounting.service;

import com.lightaccounting.common.PageResult;
import com.lightaccounting.entity.Supplier;
import com.lightaccounting.entity.Transaction;
import java.util.List;

public interface SupplierService {
    PageResult<Supplier> getList(Long userId, Integer page, Integer pageSize, String keyword);
    Supplier getById(Long id, Long userId);
    Supplier create(Long userId, Supplier supplier);
    Supplier update(Long id, Long userId, Supplier supplier);
    void delete(Long id, Long userId);
    List<Transaction> getTransactions(Long id, Long userId);
}
