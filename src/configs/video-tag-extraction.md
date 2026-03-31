# 视频标签提取系统详解

## 1. 系统概述

视频标签提取系统是一个用于从视频文件名中自动识别和提取标签的工具，支持识别如 4K、中文字幕、无码等标签，并返回对应的图标标识。

## 2. 核心组件

### 2.1 标签配置

```typescript
const videoFileTags = [
  {
    names: ['4K'],
    icon: 'tag-4k'
  },
  {
    names: ['-c', '-C', '_ch', '-UC', '中文'],
    icon: 'tag-ziMu'
  },
  {
    names: ['无码'],
    icon: 'tag-wuMa'
  },
  {
    names: ['破解'],
    icon: 'tag-poJie'
  },
  {
    names: ['流出'],
    icon: 'tag-liuChu'
  }
]
```

- **names**: 标签匹配关键词数组
- **icon**: 对应图标标识

### 2.2 正则表达式生成

```typescript
const videoFileTagExtractionRegex = new RegExp(
  videoFileTags
    .flatMap((tag) => tag.names)
    .map((name) => {
      const escaped = name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')

      return name.startsWith('-') ? escaped : `-?${escaped}`
    })
    .join('|'),
  'gi'
)
```

**生成过程**：

1. 提取所有标签关键词
2. 转义特殊字符
3. 为非 `-` 开头的关键词添加可选前缀
4. 连接成正则表达式模式
5. 添加 `gi` 标志（全局匹配、忽略大小写）

## 3. 核心函数：getVideoTagsFromName

### 3.1 函数签名

```typescript
getVideoTagsFromName(fullName: string): string[]
```

### 3.2 详细流程

#### 步骤1：正则匹配

```typescript
const matches = [...fullName.matchAll(videoFileTagExtractionRegex)]
```

- 使用 `matchAll()` 查找所有匹配项
- 展开运算符转换为数组

**示例**：

```typescript
// 输入: "START-538-中文字幕-4K.mp4"
// 输出: [["-中文字幕"], ["-4K"]]
```

#### 步骤2：空值检查

```typescript
if (matches.length === 0) {
  return []
}
```

- 无匹配时直接返回空数组

#### 步骤3：大小写统一

```typescript
const lowerMatches = matches.map((m) => m[0].toLowerCase())
```

- 将所有匹配结果转为小写
- 实现大小写不敏感比较

**示例**：

```typescript
// 输入: [["-中文字幕"], ["-4K"]]
// 输出: ["-中文字幕", "-4k"]
```

#### 步骤4-5：标签匹配与收集

```typescript
const icons: string[] = []

for (const tag of videoFileTags) {
  const hit = tag.names.some((n) => {
    const tagNameLower = n.toLowerCase()

    return lowerMatches.some(
      (match) => match === tagNameLower || match.endsWith(tagNameLower)
    )
  })

  if (hit) {
    icons.push(tag.icon)
  }
}
```

**匹配逻辑**：

1. 遍历每个标签规则
2. 检查该标签的任一关键词是否匹配
3. 支持两种匹配模式：
   - 完全匹配：`match === tagNameLower`
   - 后缀匹配：`match.endsWith(tagNameLower)`

**为什么需要后缀匹配**：

```typescript
// 文件名匹配: "-中文字幕"
// 标签关键词: "中文"
'-中文字幕'.endsWith('中文') = true // 匹配成功
```

#### 步骤6：去重返回

```typescript
return [...new Set(icons)]
```

- 使用 `Set` 自动去重
- 展开为数组返回

**去重原因**：

```typescript
// 文件名: "START-538-中文-中文.mp4"
// 可能匹配两次 "中文"
// 去重前: ['tag-ziMu', 'tag-ziMu']
// 去重后: ['tag-ziMu']
```

### 3.3 完整示例

#### 输入输出示例

| 输入                 | 输出                     | 说明             |
| -------------------- | ------------------------ | ---------------- |
| "START-538-中文字幕" | `["tag-ziMu"]`           | 匹配中文字幕标签 |
| "START-538-4K"       | `["tag-4k"]`             | 匹配 4K 标签     |
| "START-538-无码-4K"  | `["tag-4k", "tag-wuMa"]` | 匹配多个标签     |
| "START-538"          | `[]`                     | 无匹配标签       |

**详细执行过程**：

输入: "START-538-中文字幕-4K.mp4"

1. 正则匹配: `["-中文字幕", "-4K"]`
2. 转小写: `["-中文字幕", "-4k"]`
3. 检查 4K 标签: `"-4k".endsWith("4k")` → 匹配
4. 检查中文标签: `"-中文字幕".endsWith("中文")` → 匹配
5. 去重返回: `["tag-4k", "tag-ziMu"]`

## 4. 技术设计亮点

### 4.1 灵活性

- **配置化设计**：标签规则通过配置定义，易于扩展
- **动态正则**：自动从配置生成正则表达式
- **多模式匹配**：支持完全匹配和后缀匹配

### 4.2 健壮性

- **防御性编程**：转义特殊字符，防止正则注入
- **大小写不敏感**：统一转为小写进行比较
- **去重处理**：确保结果唯一性

### 4.3 性能优化

- **提前返回**：无匹配时直接结束
- **短路求值**：使用 `some()` 方法，找到匹配立即返回
- **一次构建**：正则表达式只生成一次，多次复用

## 5. 应用场景

- **文件管理**：自动为视频文件添加标签
- **界面展示**：根据标签显示对应图标
- **搜索过滤**：基于标签进行文件筛选
- **媒体库组织**：按标签分类管理视频文件

## 6. 代码优化建议

### 6.1 性能优化

- **缓存机制**：对频繁调用的文件名结果进行缓存
- **编译优化**：将正则表达式构建移到模块级别

### 6.2 功能扩展

- **自定义标签**：支持用户自定义标签规则
- **标签优先级**：处理标签冲突情况
- **多语言支持**：支持不同语言的标签识别

### 6.3 可维护性

- **配置分离**：将标签规则提取到单独的配置文件
- **类型定义**：为标签规则添加更严格的类型定义
- **单元测试**：添加测试用例确保功能正确性

## 7. 总结

视频标签提取系统通过巧妙的正则表达式构建和匹配逻辑，实现了从视频文件名中自动识别和提取标签的功能。其设计兼顾了灵活性、健壮性和性能，为视频文件管理提供了有效的工具支持。

该系统不仅适用于成人内容管理，也可以推广到其他需要从文本中提取结构化信息的场景，如音乐文件标签提取、文档分类等。
