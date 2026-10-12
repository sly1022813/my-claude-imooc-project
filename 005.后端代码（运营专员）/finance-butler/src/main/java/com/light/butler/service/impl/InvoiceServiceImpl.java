package com.light.butler.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.light.butler.entity.Invoice;
import com.light.butler.mapper.InvoiceMapper;
import com.light.butler.service.InvoiceService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 发票 Service 实现
 */
@Service
public class InvoiceServiceImpl extends ServiceImpl<InvoiceMapper, Invoice> implements InvoiceService {

    @Override
    public IPage<Invoice> pageInvoices(Long userId, int page, int pageSize, Integer direction, Integer type, Long partyId) {
        Page<Invoice> pageParam = new Page<>(page, pageSize);
        LambdaQueryWrapper<Invoice> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Invoice::getUserId, userId);

        if (direction != null) {
            wrapper.eq(Invoice::getDirection, direction);
        }

        if (type != null) {
            wrapper.eq(Invoice::getType, type);
        }

        if (partyId != null) {
            wrapper.eq(Invoice::getCustomerId, partyId); // 同时适用于客户和供应商
        }

        wrapper.orderByDesc(Invoice::getInvoiceDate);

        return this.page(pageParam, wrapper);
    }

    @Override
    public Invoice getInvoice(Long userId, Long invoiceId) {
        LambdaQueryWrapper<Invoice> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Invoice::getUserId, userId)
                .eq(Invoice::getId, invoiceId);
        return this.getOne(wrapper);
    }

    @Override
    public Map<String, Object> getStatistics(Long userId, Integer year, Integer month) {
        LocalDate startDate, endDate;

        if (year != null && month != null) {
            startDate = LocalDate.of(year, month, 1);
            endDate = startDate.plusMonths(1).minusDays(1);
        } else {
            // 默认当月
            LocalDate now = LocalDate.now();
            startDate = now.withDayOfMonth(1);
            endDate = now;
        }

        LambdaQueryWrapper<Invoice> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Invoice::getUserId, userId)
                .ge(Invoice::getInvoiceDate, startDate)
                .le(Invoice::getInvoiceDate, endDate);

        List<Invoice> invoices = this.list(wrapper);

        BigDecimal salesAmount = BigDecimal.ZERO;      // 销项金额
        BigDecimal salesTax = BigDecimal.ZERO;         // 销项税额
        BigDecimal purchaseAmount = BigDecimal.ZERO;  // 进项金额
        BigDecimal purchaseTax = BigDecimal.ZERO;     // 进项税额

        for (Invoice invoice : invoices) {
            if (invoice.getDirection() == 1) { // 销项
                salesAmount = salesAmount.add(invoice.getAmount());
                salesTax = salesTax.add(invoice.getTaxAmount());
            } else { // 进项
                purchaseAmount = purchaseAmount.add(invoice.getAmount());
                purchaseTax = purchaseTax.add(invoice.getTaxAmount());
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("salesAmount", salesAmount);
        result.put("salesTax", salesTax);
        result.put("salesTotal", salesAmount.add(salesTax));
        result.put("purchaseAmount", purchaseAmount);
        result.put("purchaseTax", purchaseTax);
        result.put("purchaseTotal", purchaseAmount.add(purchaseTax));
        result.put("taxBalance", salesTax.subtract(purchaseTax)); // 税差
        result.put("invoiceCount", invoices.size());
        result.put("salesCount", invoices.stream().filter(i -> i.getDirection() == 1).count());
        result.put("purchaseCount", invoices.stream().filter(i -> i.getDirection() == 2).count());

        return result;
    }
}
