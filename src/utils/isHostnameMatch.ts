/**
 * 检查当前页面 hostname 是否包含指定关键词
 * @param keyword - 要匹配的关键词
 * @returns 是否匹配
 * @example
 * isHostnameMatch('github') // 在 github.com 页面返回 true
 * isHostnameMatch('example.com') // 在 test.example.com 页面返回 true
 */
export function isHostnameMatch(keyword: string): boolean {
  if (!keyword?.trim()) {
    return false
  }

  const currentHostname = window.location.hostname.toLowerCase()

  const trimmedKeyword = keyword.trim().toLowerCase()

  return currentHostname.includes(trimmedKeyword)
}
