/**
 * 尺寸解析结果
 */
export type SizeValue = string | number

/**
 * 数字（支持小数）
 */
const NUMBER_REGEX = /^\d+(?:\.\d+)?$/

/**
 * px 数值
 */
const PX_REGEX = /^\d+(?:\.\d+)?px$/

/**
 * 判断是否已带单位（百分比 / rem / px / vw 等）
 */
function hasUnit(value: string) {
  return /[a-z%]+$/i.test(value)
}

/**
 * 解析尺寸
 * 👉 number → px
 * 👉 "40" → 40px
 * 👉 "40px" / "2rem" / "100%" → 原样
 * 👉 "calc(...)" / "var(...)" → 原样
 */
export function parseSize(size?: SizeValue, defaultValue = '40px'): string {
  if (size === undefined || size === null || size === '') {
    return defaultValue
  }

  if (typeof size === 'number') {
    return `${size}px`
  }

  const value = size.trim()

  if (/^(?:calc|var)\(/.test(value)) {
    return value
  }

  // 纯数字字符串
  if (NUMBER_REGEX.test(value)) {
    return `${value}px`
  }

  // 已带单位
  if (hasUnit(value)) {
    return value
  }

  return defaultValue
}

/**
 * 尺寸减法（给 icon 用）
 * 👉 能算就算
 * 👉 不能算就用 calc
 */
export function subtractSize(size?: SizeValue, offset = 0): string | number {
  if (size === undefined || size === null || size === '') {
    return 0
  }

  if (typeof size === 'number') {
    return size - offset
  }

  const value = size.trim()

  // "40"
  if (NUMBER_REGEX.test(value)) {
    return Number(value) - offset
  }

  // "40px"
  if (PX_REGEX.test(value)) {
    return `${Number.parseFloat(value) - offset}px`
  }

  // 其他单位 → calc
  return `calc(${value} - ${offset}px)`
}
