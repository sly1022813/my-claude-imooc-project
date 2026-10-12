package com.light.butler.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.light.butler.entity.ArBill;
import com.light.butler.entity.CollectionRecord;

import java.math.BigDecimal;
import java.util.List;

/**
 * 应收账款 Service
 */
public interface ArBillService extends IService<ArBill> {

    /**
     * 分页查询应收账单
     */
    IPage<ArBill> pageArBills(Long userId, int page, int pageSize, Long customerId, Integer status);

    /**
     * 获取应收账单详情
     */
    ArBill getArBill(Long userId, Long billId);

    /**
     * 核销应收账单（回款）
     */
    boolean writeOff(Long userId, Long billId, BigDecimal amount, CollectionRecord record);

    /**
     * 获取客户应收汇总
     */
    List<ArBill> getCustomerSummary(Long userId);

    /**
     * 逾期应收账单统计
     */
    long countOverdue(Long userId);
}
