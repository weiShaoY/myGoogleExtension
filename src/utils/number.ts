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
