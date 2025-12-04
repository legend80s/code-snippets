## Technical Stack
- **技术栈**：React v19, Ant Design v5, TypeScript v5, tailwindcss v4.1.17,
- **构建工具**：Rsbuild
- **包管理器**：pnpm (>= 9.0.0)
- **代码格式化和 lint**：Biome
- **操作系统**：Windows，但请使用 git bash 运行命令而非 powershell

## Coding Guidelines

### Part 1. General Coding Guidelines

<!--《中文文案排版指北》可选大家酌情增加，详见文章后半部分 -->
文案请按照中文文案排版指北，先阅读这份文档 docs/README.zh-Hans.md，给出文档所有正例和反例，等我确认你已经理解再执行代码修改。]

#### 1. Basic Principles
- DRY (Don't Repeat Yourself) 原则：避免重复代码。
- SRP (Single Responsibility Principle) 原则：每个模块、函数或类应该只有一个职责。
- KISS (Keep It Simple, Stupid) 原则：保持代码简单、直接，避免复杂的逻辑。

#### 2. Comments & Documentation
- Only generate necessary comments. Comments should explain why, not what.
- Provide clear documentation for public APIs.
- Update comments to reflect code changes.

### Part 2. Frontend Coding Guidelines

#### 1. Code Structure
- Use functional components with hooks.
- Organize components in a feature-based folder structure.
- Use TypeScript for type safety.

#### 2. Styling
- Use tailwindcss for utility-first styling.
- Avoid inline styles; use antd components and necessary tailwindcss classes.

### Part 3. Project Coding Guidelines
1. Use pnpm instead of npm.
1. Avoid inline styles; use antd components and necessary tailwindcss classes. If necessary, please clearly state the reason in the comment.
1. Do not use react-router-dom. This project is a react-router v7 project, so please use react-router.
1. Import types with type prefix, e.g. `IMcpServerRecord`.
1. For type checking after modifications, use: `bun scripts/tsc-files.mjs --noEmit <related_files>` (checks **only relevant files**). Avoid `npx tsc ...` as it doesn't respect project type configuration and shows errors from unrelated files, generating many false positives.
1. 新代码请使用 es-toolkit 而非 lodash。老代码 lodash 类型报错请使用 `// @ts-expect-error` 注释忽略。
1. 新代码请勿使用 `dva` 的 `connect`。比如获取 `orgId`，应该使用 `useOrgId`，它基于 `@tanstack/react-query` 的 `useQuery`。如果其他全局服务端数据没有，应该如 `useOrgId` 封装新的 `useXxx`，并且在 `src/lib/prefetchGlobalServerData.tsx` 中添加预取逻辑。

[可选]
1. 每次修改完毕执行 `npx biome check --diagnostic-level=error --write <related_files>` 检查**涉及到**的文件
