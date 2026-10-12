package com.light.butler.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.light.butler.entity.Customer;

/**
 * 客户 Service
 */
public interface CustomerService extends IService<Customer> {

    /**
     * 分页查询客户
     */
    IPage<Customer> pageCustomers(Long userId, int page, int pageSize, String keyword, Integer status, Boolean hasOutstanding);

    /**
     * 获取客户详情
     */
    Customer getCustomer(Long userId, Long customerId);
}
