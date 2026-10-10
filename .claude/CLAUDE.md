# CLAUDE.md

本文件为 Claude Code 提供项目上下文，帮助快速理解本项目。

## 项目概述

基于 **React 19 + TypeScript + Vite** 的现代化前端项目模板，开箱即用，用于快速搭建 React 项目。集成路由、状态管理、请求封装、代码规范等完整解决方案。

## 技术栈

| 类别 | 技术 |
| --- | --- |
| 核心框架 | React 19 |
| 构建工具 | Vite 7 |
| 语言 | TypeScript 5.9 |
| 路由 | react-router 7（懒加载 + 路由守卫） |
| 状态管理 | Zustand 5 + use-immer |
| 数据请求 | Axios + SWR |
| 工具库 | ahooks + es-toolkit + dayjs |
| 样式 | SCSS + BEM（支持 css module `xxx.module.scss`） |
| 类名处理 | clsx |
| 代码规范 | ESLint 9 + Prettier + Stylelint + Commitlint + Husky |

包管理器为 **pnpm**（`preinstall` 已强制 `only-allow pnpm`），Node >= 22。

## 项目结构

```
src
├── api              # 接口定义（如 test.ts）
├── assets           # 静态资源
├── components       # 公共组件（auto-scroll-to-top / error-boundary / high-light / loading / not-fount）
├── hooks            # 自定义 hooks（use-namespace / use-ref-state / use-router 等）
├── router           # 路由配置（index.tsx + modules + utils）
├── services         # Axios 请求封装（index.ts / service.ts）
├── store            # Zustand 状态管理（index.ts + modules）
├── styles           # 样式文件（css / scss）
├── types            # 类型定义
├── utils            # 工具函数
├── views            # 页面组件（home / test）
├── app.tsx          # 根组件
└── main.tsx         # 入口文件
```

其他目录：`public`（静态资源）、`scripts`（push.sh）、`.husky`（Git Hooks）、`.vscode`（编辑器配置）、`openspec`（OpenSpec 工作流）。

## 常用命令

```bash
pnpm dev              # 启动开发服务器（-m dev）
pnpm dev:test         # 测试环境启动
pnpm dev:pro          # 生产环境启动
pnpm build:dev        # 构建开发环境（dist-dev）
pnpm build:test       # 构建测试环境（dist-test）
pnpm build:pro        # 构建生产环境（dist-pro）
pnpm typecheck        # tsc --noEmit 类型检查
pnpm lint:all         # eslint + stylelint + prettier 全量检查修复
pnpm push             # 执行 scripts/push.sh 提交推送
```

## 环境变量

通过 `-m <mode>` 区分环境，加载对应 `.env` 文件，仅 `VITE_` 前缀变量暴露给客户端（`import.meta.env.VITE_XXX`）。

- `.env`：通用变量（`VITE_APP_TITLE`、`VITE_APP_PORT`）
- `.env.dev` / `.env.test` / `.env.pro`：各环境变量（`VITE_API_BASE_URL` 接口前缀、`VITE_SERVER_URL` 后端地址、`VITE_OUT_DIR` 输出路径）

## 编码约定

- **样式**：SCSS 预编译，采用 BEM 命名规范。
- **Import 排序**：集成 `prettier-plugin-sort-imports`，保存时自动美化 import 顺序。
- **提交规范**：Commitlint（conventional commits）+ Husky + lint-staged，提交前自动执行 lint。
- **代码检查**：保存/提交时 ESLint、Prettier、Stylelint 自动格式化。
- **跨域**：本地通过反向代理解决（详见 `vite.config.ts`）。
- **路由缓存**：React 无官方 keep-alive，状态保持采用「状态提升」或「CSS visible」手动方案（详见 README「关于路由缓存 keep-alive」）。

## 注意事项

- 部分 UI 库或第三方库尚未支持 React 19，安装前需甄别。
- 项目未使用 React 19 特有特性，可降级到 18：`pnpm install react@18.3.1 react-dom@18.3.1`。
