# Proposal

## Why

项目目前的路由守卫是一个硬编码的白名单 Set，与路由定义分离，且几乎把所有页面（`/home`、`/test/*`）都放进了免登录名单，与"未登录无法跳转其他页面"的目标相矛盾。同时登录页只是占位、Sa-Token 的 token 流转（请求头回传、401 处理）尚未打通。需要一套完整的前端登录鉴权方案。

## What Changes

- 用**路由 meta 声明式白名单**替代硬编码 `WHITE_LIST`：路由通过 `meta.requiresAuth: false` 声明免登录，守卫读取叶子路由 meta 判定。
- 新增**单点组件守卫 `<AuthGuard>`**（方案 A），放在根布局中，用 `useMatches()` 读取最深叶子路由的 meta，未登录跳转 `/login`。
- 落地**登录页**：表单提交登录接口（接口待定），成功后取 Sa-Token 的 `tokenValue` 存入 localStorage，并跳转 `/home`。
- 打通 **Sa-Token 请求/响应拦截器**：请求头回传 `satoken`，响应收到 401/`code:401` 时清 token 并跳转 `/login`。
- 以 **localStorage 为 token 唯一真源**（key `satoken`），`use-user-store` 的 `token` 作为内存镜像。
- 移除守卫中 `?callback=` 回跳逻辑（登录后固定跳 `/home`）。
- 白名单默认仅保留 `/`（重定向）、`/login`、`/404`；其余路由（含 `/home`、`/test/*`）默认需登录。
- 第一版**不做 token 续期/无感刷新**，过期即跳登录。

## Capabilities

### New Capabilities

- `user-auth`: 前端登录鉴权能力，覆盖登录流程、token 存储与回传、路由访问控制（meta 白名单 + 守卫）及 401 失效处理。

### Modified Capabilities

<!-- 无现有 spec，此项留空 -->

## Impact

- **路由**：`src/router/index.tsx`（根布局挂载 AuthGuard）、`src/router/utils/`（删除硬编码 WHITE_LIST 与 loader 守卫，改造为 meta 守卫）、`src/types/router.d.ts`（`meta` 增加 `requiresAuth`）。
- **状态**：`src/store/modules/use-user-store.ts`（token 作为内存镜像，与 localStorage 同步）。
- **请求**：`src/services/service.ts`（请求头 `satoken` + 401 拦截）。
- **页面**：`src/views/test/login/`（真实登录表单，替换占位）。
- **接口**：`src/api/`（新增登录接口定义，接口地址待定）。
- **依赖**：无新增依赖。
