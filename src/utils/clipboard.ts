/**
 * 剪贴板工具函数
 */

/**
 * 检查剪贴板 API 是否可用
 * @returns 是否支持
 */
export function isClipboardSupported(): boolean {
  return 'clipboard' in navigator && 'readText' in navigator.clipboard
}

/**
 * 获取剪贴板内容
 * @returns 剪贴板文本内容
 */
export async function getClipboardText(): Promise<string> {
  try {
    if (!isClipboardSupported()) {
      return ''
    }

    const text = await navigator.clipboard.readText()

    return text || ''
  }
  catch (error) {
    console.warn('读取剪贴板失败:', error)
    window.$notification.error({
      message: '读取剪贴板失败',
      type: 'error',
    })
    return ''
  }
}

/**
 * 复制文本到剪贴板（带提示）
 * @param text 要复制的文本
 * @param showToast 是否显示成功/失败提示，默认 true
 * @returns 是否复制成功
 */
export async function copyToClipboard(text: string, showToast = true): Promise<boolean> {
  try {
    // 1. 校验环境和文本
    if (!isClipboardSupported() || !text?.trim()) {
      return false
    }

    // 2. 执行复制
    await navigator.clipboard.writeText(text)

    // 3. 成功提示
    if (showToast && window.$notification) {
      window.$notification.success({
        message: '已复制到剪贴板',
        type: 'success',
      })
    }

    return true
  }
  catch (error) {
    console.warn('复制到剪贴板失败:', error)

    // 4. 失败提示
    if (showToast && window.$notification) {
      window.$notification.error({
        message: '复制失败',
        type: 'error',
      })
    }

    return false
  }
}
