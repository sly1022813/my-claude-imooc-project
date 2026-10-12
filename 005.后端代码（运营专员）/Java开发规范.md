# Java/Spring Boot 企业级开发规范

> **版本**: v1.0.0  
> **维护团队**: 财务管家技术部  
> **最后更新**: 2026-10-09

---

## 目录

1. [项目结构规范](#1-项目结构规范)
2. [命名规范](#2-命名规范)
3. [代码编写规范](#3-代码编写规范)
4. [注释规范](#4-注释规范)
5. [Controller 层规范](#5-controller-层规范)
6. [Service 层规范](#6-service-层规范)
7. [Mapper 层规范](#7-mapper-层规范)
8. [DTO/VO/Entity 规范](#8-dtovoentity-规范)
9. [API 设计规范](#9-api-设计规范)
10. [数据库设计规范](#10-数据库设计规范)
11. [配置管理规范](#11-配置管理规范)
12. [异常处理规范](#12-异常处理规范)
13. [日志规范](#13-日志规范)
14. [安全规范](#14-安全规范)
15. [Git 提交规范](#15-git-提交规范)
16. [单元测试规范](#16-单元测试规范)
17. [代码审查清单](#17-代码审查清单)

---

## 1. 项目结构规范

### 1.1 标准项目结构

```
project-name/
├── src/
│   ├── main/
│   │   ├── java/com/company/project/
│   │   │   ├── config/                    # 配置类
│   │   │   │   ├── AppConfig.java        # 业务配置
│   │   │   │   ├── WebConfig.java        # Web配置
│   │   │   │   ├── SecurityConfig.java   # 安全配置
│   │   │   │   └── OpenApiConfig.java    # API文档配置
│   │   │   ├── common/                    # 通用类
│   │   │   │   ├── Constant.java         # 常量
│   │   │   │   ├── Result.java           # 统一返回
│   │   │   │   ├── PageResult.java      # 分页结果
│   │   │   │   └── enums/               # 枚举类
│   │   │   ├── controller/               # 控制器
│   │   │   ├── service/                  # 服务层
│   │   │   │   ├── UserService.java     # 接口
│   │   │   │   └── impl/                # 实现
│   │   │   ├── mapper/                   # 数据访问层
│   │   │   ├── entity/                   # 实体类
│   │   │   ├── dto/                      # 数据传输对象
│   │   │   ├── vo/                       # 视图对象
│   │   │   ├── query/                    # 查询参数
│   │   │   ├── util/                     # 工具类
│   │   │   ├── exception/                # 自定义异常
│   │   │   ├── aspect/                   # 切面类
│   │   │   └── filter/                   # 过滤器
│   │   └── resources/
│   │       ├── mapper/                   # MyBatis XML
│   │       ├── application.yml           # 主配置
│   │       ├── application-dev.yml      # 开发环境
│   │       ├── application-prod.yml     # 生产环境
│   │       └── schema.sql               # 数据库脚本
│   └── test/
│       └── java/                        # 测试代码
├── docs/                                # 项目文档
├── pom.xml                              # Maven配置
└── README.md                            # 项目说明
```

### 1.2 模块划分原则

```
# 按业务模块划分（大项目推荐）
├── module-user/        # 用户模块
├── module-order/      # 订单模块
├── module-product/    # 产品模块
└── module-common/     # 公共模块
```

### 1.3 层级依赖规则

```
Controller → Service → Mapper/Entity
              ↓
           DTO/VO
              ↓
           Entity
```

**原则**：上层可以依赖下层，下层不能依赖上层；同层之间不能循环依赖。

---

## 2. 命名规范

### 2.1 包名命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 公司域名 | 反写，全部小写 | `com.light` |
| 项目名 | 全部小写 | `finance-butler` |
| 模块名 | 全部小写 | `controller`, `service` |
| 功能包 | 全部小写 | `user`, `customer` |

```java
package com.light.financebutler.controller.user;
package com.light.financebutler.service.customer;
```

### 2.2 类名命名

| 类型 | 规范 | 示例 |
|------|------|------|
| Controller | `XxxController` | `UserController`, `OrderController` |
| Service 接口 | `XxxService` | `UserService`, `OrderService` |
| Service 实现 | `XxxServiceImpl` | `UserServiceImpl`, `OrderServiceImpl` |
| Mapper 接口 | `XxxMapper` | `UserMapper`, `OrderMapper` |
| Entity | `Xxx` | `User`, `Order`, `ArBill` |
| DTO | `XxxDTO` | `LoginDTO`, `UserDTO` |
| VO | `XxxVO` | `UserVO`, `OrderVO` |
| Query | `XxxQuery` | `UserQuery`, `OrderQuery` |
| 枚举类 | `XxxEnum` | `StatusEnum`, `TypeEnum` |
| 异常类 | `XxxException` | `BusinessException` |
| 配置类 | `XxxConfig` | `SecurityConfig` |
| 工具类 | `XxxUtil` / `XxxUtils` | `StringUtil`, `DateUtils` |

### 2.3 方法命名

| 操作 | 规范 | 示例 |
|------|------|------|
| 查询单个 | `get` + 名称 | `getUserById()`, `getCustomer()` |
| 查询列表 | `list` + 名称 | `listUsers()`, `listOrders()` |
| 分页查询 | `page` + 名称 | `pageUsers()`, `pageOrders()` |
| 保存 | `save` / `create` | `saveUser()`, `createOrder()` |
| 更新 | `update` / `modify` | `updateUser()`, `modifyOrder()` |
| 删除 | `remove` / `delete` | `removeUser()`, `deleteOrder()` |
| 统计数量 | `count` | `countUsers()` |
| 判断存在 | `exists` | `existsUserById()` |
| 导出 | `export` | `exportUsers()` |
| 导入 | `import` | `importUsers()` |
| 上传 | `upload` | `uploadFile()` |
| 下载 | `download` | `downloadFile()` |

### 2.4 变量命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 普通变量 | camelCase | `userName`, `orderId`, `totalAmount` |
| 常量 | 全大写下划线分隔 | `MAX_RETRY_COUNT`, `DEFAULT_PAGE_SIZE` |
| 布尔变量 | is/has/can 前缀 | `isActive`, `hasPermission`, `canEdit` |
| 集合变量 | 复数或 List/Set/Map 后缀 | `users`, `userList`, `userMap` |
| Map变量 | k/v 或 key/value 后缀 | `userMap`, `dataMap` |

### 2.5 数据库命名

| 类型 | 规范 | 示例 |
|------|------|------|
| 表名 | 小写下划线分隔，复数 | `fb_users`, `fb_ar_bills` |
| 字段名 | 小写下划线分隔 | `user_id`, `created_at` |
| 索引名 | `idx_` + 表名 + 字段 | `idx_users_username` |
| 唯一索引 | `uk_` + 表名 + 字段 | `uk_users_username` |
| 外键 | `fk_` + 表名 | `fk_orders_user_id` |

---

## 3. 代码编写规范

### 3.1 类编写规范

```java
// ✅ 正确示例
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "用户管理", description = "用户相关接口")
public class UserController {

    private final UserService userService;

    @GetMapping("/{id}")
    @Operation(summary = "获取用户详情")
    public Result<UserVO> getUser(@PathVariable Long id) {
        UserVO user = userService.getUserById(id);
        return Result.success(user);
    }
}

// ❌ 错误示例
@RestController
public class UserController {
    UserService userService;  // 没有使用 final

    @GetMapping("/{id}")  // 没有注释
    public Object getUser(Long id) {  // 返回类型不明确
        return new Result(200, "成功", userService.getUser(id));
    }
}
```

### 3.2 方法编写规范

```java
// ✅ 正确示例：方法体简洁，参数清晰
public UserVO getUserById(Long userId) {
    return userService.getUserById(userId);
}

// ❌ 错误示例：方法体过长，职责不单一
public Object getUser(Long id, String name, Integer age, String email, 
                      String phone, String address, Integer status) {
    // 几百行业务逻辑...
    return result;
}
```

### 3.3 代码格式化

```java
// ✅ 正确：使用 IntelliJ IDEA 默认格式化
public void formatMethod(String parameter1, String parameter2, 
                         String parameter3) {
    if (condition1 && condition2) {
        doSomething();
    }
}

// ❌ 错误：参数对齐混乱
public void formatMethod(String parameter1,
                       String parameter2,
                 String parameter3) {
    if (condition1
        && condition2) {
        doSomething();
    }
}
```

### 3.4 禁止的写法

```java
// ❌ 禁止：魔法值
if (status == 1) { }  // 应该使用枚举或常量

// ❌ 禁止：循环嵌套过深（超过3层）
for (...) {
    for (...) {
        for (...) {
            doSomething();
        }
    }
}

// ❌ 禁止：在循环中进行数据库/网络操作
for (User user : users) {
    saveToDB(user);  // 应该批量操作
}

// ❌ 禁止：catch 后不做任何处理
try {
    doSomething();
} catch (Exception e) {
    // 空catch
}

// ❌ 禁止：使用 Select *
List<User> users = userMapper.selectList(null);  // 应该指定字段

// ❌ 禁止：硬编码返回
return new Result(200, "成功", data);  // 应该使用静态工厂方法
return Result.success(data);
```

---

## 4. 注释规范

### 4.1 类注释

```java
/**
 * 用户服务实现类
 *
 * <p>负责处理用户相关的业务逻辑，包括：
 * <ul>
 *   <li>用户注册与登录</li>
 *   <li>用户信息管理</li>
 *   <li>用户权限控制</li>
 * </ul>
 *
 * @author zhangsan
 * @version 1.0.0
 * @since 2024-01-01
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    // ...
}
```

### 4.2 方法注释

```java
/**
 * 根据用户ID获取用户详情
 *
 * @param userId 用户ID
 * @return 用户信息
 * @throws BusinessException 用户不存在时抛出
 */
public UserVO getUserById(Long userId) {
    User user = userMapper.selectById(userId);
    if (user == null) {
        throw new BusinessException("用户不存在");
    }
    return convertToVO(user);
}
```

### 4.3 行内注释

```java
// ✅ 单行注释：解释 why，不解释 what
// 由于历史原因，余额字段存储单位为分
Integer balance = user.getBalance();

// ❌ 错误：解释 what（代码本身已经说明）
// 将用户年龄加1
user.setAge(user.getAge() + 1);
```

### 4.4 枚举注释

```java
@Getter
@AllArgsConstructor
public enum StatusEnum {

    /**
     * 禁用
     */
    DISABLED(0, "禁用"),

    /**
     * 启用
     */
    ENABLED(1, "启用");

    private final Integer code;
    private final String description;
}
```

### 4.5 字段注释

```java
/**
 * 用户类型：1=个人, 2=个体户, 3=企业
 */
@Schema(description = "用户类型：1=个人, 2=个体户, 3=企业")
private Integer userType;

/**
 * 创建时间
 */
@TableField(fill = FieldFill.INSERT)
@Schema(description = "创建时间")
private LocalDateTime createdAt;
```

---

## 5. Controller 层规范

### 5.1 基本规范

```java
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "用户管理", description = "用户相关接口")
public class UserController {

    private final UserService userService;

    /**
     * 分页查询用户列表
     */
    @GetMapping
    @Operation(summary = "分页查询用户")
    @PreAuthorize("@ss.hasPermission('user:list')")
    public Result<PageResult<UserVO>> pageUsers(UserQuery query) {
        PageResult<UserVO> result = userService.pageUsers(query);
        return Result.success(result);
    }

    /**
     * 获取用户详情
     */
    @GetMapping("/{id}")
    @Operation(summary = "获取用户详情")
    @PreAuthorize("@ss.hasPermission('user:read')")
    public Result<UserVO> getUser(@PathVariable Long id) {
        UserVO user = userService.getUserById(id);
        return Result.success(user);
    }

    /**
     * 创建用户
     */
    @PostMapping
    @Operation(summary = "创建用户")
    @PreAuthorize("@ss.hasPermission('user:create')")
    public Result<Long> createUser(@Valid @RequestBody UserDTO dto) {
        Long userId = userService.createUser(dto);
        return Result.success(userId);
    }

    /**
     * 更新用户
     */
    @PutMapping("/{id}")
    @Operation(summary = "更新用户")
    @PreAuthorize("@ss.hasPermission('user:update')")
    public Result<Void> updateUser(@PathVariable Long id,
                                   @Valid @RequestBody UserDTO dto) {
        dto.setId(id);
        userService.updateUser(dto);
        return Result.success("更新成功", null);
    }

    /**
     * 删除用户
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "删除用户")
    @PreAuthorize("@ss.hasPermission('user:delete')")
    public Result<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return Result.success("删除成功", null);
    }
}
```

### 5.2 参数校验规范

```java
/**
 * 创建用户 - 完整参数校验示例
 */
@PostMapping
public Result<Long> createUser(
        @RequestBody @Valid UserDTO dto,      // DTO 内校验
        BindingResult bindingResult           // 手动校验结果
) {
    // 手动校验
    if (bindingResult.hasErrors()) {
        String message = bindingResult.getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        return Result.badRequest(message);
    }
    
    Long userId = userService.createUser(dto);
    return Result.success(userId);
}
```

### 5.3 DTO 参数校验示例

```java
@Data
@Schema(description = "用户创建DTO")
public class UserDTO {

    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 20, message = "用户名长度3-20位")
    @Schema(description = "用户名")
    private String username;

    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 20, message = "密码长度6-20位")
    @Schema(description = "密码")
    private String password;

    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    @Schema(description = "手机号")
    private String phone;

    @Email(message = "邮箱格式不正确")
    @Schema(description = "邮箱")
    private String email;
}
```

---

## 6. Service 层规范

### 6.1 Service 接口规范

```java
/**
 * 用户服务接口
 */
public interface UserService {

    /**
     * 分页查询用户
     */
    PageResult<UserVO> pageUsers(UserQuery query);

    /**
     * 根据ID获取用户
     */
    UserVO getUserById(Long userId);

    /**
     * 创建用户
     */
    Long createUser(UserDTO dto);

    /**
     * 更新用户
     */
    void updateUser(UserDTO dto);

    /**
     * 删除用户
     */
    void deleteUser(Long userId);
}
```

### 6.2 Service 实现规范

```java
/**
 * 用户服务实现类
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(rollbackFor = Exception.class)
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserVO getUserById(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        return convertToVO(user);
    }

    @Override
    public Long createUser(UserDTO dto) {
        // 1. 校验用户名唯一性
        if (existsByUsername(dto.getUsername())) {
            throw new BusinessException("用户名已存在");
        }

        // 2. 构建实体
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        user.setNickname(dto.getNickname());
        user.setPhone(dto.getPhone());
        user.setEmail(dto.getEmail());
        user.setStatus(1);

        // 3. 保存
        userMapper.insert(user);

        log.info("创建用户成功: userId={}, username={}", user.getId(), user.getUsername());

        return user.getId();
    }

    @Override
    public void updateUser(UserDTO dto) {
        // 校验用户存在
        User user = userMapper.selectById(dto.getId());
        if (user == null) {
            throw new BusinessException("用户不存在");
        }

        // 更新字段
        if (dto.getNickname() != null) {
            user.setNickname(dto.getNickname());
        }
        if (dto.getPhone() != null) {
            user.setPhone(dto.getPhone());
        }

        userMapper.updateById(user);

        log.info("更新用户成功: userId={}", dto.getId());
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        // 业务校验：是否有关联数据
        int count = orderMapper.countByUserId(userId);
        if (count > 0) {
            throw new BusinessException("该用户存在关联订单，无法删除");
        }

        userMapper.deleteById(userId);
        log.info("删除用户成功: userId={}", userId);
    }

    /**
     * 判断用户名是否存在
     */
    private boolean existsByUsername(String username) {
        return userMapper.selectCount(
            new LambdaQueryWrapper<User>().eq(User::getUsername, username)
        ) > 0;
    }

    /**
     * 实体转VO
     */
    private UserVO convertToVO(User user) {
        UserVO vo = new UserVO();
        vo.setId(user.getId());
        vo.setUsername(user.getUsername());
        vo.setNickname(user.getNickname());
        vo.setPhone(user.getPhone());
        vo.setEmail(user.getEmail());
        vo.setCreatedAt(user.getCreatedAt());
        return vo;
    }
}
```

### 6.3 事务规范

```java
// ✅ 默认：所有异常都回滚
@Transactional(rollbackFor = Exception.class)

// ✅ 指定异常回滚
@Transactional(rollbackFor = {BusinessException.class, SystemException.class})

// ✅ 指定异常不回滚
@Transactional(noRollbackFor = BusinessException.class)

// ❌ 错误：在 private 方法上使用事务（无效）
@Transactional
private void doSomething() { }
```

---

## 7. Mapper 层规范

### 7.1 Mapper 接口规范

```java
/**
 * 用户 Mapper
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {

    /**
     * 根据用户名查询
     */
    default User selectByUsername(String username) {
        return selectOne(
            new LambdaQueryWrapper<User>()
                .eq(User::getUsername, username)
        );
    }

    /**
     * 条件查询用户列表
     */
    default List<User> selectByCondition(UserQuery query) {
        return selectList(
            new LambdaQueryWrapper<User>()
                .like(StringUtils.hasText(query.getUsername()), User::getUsername, query.getUsername())
                .eq(query.getStatus() != null, User::getStatus, query.getStatus())
                .between(query.getStartDate() != null && query.getEndDate() != null,
                    User::getCreatedAt, query.getStartDate(), query.getEndDate())
                .orderByDesc(User::getCreatedAt)
        );
    }
}
```

### 7.2 复杂查询 XML 规范

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" 
    "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.light.financebutler.mapper.UserMapper">

    <resultMap id="BaseResultMap" type="com.light.financebutler.entity.User">
        <id column="id" property="id"/>
        <result column="username" property="username"/>
        <result column="nickname" property="nickname"/>
        <result column="created_at" property="createdAt"/>
    </resultMap>

    <select id="selectUserPage" resultMap="BaseResultMap">
        SELECT id, username, nickname, created_at
        FROM fb_users
        <where>
            <if test="username != null and username != ''">
                AND username LIKE CONCAT('%', #{username}, '%')
            </if>
            <if test="status != null">
                AND status = #{status}
            </if>
        </where>
        ORDER BY created_at DESC
    </select>

</mapper>
```

---

## 8. DTO/VO/Entity 规范

### 8.1 各层职责

| 类型 | 职责 | 层级 |
|------|------|------|
| Entity | 数据库表映射 | Mapper → Service |
| DTO | 接收前端请求数据 | Controller → Service |
| VO | 返回给前端的数据 | Service → Controller |
| Query | 查询条件参数 | Controller → Service → Mapper |

### 8.2 Entity 规范

```java
@Data
@TableName("fb_users")
@EqualsAndHashCode(callSuper = true)
@Schema(description = "用户实体")
public class User extends BaseEntity {

    @TableId(type = IdType.AUTO)
    @Schema(description = "用户ID")
    private Long id;

    @Schema(description = "用户名")
    private String username;

    @Schema(description = "密码哈希")
    private String passwordHash;

    @Schema(description = "昵称")
    private String nickname;

    @Schema(description = "手机号")
    private String phone;
}
```

### 8.3 DTO 规范

```java
/**
 * 创建用户请求
 */
@Data
@Schema(description = "创建用户请求")
public class CreateUserDTO {

    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 20)
    @Schema(description = "用户名")
    private String username;

    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 20)
    @Schema(description = "密码")
    private String password;

    @Schema(description = "昵称")
    private String nickname;
}

/**
 * 更新用户请求
 */
@Data
@Schema(description = "更新用户请求")
public class UpdateUserDTO {

    @NotNull(message = "用户ID不能为空")
    @Schema(description = "用户ID")
    private Long id;

    @Schema(description = "昵称")
    private String nickname;

    @Schema(description = "手机号")
    private String phone;
}
```

### 8.4 VO 规范

```java
/**
 * 用户视图对象
 */
@Data
@Builder
@Schema(description = "用户视图对象")
public class UserVO {

    @Schema(description = "用户ID")
    private Long id;

    @Schema(description = "用户名")
    private String username;

    @Schema(description = "昵称")
    private String nickname;

    @Schema(description = "手机号")
    private String phone;

    @Schema(description = "邮箱")
    private String email;

    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    @Schema(description = "状态")
    private Integer status;

    @Schema(description = "状态描述")
    private String statusText;
}
```

### 8.5 Query 规范

```java
/**
 * 用户查询条件
 */
@Data
@Builder
@Schema(description = "用户查询条件")
public class UserQuery {

    @Parameter(description = "页码")
    @RequestParam(defaultValue = "1")
    private Long page = 1L;

    @Parameter(description = "每页数量")
    @RequestParam(defaultValue = "10")
    private Long pageSize = 10L;

    @Parameter(description = "关键词")
    private String keyword;

    @Parameter(description = "状态")
    private Integer status;

    @Parameter(description = "开始日期")
    private LocalDate startDate;

    @Parameter(description = "结束日期")
    private LocalDate endDate;
}
```

---

## 9. API 设计规范

### 9.1 RESTful 规范

| 操作 | HTTP方法 | URL | 说明 |
|------|----------|-----|------|
| 查询列表 | GET | `/users` | 分页查询 |
| 查询单个 | GET | `/users/{id}` | 获取详情 |
| 创建 | POST | `/users` | 新增 |
| 完整更新 | PUT | `/users/{id}` | 全量更新 |
| 部分更新 | PATCH | `/users/{id}` | 部分更新 |
| 删除 | DELETE | `/users/{id}` | 删除 |

### 9.2 统一响应格式

```java
{
    "code": 200,
    "message": "操作成功",
    "data": { ... },
    "timestamp": 1699999999999
}
```

### 9.3 HTTP 状态码使用

| 状态码 | 说明 | 使用场景 |
|--------|------|----------|
| 200 | OK | 成功 |
| 201 | Created | 创建成功 |
| 204 | No Content | 删除成功（无返回体） |
| 400 | Bad Request | 参数错误 |
| 401 | Unauthorized | 未登录 |
| 403 | Forbidden | 无权限 |
| 404 | Not Found | 资源不存在 |
| 409 | Conflict | 资源冲突（如重复） |
| 500 | Internal Server Error | 服务器错误 |

### 9.4 分页响应格式

```java
{
    "code": 200,
    "message": "操作成功",
    "data": {
        "total": 100,
        "page": 1,
        "pageSize": 10,
        "totalPages": 10,
        "records": [...]
    },
    "timestamp": 1699999999999
}
```

### 9.5 错误响应格式

```java
{
    "code": 400,
    "message": "参数校验失败",
    "data": {
        "field": "username",
        "error": "用户名不能为空"
    },
    "timestamp": 1699999999999
}
```

---

## 10. 数据库设计规范

### 10.1 表设计规范

```sql
-- 1. 表名使用小写下划线，复数形式
CREATE TABLE fb_users (...);

-- 2. 必须包含的字段
CREATE TABLE fb_users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    deleted TINYINT DEFAULT 0 COMMENT '逻辑删除'
);

-- 3. 索引规范
INDEX idx_users_username (username),      -- 普通索引
UNIQUE INDEX uk_users_phone (phone),     -- 唯一索引
INDEX idx_users_status_created (status, created_at)  -- 组合索引

-- 4. 字段命名
user_id, user_name, created_at, updated_at, deleted
```

### 10.2 字段类型选择

| 数据类型 | 使用场景 | 示例 |
|----------|----------|------|
| BIGINT | 主键、金额 | `id`, `amount` |
| INT | 状态、类型 | `status`, `type` |
| VARCHAR(50) | 短文本 | `username`, `phone` |
| VARCHAR(255) | 中等文本 | `password`, `email` |
| VARCHAR(1000) | 长文本 | `remark`, `description` |
| TEXT | 富文本 | `content`, `detail` |
| DECIMAL(15,2) | 精确金额 | `amount`, `price` |
| DATETIME | 日期时间 | `created_at`, `expire_at` |
| DATE | 日期 | `birth_date`, `start_date` |

### 10.3 命名规范

```sql
-- ✅ 正确
CREATE TABLE fb_users (...);
CREATE TABLE fb_ar_bills (...);
CREATE TABLE fb_collection_records (...);

-- ❌ 错误
CREATE TABLE FB_USERS (...);
CREATE TABLE User (...);
CREATE TABLE TBL_USER (...);
```

---

## 11. 配置管理规范

### 11.1 多环境配置

```yaml
# application.yml - 主配置（公共配置）
spring:
  application:
    name: finance-butler

# application-dev.yml - 开发环境
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/finance_butler
    username: root
    password: root

# application-prod.yml - 生产环境
spring:
  datasource:
    url: jdbc:mysql://prod-db.example.com:3306/finance_butler
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
```

### 11.2 敏感配置管理

```yaml
# ❌ 错误：硬编码敏感信息
jwt:
  secret: my-secret-key-123456

# ✅ 正确：使用环境变量
jwt:
  secret: ${JWT_SECRET}
```

### 11.3 配置类规范

```java
@Configuration
@ConfigurationProperties(prefix = "jwt")
@Data
@Schema(description = "JWT配置")
public class JwtConfig {

    @Schema(description = "JWT密钥")
    private String secret;

    @Min(3600000)
    @Schema(description = "过期时间(ms)")
    private Long expiration;
}
```

---

## 12. 异常处理规范

### 12.1 自定义异常

```java
/**
 * 业务异常
 */
@Getter
@AllArgsConstructor
public class BusinessException extends RuntimeException {
    
    private final Integer code;
    private final String message;
    
    public BusinessException(String message) {
        this(500, message);
    }
}

/**
 * 资源不存在异常
 */
public class NotFoundException extends BusinessException {
    
    public NotFoundException(String resource, Long id) {
        super(404, resource + "不存在: " + id);
    }
}

/**
 * 权限不足异常
 */
public class ForbiddenException extends BusinessException {
    
    public ForbiddenException(String message) {
        super(403, message);
    }
}
```

### 12.2 全局异常处理

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * 业务异常
     */
    @ExceptionHandler(BusinessException.class)
    public Result<Void> handleBusinessException(BusinessException e) {
        log.warn("业务异常: {}", e.getMessage());
        return Result.error(e.getCode(), e.getMessage());
    }

    /**
     * 参数校验异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<Void> handleValidationException(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        return Result.badRequest(message);
    }

    /**
     * 权限异常
     */
    @ExceptionHandler(AccessDeniedException.class)
    public Result<Void> handleAccessDeniedException(AccessDeniedException e) {
        return Result.forbidden("没有权限访问该资源");
    }

    /**
     * 其他异常
     */
    @ExceptionHandler(Exception.class)
    public Result<Void> handleException(Exception e) {
        log.error("系统异常", e);
        return Result.error("系统错误，请稍后重试");
    }
}
```

---

## 13. 日志规范

### 13.1 日志级别使用

| 级别 | 使用场景 |
|------|----------|
| DEBUG | 开发调试，细节信息 |
| INFO | 正常业务流程，关键节点 |
| WARN | 警告信息，可恢复的异常 |
| ERROR | 错误信息，需要关注的问题 |

### 13.2 日志输出规范

```java
// ✅ 正确：使用占位符
log.info("创建用户成功: userId={}, username={}", userId, username);
log.warn("用户不存在: userId={}", userId);
log.error("数据库操作失败", e);

// ❌ 错误：字符串拼接
log.info("创建用户成功: userId=" + userId);
log.error("错误: " + e.getMessage());
```

### 13.3 敏感信息处理

```java
// ❌ 错误：打印敏感信息
log.info("用户登录: username={}, password={}", username, password);

// ✅ 正确：脱敏处理
log.info("用户登录: username={}", username);
```

### 13.4 日志规范示例

```java
@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Override
    public Long createUser(CreateUserDTO dto) {
        log.info("开始创建用户: username={}", dto.getUsername());
        
        try {
            // 业务逻辑
            Long userId = doCreateUser(dto);
            
            log.info("创建用户成功: userId={}, username={}", userId, dto.getUsername());
            return userId;
        } catch (BusinessException e) {
            log.warn("创建用户业务异常: username={}, error={}", dto.getUsername(), e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("创建用户系统异常: username={}", dto.getUsername(), e);
            throw new BusinessException("创建用户失败");
        }
    }
}
```

---

## 14. 安全规范

### 14.1 接口安全

```java
@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // 公开接口
                .requestMatchers("/auth/**", "/hello/**").permitAll()
                // 需要登录
                .requestMatchers("/user/**").authenticated()
                // 需要特定权限
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()));

        return http.build();
    }
}
```

### 14.2 数据安全

```java
// ✅ 密码必须加密存储
user.setPasswordHash(passwordEncoder.encode(rawPassword));

// ✅ 密码比对使用加密算法
if (passwordEncoder.matches(rawPassword, storedHash)) {
    // 登录成功
}

// ✅ 敏感数据脱敏返回
public String maskPhone(String phone) {
    if (phone == null || phone.length() < 7) {
        return phone;
    }
    return phone.substring(0, 3) + "****" + phone.substring(phone.length() - 4);
}
```

### 14.3 SQL 注入防护

```java
// ✅ 正确：使用参数化查询
@Select("SELECT * FROM users WHERE username = #{username}")
User selectByUsername(@Param("username") String username);

// ❌ 错误：字符串拼接
@Select("SELECT * FROM users WHERE username = '" + username + "'")
```

### 14.4 XSS 防护

```java
// ✅ 对用户输入进行 HTML 转义
String safeContent = HtmlUtils.htmlEscape(userInput);

// ✅ 使用 Spring 的 @Validated 进行参数校验
@PostMapping
public Result<Void> createUser(@Valid @RequestBody UserDTO dto) {
    // 框架自动校验
}
```

---

## 15. Git 提交规范

### 15.1 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 15.2 Type 类型

| Type | 说明 |
|------|------|
| feat | 新功能 |
| fix | 修复bug |
| docs | 文档变更 |
| style | 代码格式（不影响功能） |
| refactor | 重构 |
| perf | 性能优化 |
| test | 测试相关 |
| chore | 构建/工具变更 |

### 15.3 提交示例

```bash
# 功能开发
git commit -m "feat(user): 添加用户注册接口"

# Bug修复
git commit -m "fix(order): 修复订单支付状态更新异常"

# 重构
git commit -m "refactor(auth): 重构JWT认证逻辑"

# 文档更新
git commit -m "docs(readme): 更新项目说明文档"

# 多行提交信息
git commit -m "feat(api): 新增财务统计接口

- 添加月度和年度统计功能
- 支持按客户和供应商维度统计
- 优化查询性能

Closes #123"
```

### 15.4 分支命名规范

| 类型 | 格式 | 示例 |
|------|------|------|
| 主分支 | `main` | 主分支 |
| 开发分支 | `develop` | 开发分支 |
| 功能分支 | `feature/xxx` | `feature/user-module` |
| 修复分支 | `fix/xxx` | `fix/login-bug` |
| 发布分支 | `release/v1.0.0` | `release/v1.0.0` |

---

## 16. 单元测试规范

### 16.1 测试类命名

```java
// 被测试类
UserServiceImpl

// 对应测试类
UserServiceImplTest
UserServiceImplTest
```

### 16.2 测试方法命名

```java
@Test
void getUserById_WhenUserExists_ReturnUser() { }

@Test
void getUserById_WhenUserNotExists_ThrowException() { }

@Test
void createUser_WithValidData_Success() { }

@Test
void createUser_WithDuplicateUsername_ThrowException() { }
```

### 16.3 测试示例

```java
@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void getUserById_WhenUserExists_ReturnUser() {
        // Given
        Long userId = 1L;
        User user = new User();
        user.setId(userId);
        user.setUsername("test");
        
        when(userMapper.selectById(userId)).thenReturn(user);

        // When
        User result = userService.getUserById(userId);

        // Then
        assertNotNull(result);
        assertEquals(userId, result.getId());
        assertEquals("test", result.getUsername());
    }

    @Test
    void getUserById_WhenUserNotExists_ThrowException() {
        // Given
        Long userId = 999L;
        when(userMapper.selectById(userId)).thenReturn(null);

        // When & Then
        assertThrows(BusinessException.class, () -> userService.getUserById(userId));
    }
}
```

### 16.4 测试覆盖率要求

| 模块 | 最低覆盖率 |
|------|------------|
| Service 层 | 80% |
| Controller 层 | 70% |
| 核心业务逻辑 | 90% |

---

## 17. 代码审查清单

### 17.1 代码格式

- [ ] 代码符合项目统一的格式化规范
- [ ] 没有未使用的 import
- [ ] 没有硬编码的魔法值
- [ ] 没有空的 catch 块
- [ ] 没有 System.out.println

### 17.2 命名规范

- [ ] 类名符合规范
- [ ] 方法名符合规范
- [ ] 变量名符合规范
- [ ] 包名符合规范

### 17.3 业务逻辑

- [ ] 参数校验完整
- [ ] 边界条件处理正确
- [ ] 异常处理得当
- [ ] 事务使用正确
- [ ] 没有 SQL 注入风险
- [ ] 敏感数据已脱敏

### 17.4 性能

- [ ] 没有 N+1 查询问题
- [ ] 循环中没有数据库操作
- [ ] 大数据量查询有分页
- [ ] 合理使用缓存

### 17.5 安全

- [ ] 权限校验完整
- [ ] 敏感信息不记录日志
- [ ] 密码加密存储
- [ ] 输入参数校验

### 17.6 可维护性

- [ ] 代码简洁清晰
- [ ] 方法长度适中（<80行）
- [ ] 类职责单一
- [ ] 注释完整
- [ ] 接口向后兼容

---

## 附录

### A. 常用工具类

| 工具类 | 说明 |
|--------|------|
| `Objects.requireNonNull()` | 非空校验 |
| `StringUtils.hasText()` | 字符串非空判断 |
| `CollectionUtils.isEmpty()` | 集合非空判断 |
| `BeanUtils.copyProperties()` | 对象属性复制 |
| `JSON.toJSONString()` | JSON序列化 |
| `LocalDateTime.now()` | 获取当前时间 |

### B. 常用注解

| 注解 | 来源 | 说明 |
|------|------|------|
| `@RestController` | Spring | REST控制器 |
| `@Service` | Spring | 服务层组件 |
| `@Mapper` | MyBatis | Mapper组件 |
| `@Transactional` | Spring | 事务控制 |
| `@Valid` | Bean Validation | 参数校验 |
| `@Schema` | Swagger | API文档 |
| `@TableName` | MyBatis-Plus | 表名映射 |

### C. 参考资料

- [阿里巴巴Java开发手册](https://github.com/alibaba/p3c)
- [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)
- [Spring Boot Best Practices](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [REST API Design Rulebook](https://restfulapi.net/)

---

**文档版本记录**

| 版本 | 日期 | 修改内容 | 作者 |
|------|------|----------|------|
| v1.0.0 | 2026-10-09 | 初始版本 | Claude |
