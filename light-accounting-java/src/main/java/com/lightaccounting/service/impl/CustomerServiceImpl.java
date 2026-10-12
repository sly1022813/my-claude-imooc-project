package com.lightaccounting.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lightaccounting.common.PageResult;
import com.lightaccounting.entity.Customer;
import com.lightaccounting.entity.Transaction;
import com.lightaccounting.mapper.CustomerMapper;
import com.lightaccounting.mapper.TransactionMapper;
import com.lightaccounting.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerMapper customerMapper;
    private final TransactionMapper transactionMapper;

    @Override
    public PageResult<Customer> getList(Long userId, Integer page, Integer pageSize, String keyword) {
        Page<Customer> pageParam = new Page<>(page != null ? page : 1, pageSize != null ? pageSize : 20);
        QueryWrapper<Customer> wrapper = new QueryWrapper<>();
        wrapper.eq("user_id", userId);

        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like("name", keyword).or().like("phone", keyword));
        }

        wrapper.orderByDesc("created_at");

        Page<Customer> result = customerMapper.selectPage(pageParam, wrapper);
        return PageResult.of(result.getRecords(), result.getTotal(), (int) result.getCurrent(), (int) result.getSize());
    }

    @Override
    public Customer getById(Long id, Long userId) {
        Customer customer = customerMapper.findById(id, userId);
        if (customer == null) {
            throw new BusinessException(404, "客户不存在");
        }
        return customer;
    }

    @Override
    @Transactional
    public Customer create(Long userId, Customer customer) {
        customer.setUserId(userId);
        customer.setStatus(1);
        customer.setTotalTransaction(java.math.BigDecimal.ZERO);
        customer.setOutstandingAmount(java.math.BigDecimal.ZERO);
        customerMapper.insert(customer);
        return customer;
    }

    @Override
    @Transactional
    public Customer update(Long id, Long userId, Customer customer) {
        Customer existing = getById(id, userId);

        if (customer.getName() != null) existing.setName(customer.getName());
        if (customer.getPhone() != null) existing.setPhone(customer.getPhone());
        if (customer.getAddress() != null) existing.setAddress(customer.getAddress());
        if (customer.getCustomerType() != null) existing.setCustomerType(customer.getCustomerType());
        if (customer.getCreditLimit() != null) existing.setCreditLimit(customer.getCreditLimit());
        if (customer.getRemark() != null) existing.setRemark(customer.getRemark());
        if (customer.getStatus() != null) existing.setStatus(customer.getStatus());

        customerMapper.updateById(existing);
        return existing;
    }

    @Override
    @Transactional
    public void delete(Long id, Long userId) {
        getById(id, userId);
        customerMapper.deleteById(id);
    }

    @Override
    public List<Transaction> getTransactions(Long id, Long userId) {
        getById(id, userId);
        // 获取该客户的所有交易记录
        QueryWrapper<Transaction> wrapper = new QueryWrapper<>();
        wrapper.eq("user_id", userId);
        wrapper.eq("counterparty_type", 1);
        wrapper.eq("counterparty_id", id);
        wrapper.orderByDesc("date");
        wrapper.last("LIMIT 100");
        return transactionMapper.selectList(wrapper);
    }
}
