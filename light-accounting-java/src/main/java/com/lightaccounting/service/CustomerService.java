package com.lightaccounting.service;

import com.lightaccounting.common.PageResult;
import com.lightaccounting.entity.Customer;
import com.lightaccounting.entity.Transaction;
import java.util.List;

public interface CustomerService {
    PageResult<Customer> getList(Long userId, Integer page, Integer pageSize, String keyword);
    Customer getById(Long id, Long userId);
    Customer create(Long userId, Customer customer);
    Customer update(Long id, Long userId, Customer customer);
    void delete(Long id, Long userId);
    List<Transaction> getTransactions(Long id, Long userId);
}
