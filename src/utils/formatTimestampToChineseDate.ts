/**
 * 根据传入的时间戳生成格式化的中文日期字符串
 * @param {number | string | Date} timestamp - 传入的时间戳（毫秒），可以是数字、字符串或 Date 对象
 * @returns {string} - 返回类似 "2024年01月01日 22点33分44秒" 的日期字符串
 * @throws {TypeError} - 如果传入的 timestamp 不是有效的时间戳或 Date 对象，则抛出 TypeError
 */
export function formatTimestampToChineseDate(timestamp: number | string | Date): string {
  let date: Date

  if (typeof timestamp === 'number' || typeof timestamp === 'string') {
    const timestampNumber = Number(timestamp) // 显式转换为数字

    if (Number.isNaN(timestampNumber)) {
      throw new TypeError('Invalid timestamp provided: Not a number') // 更精确的错误提示
    }

    date = new Date(timestampNumber)
  }
  else if (timestamp instanceof Date) {
    date = new Date(timestamp.getTime()) // 创建一个新的 Date 对象，避免修改原始对象
  }
  else {
    throw new TypeError('Invalid timestamp provided:  Must be a number, string, or Date object.')
  }

  if (Number.isNaN(date.getTime())) {
    throw new TypeError('Invalid timestamp provided: Invalid Date object') // 更加严格的 Date 对象有效性检查
  }

  const year = date.getFullYear()

  const month = String(date.getMonth() + 1).padStart(2, '0')

  const day = String(date.getDate()).padStart(2, '0')

  const hours = String(date.getHours()).padStart(2, '0')

  const minutes = String(date.getMinutes()).padStart(2, '0')

  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${year}年${month}月${day}日 ${hours}点${minutes}分${seconds}秒` //  调整为更常见的中文日期格式，日和点之间增加空格
}
