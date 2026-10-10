# Tasks

## 1. 路由 meta 类型与 token 存储基础

- [x] 1.1 在 `src/types/router.d.ts` 的 `RouteObject.meta` 增加 `requiresAuth?: boolean`，验证 `pnpm typecheck` 通过
- [x] 1.2 新增 token 读写工具（localStorage key `satoken` 的 get/set/clear），并让 `use-user-store` 的 `updateToken` 同步写 localStorage，验证调用后 localStorage 中 `satoken` 正确写入

## 2. 路由守卫改造（meta 白名单 + AuthGuard）

- [x] 2.1 新增 `<AuthGuard>` 组件（`useMatches()` 读最深叶子路由 `meta.requiresAuth`，未登录渲染 `<Navigate to="/login" />`），验证未登录访问受保护路由跳转 `/login`
- [x] 2.2 在 `src/router/index.tsx` 根布局挂载 `<AuthGuard>` 包裹 `<Outlet/>`，验证白名单路由（`/login`、`/404`）未登录可正常访问
- [x] 2.3 给白名单路由（`/login`、`/404`）设置 `meta.requiresAuth: false`，验证未登录访问不触发跳转
- [x] 2.4 从 `src/router/utils/index.ts` 移除 `WHITE_LIST` 与 loader 权限校验（保留标题设置逻辑），验证 `pnpm typecheck` 通过且无残留引用
- [x] 2.5 移除 `src/router/utils/route-guard.tsx` 旧 HOC 参考实现（确认不再使用），验证全项目无引用

## 3. 登录页实现

- [x] 3.1 在 `src/api/` 新增登录接口定义（接口地址待定，返回 SaTokenInfo 结构含 `tokenValue`），验证类型可编译
- [x] 3.2 实现登录页表单（替换 `src/views/test/login` 占位），成功后写 token 并 `router.push('/home')`，失败展示提示，验证登录成功跳转 `/home`

## 4. 请求/响应拦截器

- [x] 4.1 请求拦截器读取 localStorage 的 `satoken` 并写入 `config.headers['satoken']`，验证已登录发起的请求携带该请求头
- [x] 4.2 响应拦截器捕获 HTTP 401 或业务 `code: 401`，清除 token 并跳转 `/login`，验证 401 后 token 被清且跳转登录页

## 5. 集成验证

- [ ] 5.1 手动全流程验证：未登录访问受保护页跳 `/login` → 登录成功跳 `/home` → 刷新后保持登录态 → 接口 401 后跳 `/login`
- [x] 5.2 `pnpm typecheck` 与 `pnpm lint:all` 全部通过

## Workflow follow-up

- 登录接口地址与响应字段以后端实际为准，实现前与后端确认。
- 实现完成后按项目评审要求归档该 change。
