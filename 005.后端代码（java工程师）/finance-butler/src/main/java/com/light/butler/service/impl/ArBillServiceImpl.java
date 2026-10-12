package com.light.butler.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.light.butler.entity.ArBill;
import com.light.butler.entity.CollectionRecord;
import com.light.butler.entity.Customer;
import com.light.butler.mapper.ArBillMapper;
import com.light.butler.mapper.CollectionRecordMapper;
import com.light.butler.mapper.CustomerMapper;
import com.light.butler.service.ArBillService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 应收账款 Service 实现
 */
@Service
public class ArBillServiceImpl extends ServiceImpl<ArBillMapper, ArBill> implements ArBillService {

    private final CollectionRecordMapper collectionRecordMapper;
    private final CustomerMapper customerMapper;

    public ArBillServiceImpl(CollectionRecordMapper collectionRecordMapper, CustomerMapper customerMapper) {
        this.collectionRecordMapper = collectionRecordMapper;
        this.customerMapper = customerMapper;
    }

    @Override
    public IPage<ArBill> pageArBills(Long userId, int page, int pageSize, Long customerId, Integer status) {
        Page<ArBill> pageParam = new Page<>(page, pageSize);
        LambdaQueryWrapper<ArBill> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ArBill::getUserId, userId);

        if (customerId != null) {
            wrapper.eq(ArBill::getCustomerId, customerId);
        }

        if (status != null) {
            wrapper.eq(ArBill::getStatus, status);
        }

        wrapper.orderByDesc(ArBill::getCreatedAt);

        return this.page(pageParam, wrapper);
    }

    @Override
    public ArBill getArBill(Long userId, Long billId) {
        LambdaQueryWrapper<ArBill> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ArBill::getUserId, userId)
                .eq(ArBill::getId, billId);
        return this.getOne(wrapper);
    }

    @Override
    @Transactional
    public boolean writeOff(Long userId, Long billId, BigDecimal amount, CollectionRecord record) {
        ArBill bill = this.getArBill(userId, billId);
        if (bill == null) {
            throw new RuntimeException("账单不存在");
        }

        // 更新账单
        BigDecimal newWrittenOff = bill.getWrittenOffAmount().add(amount);
        BigDecimal newPending = bill.getAmount().subtract(newWrittenOff);

        LambdaUpdateWrapper<ArBill> updateWrapper = new LambdaUpdateWrapper<>();
        updateWrapper.eq(ArBill::getId, billId)
                .set(ArBill::getWrittenOffAmount, newWrittenOff)
                .set(ArBill::getPendingAmount, newPending.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : newPending)
                .set(ArBill::getStatus, newPending.compareTo(BigDecimal.ZERO) <= 0 ? 4 : 3); // 4=已核销, 3=部分核销
        this.update(updateWrapper);

        // 保存回款记录
        record.setUserId(userId);
        record.setArBillId(billId);
        collectionRecordMapper.insert(record);

        // 更新客户已收余额
        LambdaUpdateWrapper<Customer> customerWrapper = new LambdaUpdateWrapper<>();
        customerWrapper.eq(Customer::getId, bill.getCustomerId())
                .setSql("received_balance = received_balance + " + amount);
        customerMapper.update(null, customerWrapper);

        return true;
    }

    @Override
    public List<ArBill> getCustomerSummary(Long userId) {
        LambdaQueryWrapper<ArBill> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ArBill::getUserId, userId)
                .ne(ArBill::getStatus, 4) // 排除已核销
                .orderByDesc(ArBill::getDueDate);
        return this.list(wrapper);
    }

    @Override
    public long countOverdue(Long userId) {
        LambdaQueryWrapper<ArBill> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ArBill::getUserId, userId)
                .eq(ArBill::getStatus, 5); // 5=逾期
        return this.count(wrapper);
    }
}
