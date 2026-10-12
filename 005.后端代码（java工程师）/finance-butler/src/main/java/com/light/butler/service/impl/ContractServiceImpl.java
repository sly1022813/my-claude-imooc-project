package com.light.butler.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.light.butler.entity.Contract;
import com.light.butler.mapper.ContractMapper;
import com.light.butler.service.ContractService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * 合同 Service 实现
 */
@Service
public class ContractServiceImpl extends ServiceImpl<ContractMapper, Contract> implements ContractService {

    @Override
    public IPage<Contract> pageContracts(Long userId, int page, int pageSize, Integer type, Integer status, Long partyId) {
        Page<Contract> pageParam = new Page<>(page, pageSize);
        LambdaQueryWrapper<Contract> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Contract::getUserId, userId);

        if (type != null) {
            wrapper.eq(Contract::getType, type);
        }

        if (status != null) {
            wrapper.eq(Contract::getStatus, status);
        }

        if (partyId != null) {
            wrapper.and(w -> w.eq(Contract::getCustomerId, partyId)
                    .or().eq(Contract::getSupplierId, partyId));
        }

        wrapper.orderByDesc(Contract::getCreatedAt);

        return this.page(pageParam, wrapper);
    }

    @Override
    public Contract getContract(Long userId, Long contractId) {
        LambdaQueryWrapper<Contract> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Contract::getUserId, userId)
                .eq(Contract::getId, contractId);
        return this.getOne(wrapper);
    }

    @Override
    public List<Contract> getExpiringContracts(Long userId, int days) {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(days);

        LambdaQueryWrapper<Contract> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Contract::getUserId, userId)
                .eq(Contract::getStatus, 3) // 执行中
                .ge(Contract::getEndDate, today)
                .le(Contract::getEndDate, endDate)
                .orderByAsc(Contract::getEndDate);

        return this.list(wrapper);
    }
}
