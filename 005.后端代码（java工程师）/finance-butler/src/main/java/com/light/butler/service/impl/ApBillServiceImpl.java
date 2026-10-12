package com.light.butler.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.light.butler.entity.ApBill;
import com.light.butler.entity.PaymentRecord;
import com.light.butler.entity.Supplier;
import com.light.butler.mapper.ApBillMapper;
import com.light.butler.mapper.PaymentRecordMapper;
import com.light.butler.mapper.SupplierMapper;
import com.light.butler.service.ApBillService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * 应付账款 Service 实现
 */
@Service
public class ApBillServiceImpl extends ServiceImpl<ApBillMapper, ApBill> implements ApBillService {

    private final PaymentRecordMapper paymentRecordMapper;
    private final SupplierMapper supplierMapper;

    public ApBillServiceImpl(PaymentRecordMapper paymentRecordMapper, SupplierMapper supplierMapper) {
        this.paymentRecordMapper = paymentRecordMapper;
        this.supplierMapper = supplierMapper;
    }

    @Override
    public IPage<ApBill> pageApBills(Long userId, int page, int pageSize, Long supplierId, Integer status) {
        Page<ApBill> pageParam = new Page<>(page, pageSize);
        LambdaQueryWrapper<ApBill> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ApBill::getUserId, userId);

        if (supplierId != null) {
            wrapper.eq(ApBill::getSupplierId, supplierId);
        }

        if (status != null) {
            wrapper.eq(ApBill::getStatus, status);
        }

        wrapper.orderByDesc(ApBill::getCreatedAt);

        return this.page(pageParam, wrapper);
    }

    @Override
    public ApBill getApBill(Long userId, Long billId) {
        LambdaQueryWrapper<ApBill> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ApBill::getUserId, userId)
                .eq(ApBill::getId, billId);
        return this.getOne(wrapper);
    }

    @Override
    @Transactional
    public boolean writeOff(Long userId, Long billId, BigDecimal amount, PaymentRecord record) {
        ApBill bill = this.getApBill(userId, billId);
        if (bill == null) {
            throw new RuntimeException("账单不存在");
        }

        // 更新账单
        BigDecimal newWrittenOff = bill.getWrittenOffAmount().add(amount);
        BigDecimal newPending = bill.getAmount().subtract(newWrittenOff);

        LambdaUpdateWrapper<ApBill> updateWrapper = new LambdaUpdateWrapper<>();
        updateWrapper.eq(ApBill::getId, billId)
                .set(ApBill::getWrittenOffAmount, newWrittenOff)
                .set(ApBill::getPendingAmount, newPending.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : newPending)
                .set(ApBill::getStatus, newPending.compareTo(BigDecimal.ZERO) <= 0 ? 4 : 3);
        this.update(updateWrapper);

        // 保存付款记录
        record.setUserId(userId);
        record.setApBillId(billId);
        paymentRecordMapper.insert(record);

        // 更新供应商已付余额
        LambdaUpdateWrapper<Supplier> supplierWrapper = new LambdaUpdateWrapper<>();
        supplierWrapper.eq(Supplier::getId, bill.getSupplierId())
                .setSql("paid_balance = paid_balance + " + amount);
        supplierMapper.update(null, supplierWrapper);

        return true;
    }

    @Override
    public List<ApBill> getSupplierSummary(Long userId) {
        LambdaQueryWrapper<ApBill> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ApBill::getUserId, userId)
                .ne(ApBill::getStatus, 4)
                .orderByDesc(ApBill::getDueDate);
        return this.list(wrapper);
    }

    @Override
    public long countOverdue(Long userId) {
        LambdaQueryWrapper<ApBill> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ApBill::getUserId, userId)
                .eq(ApBill::getStatus, 5);
        return this.count(wrapper);
    }
}
