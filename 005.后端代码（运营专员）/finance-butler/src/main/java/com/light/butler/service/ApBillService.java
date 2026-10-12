package com.light.butler.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.light.butler.entity.ApBill;
import com.light.butler.entity.PaymentRecord;

import java.math.BigDecimal;
import java.util.List;

/**
 * 应付账款 Service
 */
public interface ApBillService extends IService<ApBill> {

    /**
     * 分页查询应付账单
     */
    IPage<ApBill> pageApBills(Long userId, int page, int pageSize, Long supplierId, Integer status);

    /**
     * 获取应付账单详情
     */
    ApBill getApBill(Long userId, Long billId);

    /**
     * 核销应付账单（付款）
     */
    boolean writeOff(Long userId, Long billId, BigDecimal amount, PaymentRecord record);

    /**
     * 获取供应商应付汇总
     */
    List<ApBill> getSupplierSummary(Long userId);

    /**
     * 逾期应付账单统计
     */
    long countOverdue(Long userId);
}
