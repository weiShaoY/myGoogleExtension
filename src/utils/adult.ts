import { AdultConfig } from '@/configs'

/**
 * 自动从标签生成正则表达式
 */
// 创建正则表达式用于从文件名中提取标签
export const videoFileTagExtractionRegex = new RegExp(

  // 处理所有标签配置，生成正则表达式模式
  AdultConfig.rules.torrentTagRules

  // 扁平化处理：将所有标签的 names 数组合并为一个数组
    .flatMap(tag => tag.names)

  // 遍历每个标签名称，生成正则表达式片段
    .map((name) => {
      // 转义正则表达式中的特殊字符，防止正则注入攻击
      // 将特殊字符前添加反斜杠进行转义
      const escaped = name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')

      // 如果标签名以 '-' 开头，保持原样（已经转义）
      // 否则添加可选的 '-' 前缀（-? 表示 - 出现 0 次或 1 次）
      // 这样可以匹配 "中文" 或 "-中文" 两种情况
      return name.startsWith('-') ? escaped : `-?${escaped}`
    })

  // 使用 | 连接所有正则表达式片段，形成"或"关系
    .join('|'),

  // 正则表达式标志：g 表示全局匹配，i 表示忽略大小写
  'gi',
)

/**
 * 从文件名提取匹配的标签图标数组
 * @description 自动识别标签并返回对应图标，自动去重，大小写不敏感
 * @param fullName 视频完整名称（含扩展名）
 * @returns 图标名称数组
 */
// 定义从文件名提取标签图标的方法
export function getVideoTagsFromName(fullName: string): string[] {
  // 使用正则表达式在文件名中查找所有匹配的标签
  // matchAll 返回一个迭代器，使用展开运算符 [...] 转换为数组
  const matches = [...fullName.matchAll(videoFileTagExtractionRegex)]

  // 如果没有找到任何匹配项，直接返回空数组
  if (matches.length === 0) {
    return []
  }

  // 将所有匹配结果转换为小写，实现大小写不敏感比较
  // m[0] 表示匹配到的完整字符串
  const lowerMatches = matches.map(m => m[0].toLowerCase())

  console.log('🚀 ~ file: adult.ts:145 ~ lowerMatches:', lowerMatches)

  // 创建空数组用于存储匹配到的图标标识
  const icons: string[] = []

  // 遍历所有标签规则，检查是否有匹配的标签
  for (const tag of AdultConfig.rules.torrentTagRules) {
    // 检查当前标签的任一关键词是否匹配
    // some 方法：只要有一个满足条件就返回 true
    const hit = tag.names.some((n) => {
      // 将标签关键词转换为小写，用于大小写不敏感比较
      const tagNameLower = n.toLowerCase()

      // 检查是否有匹配项等于或以后缀形式包含该关键词
      return lowerMatches.some(match =>

      // 完全匹配或后缀匹配（处理前缀 - 的情况，如 "-中文" 匹配 "中文"）
        match === tagNameLower || match.endsWith(tagNameLower),
      )
    })

    // 如果当前标签有匹配，添加对应的图标标识到结果数组
    if (hit) {
      icons.push(tag.icon)
    }
  }

  // 使用 Set 去重，然后展开为数组返回
  // 避免同一个图标被添加多次（如文件名包含多个同一类型的标签）
  return [...new Set(icons)]
}
