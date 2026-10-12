package com.light.butler.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.light.butler.entity.Contract;

import java.util.List;

/**
 * 合同 Service
 */
public interface ContractService extends IService<Contract> {

    /**
     * 分页查询合同
     */
    IPage<Contract> pageContracts(Long userId, int page, int pageSize, Integer type, Integer status, Long partyId);

    /**
     * 获取合同详情
     */
    Contract getContract(Long userId, Long contractId);

    /**
     * 获取即将到期的合同
     */
    List<Contract> getExpiringContracts(Long userId, int days);
}
