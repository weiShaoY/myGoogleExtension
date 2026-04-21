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

/**
 * 视频时长格式化
 * 👉 秒 → HH:MM:SS
 *
 * @param input 秒数（number 或 string）
 * @returns HH:MM:SS
 */
export function parseVideoDurationToSeconds(input: string | number): string {
  /**
   * 转换为 number
   */
  const totalSeconds = typeof input === 'number'
    ? input
    : Number(input)

  /**
   * 非法值兜底
   */
  if (Number.isNaN(totalSeconds) || totalSeconds < 0) {
    return '00:00:00'
  }

  /**
   * 向下取整（去掉小数）
   */
  const seconds = Math.floor(totalSeconds)

  const h = Math.floor(seconds / 3600)

  const m = Math.floor((seconds % 3600) / 60)

  const s = seconds % 60

  /**
   * 补零
   */
  const pad = (n: number) => String(n).padStart(2, '0')

  return `${pad(h)}:${pad(m)}:${pad(s)}`
}
