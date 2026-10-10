# Spec Delta

## Purpose

定义前端登录鉴权行为：未登录用户被限制访问受保护页面，登录后获得访问权限，并通过 Sa-Token 令牌维持会话状态。

## ADDED Requirements

### Requirement: 受保护路由的访问控制
未登录用户访问受保护路由时，系统 SHALL 重定向到登录页；已登录用户 SHALL 正常访问。

#### Scenario: 未登录访问受保护路由
- **WHEN** 用户未持有 token 且访问一个 `meta.requiresAuth` 不为 `false` 的路由
- **THEN** 系统重定向到 `/login`

#### Scenario: 已登录访问受保护路由
- **WHEN** 用户持有有效 token 且访问受保护路由
- **THEN** 系统正常渲染该路由对应页面

### Requirement: 白名单路由免登录访问
标记为免登录的路由（`meta.requiresAuth: false`）SHALL 无需 token 即可访问。

#### Scenario: 未登录访问白名单路由
- **WHEN** 用户未持有 token 且访问 `meta.requiresAuth: false` 的路由（如 `/login`、`/404`）
- **THEN** 系统正常渲染该路由对应页面，不触发重定向

### Requirement: 登录成功跳转首页
用户登录成功后，系统 SHALL 保存令牌并跳转到首页 `/home`。

#### Scenario: 登录成功
- **WHEN** 用户提交登录表单且后端返回成功（含 `tokenValue`）
- **THEN** 系统存储 token 并跳转到 `/home`

#### Scenario: 登录失败
- **WHEN** 后端返回登录失败（如用户名或密码错误）
- **THEN** 系统不跳转，并向用户展示失败提示

### Requirement: 请求自动携带令牌
已登录状态下发起的接口请求 SHALL 自动携带 Sa-Token 令牌。

#### Scenario: 已登录发起请求
- **WHEN** 用户已持有 token 并触发任意接口请求
- **THEN** 请求头携带 Sa-Token 令牌（`satoken` 头）

### Requirement: 登录态失效处理
当后端返回未登录/过期（HTTP 401 或 `code: 401`）时，系统 SHALL 清除本地 token 并重定向到登录页。

#### Scenario: 令牌过期或失效
- **WHEN** 接口响应返回 401（或业务 `code: 401`）
- **THEN** 系统清除本地 token 并重定向到 `/login`

### Requirement: 登录态持久化
登录状态 SHALL 在页面刷新后保持。

#### Scenario: 刷新页面保持登录态
- **WHEN** 已登录用户刷新页面
- **THEN** 系统从持久化存储恢复 token，用户仍处于登录态
