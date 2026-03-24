/**
 * URL/域名匹配工具函数
 * 智能判断关键词类型，支持纯域名匹配和域名+路径匹配
 * @file urlMatcher.ts
 *
 * @param keyword - 匹配关键词：
 *                  - 纯域名（如 "github.com"、"javdb"）→ 匹配当前页面域名（包含匹配）
 *                  - 域名+路径（如 "google.com/search"、"javdb.com/search"）→ 匹配当前页面域名+路径（包含匹配）
 * @returns 是否匹配（boolean）
 *
 * @example
 * // ========== 纯域名匹配场景 ==========
 * // 场景1：关键词为域名子串 → 匹配成功
 * isUrlMatch('javdb')          // 当前页面 https://javdb.com → 返回 true
 * // 场景2：关键词为完整域名 → 匹配成功
 * isUrlMatch('javdb.com')      // 当前页面 https://javdb.com → 返回 true
 * // 场景3：域名包含子域名 → 匹配成功
 * isUrlMatch('javdb')          // 当前页面 https://www.javdb.com → 返回 true
 * // 场景4：关键词不匹配 → 匹配失败
 * isUrlMatch('javdb123')       // 当前页面 https://javdb.com → 返回 false
 *
 * // ========== 域名+路径匹配场景 ==========
 * // 场景1：域名+路径完全匹配 → 匹配成功
 * isUrlMatch('javdb.com/search') // 当前页面 https://javdb.com/search → 返回 true
 * // 场景2：路径缺失 → 匹配失败
 * isUrlMatch('javdb.com/search') // 当前页面 https://javdb.com → 返回 false
 * // 场景3：标准域名+路径匹配
 * isUrlMatch('google.com/search') // 当前页面 https://google.com/search?q=test → 返回 true
 * isUrlMatch('baidu.com/s')       // 当前页面 https://www.baidu.com/s?wd=test → 返回 true
 *
 * // ========== 基础域名匹配示例 ==========
 * isUrlMatch('github')         // 当前页面 https://github.com → 返回 true
 * isUrlMatch('example.com')    // 当前页面 https://test.example.com → 返回 true
 */
export function isUrlMatch(keyword: string): boolean {
  // 1. 通用预处理：空值/空白字符直接返回 false
  const normalizedKeyword = keyword?.trim().toLowerCase() || ''

  if (!normalizedKeyword) {
    return false
  }

  // 2. 获取并标准化当前页面的 URL 信息
  const currentHostname = window.location.hostname.toLowerCase()

  const currentPathname = window.location.pathname.toLowerCase()

  const currentFullPath = `${currentHostname}${currentPathname}`

  // 3. 智能判断匹配模式
  if (normalizedKeyword.includes('/')) {
    // 模式1：域名+路径匹配（如 "google.com/search"）
    const [keywordHost, ...keywordPathParts] = normalizedKeyword.split('/')

    const keywordPath = keywordPathParts.join('/')

    const fullKeyword = `${keywordHost}/${keywordPath}`

    return currentFullPath.includes(fullKeyword)
  }
  else {
    // 模式2：纯域名匹配（如 "github.com"）
    return currentHostname.includes(normalizedKeyword)
  }
}
