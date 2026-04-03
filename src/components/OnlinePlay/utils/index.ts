// 声明 GM_xmlhttpRequest 的全局类型
// declare const GM_xmlhttpRequest: any

/**
 * 比较两个字符串是否相等，不区分大小写
 * @param str1 - 第一个字符串
 * @param str2 - 第二个字符串
 * @returns 如果相等返回 true，否则返回 false
 */
export function isCaseInsensitiveEqual(str1: string, str2: string) {
  return str1.toLowerCase() === str2.toLowerCase()
}

/**
 * 检查响应代码是否表示错误
 * @param resCode - 响应代码
 * @returns 如果是 404 或 403，返回 true，否则返回 false
 */
export function isErrorCode(resCode: number) {
  return [404, 403].includes(resCode)
}

/**
 * 定义常用的正则表达式枚举
 */
export const regEnum: OnlinePlayConfigType.RegExpConfig = {
  subtitle: /(中文|字幕|subtitle)/,
  leakage: /(无码|無碼|泄漏|Uncensored)/,
}
