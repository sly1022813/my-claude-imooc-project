package com.light.butler.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.light.butler.entity.Customer;
import com.light.butler.mapper.CustomerMapper;
import com.light.butler.service.CustomerService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;

/**
 * 客户 Service 实现
 */
@Service
public class CustomerServiceImpl extends ServiceImpl<CustomerMapper, Customer> implements CustomerService {

    @Override
    public IPage<Customer> pageCustomers(Long userId, int page, int pageSize, String keyword, Integer status, Boolean hasOutstanding) {
        Page<Customer> pageParam = new Page<>(page, pageSize);
        LambdaQueryWrapper<Customer> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Customer::getUserId, userId);

        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(Customer::getName, keyword)
                    .or().like(Customer::getCode, keyword)
                    .or().like(Customer::getContact, keyword));
        }

        if (status != null) {
            wrapper.eq(Customer::getStatus, status);
        }

        if (hasOutstanding != null && hasOutstanding) {
            // 有欠款的客户：应收余额 > 已收余额
            wrapper.apply("receivable_balance > received_balance");
        }

        wrapper.orderByDesc(Customer::getCreatedAt);

        return this.page(pageParam, wrapper);
    }

    @Override
    public Customer getCustomer(Long userId, Long customerId) {
        LambdaQueryWrapper<Customer> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Customer::getUserId, userId)
                .eq(Customer::getId, customerId);
        return this.getOne(wrapper);
    }
}
