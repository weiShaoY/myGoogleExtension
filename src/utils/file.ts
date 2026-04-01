/**
 * 从文本中解析文件大小并统一转换为 GB 单位（保留2位小数）
 * @param text 包含文件大小的文本，例如："4.5 GB"、"800 MB"
 * @returns 转换后的 GB 数值，解析失败返回 0
 */
export function parseFileSizeToGB(text: string): number {
  // 正则匹配：提取数字 + 单位（支持 123 / 123.45 格式，兼容 GB/MB/gb/mb）
  const match = text.match(/(\d+(?:\.\d+)?)\s*([GM]B)/i)

  if (!match) {
    return 0
  }

  const [, numStr, unit] = match

  const num = Number.parseFloat(numStr)

  const sizeInGB = unit.toUpperCase() === 'MB' ? num / 1024 : num

  return Math.round(sizeInGB * 100) / 100
}
