/**
 * URL/域名匹配工具函数
 * 提供 hostname 匹配和完整 URL path 匹配能力
 * @file urlMatcher.ts
 */

/**
 * 通用工具：标准化字符串（去空格+转小写）
 * @param str - 待处理字符串
 * @returns 标准化后的字符串
 */
function normalizeString(str: string): string {
  return str?.trim().toLowerCase() || ''
}

/**
 * 检查当前页面 hostname 是否包含指定关键词
 * @param keyword - 要匹配的域名关键词
 * @returns 是否匹配
 * @example
 * isHostnameMatch('github') // 在 github.com 页面返回 true
 * isHostnameMatch('example.com') // 在 test.example.com 页面返回 true
 */
export function isHostnameMatch(keyword: string): boolean {
  const normalizedKeyword = normalizeString(keyword)

  if (!normalizedKeyword) {
    return false
  }

  const currentHostname = normalizeString(window.location.hostname)

  return currentHostname.includes(normalizedKeyword)
}

/**
 * 检查当前页面的完整 URL（hostname + pathname）是否包含指定的路径关键词
 * @param pathKeyword - 要匹配的路径关键词（支持 "域名/路径" 格式，如 "google.com/search"）
 * @returns 是否匹配
 * @example
 * isUrlPathMatch('google.com/search') // 在 https://google.com/search?q=test 页面返回 true
 * isUrlPathMatch('baidu.com/s')       // 在 https://www.baidu.com/s?wd=test 页面返回 true
 * isUrlPathMatch('github.com/docs')   // 在 https://github.com/docs/get-started 页面返回 true
 * isUrlPathMatch('example.com')       // 仅匹配域名，效果等同于 isHostnameMatch('example.com')
 */
export function isUrlPathMatch(pathKeyword: string): boolean {
  const normalizedKeyword = normalizeString(pathKeyword)

  if (!normalizedKeyword) {
    return false
  }

  // 获取并标准化当前页面的 hostname + pathname
  const currentHostname = normalizeString(window.location.hostname)

  const currentPathname = normalizeString(window.location.pathname)

  const currentFullPath = `${currentHostname}${currentPathname}`

  // 分割关键词为域名部分和路径部分
  const [keywordHost, ...keywordPathParts] = normalizedKeyword.split('/')

  const keywordPath = keywordPathParts.join('/')

  // 仅传域名 → 复用 hostname 匹配逻辑
  if (keywordPathParts.length === 0) {
    return isHostnameMatch(keywordHost)
  }

  // 域名+路径 → 匹配完整路径
  const fullKeyword = `${keywordHost}/${keywordPath}`

  return currentFullPath.includes(fullKeyword)
}

// 可选：导出类型别名（方便外部使用）
export type UrlMatchKeyword = string

export type HostnameMatchKeyword = string
