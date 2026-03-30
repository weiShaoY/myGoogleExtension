# 类型定义文件夹结构说明

本文档说明 `src/types/` 目录的组织结构和文件用途。

## 目录结构

```
src/types/
├── index.d.ts              # 类型入口文件（统一引用所有类型）
├── content/                # Content 脚本相关类型
│   ├── emby.d.ts          # Emby 服务器配置
│   ├── folder.d.ts        # 文件夹扫描配置
│   ├── online-play.d.ts   # 在线播放配置
│   └── torrent.d.ts       # 种子/磁链类型
├── app/                    # 应用框架相关类型
│   ├── env.d.ts           # Vite 环境变量
│   ├── global.d.ts        # 全局 Window 扩展
│   ├── styles.d.ts        # 样式文件模块
│   └── vue.d.ts           # Vue 模块声明
├── core/                   # 自动生成类型
│   ├── auto-imports.d.ts  # unplugin-auto-import 生成
│   ├── components.d.ts    # unplugin-vue-components 生成
│   └── vue.d.ts           # Vue 相关
└── shared/                 # 共享/通用类型
    ├── directives.d.ts    # 全局指令类型
    └── search.d.ts        # 搜索配置
```

## 目录说明

### content/

Content 脚本相关的类型定义，主要用于浏览器扩展的内容脚本模块。

| 文件               | 说明                          | 命名空间               |
| ------------------ | ----------------------------- | ---------------------- |
| `emby.d.ts`        | Emby 服务器连接和请求配置类型 | `EmbyConfigType`       |
| `folder.d.ts`      | 文件夹扫描和监控配置类型      | `AdultConfigType`      |
| `online-play.d.ts` | 在线播放站点配置类型          | `OnlinePlayConfigType` |
| `torrent.d.ts`     | 种子/磁链列表和排序规则类型   | -                      |

### app/

应用框架相关的类型定义，包括环境变量、全局扩展、模块声明等。

| 文件          | 说明                                      |
| ------------- | ----------------------------------------- |
| `env.d.ts`    | Vite 环境变量类型定义 (`import.meta.env`) |
| `global.d.ts` | 全局 Window 对象类型扩展                  |
| `styles.d.ts` | SCSS/CSS 文件模块声明                     |
| `vue.d.ts`    | Vue 单文件组件类型声明和全局属性扩展      |

### core/

**注意**：此目录下的文件由构建工具自动生成，请勿手动修改。

| 文件                | 生成工具                  | 说明                |
| ------------------- | ------------------------- | ------------------- |
| `auto-imports.d.ts` | `unplugin-auto-import`    | 自动导入的 API 类型 |
| `components.d.ts`   | `unplugin-vue-components` | 全局组件类型声明    |
| `vue.d.ts`          | 手动维护                  | Vue 核心类型扩展    |

### shared/

跨模块共享的通用类型定义。

| 文件              | 说明                | 命名空间           |
| ----------------- | ------------------- | ------------------ |
| `directives.d.ts` | 自定义 Vue 指令类型 | `DirectiveType`    |
| `search.d.ts`     | 搜索组件配置类型    | `SearchConfigType` |

## 使用方式

### 引用所有类型

在 `tsconfig.json` 中配置：

```json
{
  "compilerOptions": {
    "types": ["./src/types/index.d.ts"]
  }
}
```

### 单独引用某个类型

```typescript
// / <reference path="../types/content/emby.d.ts" />
```

## 命名规范

1. **文件名**：使用小写字母，单词间用连字符 `-` 分隔（如：`online-play.d.ts`）
2. **命名空间**：使用 PascalCase，以 `Type` 结尾（如：`EmbyConfigType`）
3. **类型名**：使用 PascalCase（如：`RequestQueryParams`）

## 注意事项

1. `core/` 目录下的 `auto-imports.d.ts` 和 `components.d.ts` 是自动生成的，修改会被覆盖
2. 新增类型文件后，请在 `index.d.ts` 中添加对应的引用
3. 尽量使用命名空间（namespace）组织相关类型，避免全局命名冲突
