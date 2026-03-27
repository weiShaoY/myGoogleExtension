// 空白字符正则
export const WHITESPACE_REGEX = /\s+/g

/**
 * 清洗视频名称：小写 + 去空格
 */
export function cleanVideoName(name: string = '') {
  return name.trim()
    .toLowerCase()
    .replace(WHITESPACE_REGEX, '')
}
