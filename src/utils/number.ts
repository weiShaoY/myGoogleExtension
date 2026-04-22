/**
 * 获取指定位数的随机数字字符串
 * @param length 长度，默认 32 位
 * @returns 随机数字符串
 */
export function getRandomNumber(length = 32): string {
  let str = ''

  // 安全限制：防止传入负数或超大数字
  const len = Math.max(1, Math.min(100, length))

  for (let i = 0; i < len; i++) {
    str += Math.floor(Math.random() * 10)
  }

  return str
}

/**
 * 生成随机英文字符串
 * @param {number} [length] - 字符串长度，范围1-100，默认32
 * @param {'lower'|'upper'|'mixed'} [caseType] - 大小写类型：
 *   - 'lower': 全小写字母 (a-z)
 *   - 'upper': 全大写字母 (A-Z)
 *   - 'mixed': 大小写混合 (A-Za-z)
 * @returns {string} 生成的随机字符串
 * @example
 * getRandomString();          // 32位小写字母
 * getRandomString(16);        // 16位小写字母
 * getRandomString(24, 'upper');  // 24位大写字母
 * getRandomString(32, 'mixed');  // 32位大小写混合
 */
export function getRandomString(
  length: number = 32,
  caseType: 'lower' | 'upper' | 'mixed' = 'lower',
): string {
  // 边界检查：限制长度为1-100之间
  const len = Math.max(1, Math.min(100, length))

  let result = ''

  const chars = {
    lower: 'abcdefghijklmnopqrstuvwxyz',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    mixed: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  }

  const charSet = chars[caseType] || chars.lower

  for (let i = 0; i < len; i++) {
    result += charSet.charAt(Math.floor(Math.random() * charSet.length))
  }

  return result
}
