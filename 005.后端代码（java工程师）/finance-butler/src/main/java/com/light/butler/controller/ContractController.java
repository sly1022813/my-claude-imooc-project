package com.light.butler.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.light.butler.common.Result;
import com.light.butler.entity.Contract;
import com.light.butler.service.ContractService;
import com.light.butler.utils.JwtUtils;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 合同 Controller
 */
@RestController
@RequestMapping("/contracts")
@Tag(name = "合同管理", description = "合同相关接口")
@SecurityRequirement(name = "bearerAuth")
public class ContractController {

    private final ContractService contractService;
    private final JwtUtils jwtUtils;

    public ContractController(ContractService contractService, JwtUtils jwtUtils) {
        this.contractService = contractService;
        this.jwtUtils = jwtUtils;
    }

    @GetMapping
    @Operation(summary = "分页查询合同")
    public Result<IPage<Contract>> listContracts(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页数量") @RequestParam(defaultValue = "10") int pageSize,
            @Parameter(description = "类型") @RequestParam(required = false) Integer type,
            @Parameter(description = "状态") @RequestParam(required = false) Integer status,
            @Parameter(description = "对方ID") @RequestParam(required = false) Long partyId) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        IPage<Contract> result = contractService.pageContracts(userId, page, pageSize, type, status, partyId);
        return Result.success(result);
    }

    @GetMapping("/{id}")
    @Operation(summary = "获取合同详情")
    public Result<Contract> getContract(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "合同ID") @PathVariable Long id) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        Contract contract = contractService.getContract(userId, id);
        return contract != null ? Result.success(contract) : Result.error("合同不存在");
    }

    @PostMapping
    @Operation(summary = "新增合同")
    public Result<Void> createContract(
            @RequestHeader("Authorization") String token,
            @RequestBody Contract contract) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        contract.setUserId(userId);
        contract.setExecutedAmount(java.math.BigDecimal.ZERO);
        contract.setStatus(1); // 拟定中
        contractService.save(contract);
        return Result.success("创建成功", null);
    }

    @PutMapping("/{id}")
    @Operation(summary = "更新合同")
    public Result<Void> updateContract(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "合同ID") @PathVariable Long id,
            @RequestBody Contract contract) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        contract.setId(id);
        contract.setUserId(userId);
        contractService.updateById(contract);
        return Result.success("更新成功", null);
    }

    @GetMapping("/expiring")
    @Operation(summary = "获取即将到期的合同")
    public Result<List<Contract>> getExpiringContracts(
            @RequestHeader("Authorization") String token,
            @Parameter(description = "天数") @RequestParam(defaultValue = "30") int days) {
        Long userId = jwtUtils.getUserIdFromToken(token.replace("Bearer ", ""));
        List<Contract> result = contractService.getExpiringContracts(userId, days);
        return Result.success(result);
    }
}
