# Design

## Context

现有代码已有一版路由守卫雏形（`src/router/utils/index.ts` 中的 `WHITE_LIST` + `loader`），但存在 token 数据源分裂（守卫读 localStorage、store 另存 token）、白名单硬编码且几乎全开放、登录页为空壳、Sa-Token 请求头未打通等问题。后端使用 Sa-Token 鉴权（登录接口地址待定）。动机详见 proposal.md。

## Goals / Non-Goals

**Goals:**
- 用 meta 声明式白名单 + 单点组件守卫替代硬编码 Set。
- 打通 Sa-Token 的 token 存储、请求回传、401 失效处理的完整链路。
- 以 localStorage 为 token 唯一真源。

**Non-Goals:**
- 不做 token 续期 / 无感刷新（过期即跳登录）。
- 不做多角色 / 权限细分（仅登录与否）。
- 不实现记住密码、第三方登录等。

## Decisions

### D1: 守卫采用单点组件 + `useMatches()` 读叶子路由 meta（方案 A）

- **选型**：在根布局路由中放 `<AuthGuard><Outlet/></AuthGuard>`，内部用 `useMatches()` 取最后一个匹配项的 `meta.requiresAuth` 判定。
- **理由**：meta 白名单的本质是"路由自声明身份"，`useMatches()` 天然拿到最深叶子路由，规避了"父路由 `/test` 无 meta 默认拦截、挡住免登录子路由"的嵌套坑；逻辑集中一处。
- **备选**：沿用 loader 守卫（方案 B），但需额外判断"是否叶子路由"来跳过父路由，且 loader 难以简洁地读到当前匹配路由的 meta。

### D2: token 以 localStorage 为唯一真源，store 做内存镜像

- **选型**：key 用 `satoken`（与 Sa-Token 默认 tokenName 对齐），守卫、请求拦截器、store 三处都从 localStorage 读。`use-user-store` 的 `token` 仅作内存镜像，`updateToken` 时同步写 localStorage。
- **理由**：避免现在"守卫读 localStorage、store 另存 token"的分裂；Sa-Token token 值无敏感负载，放 localStorage 是常规做法。
- **备选**：zustand `persist` 中间件持久化。更统一但需改守卫读取方式，且对"守卫在组件渲染前的同步读取"帮助不大，本场景收益低。

### D3: Sa-Token 请求头约定

- **选型**：请求拦截器读 localStorage 的 `satoken`，写入 `config.headers['satoken']`。
- **理由**：Sa-Token 默认从 `satoken` 头读取 token（`tokenName=satoken`），而非 `Authorization: Bearer`。若后端改了 tokenName，只需同步改一处 header 名。
- **备选**：`Authorization: Bearer`——Sa-Token 默认不读，会踩坑。

### D4: 401 统一失效处理

- **选型**：响应拦截器捕获 HTTP 401 或业务 `code: 401`，清除 localStorage token（及 store 镜像）后跳 `/login`。
- **理由**：这是后端未登录/过期的统一信号；需与后端约定异常处理返回 401（而非 Sa-Token 默认的 500）。

### D5: 登录成功后固定跳 `/home`，移除 `?callback=` 回跳

- **选型**：登录成功后 `router.push('/home')`，守卫与拦截器跳登录不再携带 `callback` 参数。
- **理由**：需求明确固定跳首页，回跳逻辑成为多余复杂度。

### D6: 白名单默认范围

- **选型**：仅 `/`（重定向）、`/login`、`/404` 标记 `requiresAuth: false`，其余（含 `/home`、`/test/*`）默认需登录。
- **理由**：符合"未登录无法跳转其他页面"的语义；meta 缺省 `requiresAuth` 未定义即视为需登录，减少声明负担。

## Risks / Trade-offs

- [Sa-Token 默认未登录返回 500 而非 401] → 与后端明确约定全局异常处理统一返回 401（或 `code:401`），否则失效检测失效。
- [token 存 localStorage 有 XSS 读取风险] → 本模板场景可接受；如后续安全要求提高，再迁移 httpOnly cookie（需后端配合 Set-Cookie）。
- [登录接口未定] → 登录接口定义、请求/响应字段（`tokenValue`）先按 Sa-Token 约定实现，待后端确定后微调。
- [`/test/*` 改为需登录可能影响现有调试] → 属预期行为变更；需要调试时临时给某测试页加 `requiresAuth: false` 即可。

## Open Questions

- 登录接口地址与最终请求/响应字段名（Sa-Token 返回的 `tokenValue`/`tokenName`）以后端实际为准。
- localStorage key 是否最终用 `satoken`（若后端自定义 tokenName 则同步调整）。
