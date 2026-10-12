package com.light.butler.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.light.butler.entity.Invoice;

import java.util.List;
import java.util.Map;

/**
 * 发票 Service
 */
public interface InvoiceService extends IService<Invoice> {

    /**
     * 分页查询发票
     */
    IPage<Invoice> pageInvoices(Long userId, int page, int pageSize, Integer direction, Integer type, Long partyId);

    /**
     * 获取发票详情
     */
    Invoice getInvoice(Long userId, Long invoiceId);

    /**
     * 发票统计
     */
    Map<String, Object> getStatistics(Long userId, Integer year, Integer month);
}
