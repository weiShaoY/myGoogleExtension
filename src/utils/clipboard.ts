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
 * @param options 提示选项
 * @param options.showToast 是否显示提示，默认为 true
 * @param options.title 提示标题，默认为 '已复制到剪贴板'
 * @param options.message 提示消息，默认为空
 * @returns 是否复制成功
 */
export async function copyToClipboard(
  text: string,
  {
    showToast = true,
    title = '已复制到剪贴板',
    message = '',
  }: {
    showToast?: boolean
    title?: string
    message?: string
  } = {
  }, // 👈 关键：整个对象默认 = 空对象，变成可选
): Promise<boolean> {
  try {
    if (!isClipboardSupported() || !text?.trim()) {
      return false
    }

    await navigator.clipboard.writeText(text)

    if (showToast && window.$notification) {
      window.$notification.success({
        title,
        message,
        type: 'success',
      })
    }

    return true
  }
  catch (error) {
    console.warn('复制到剪贴板失败:', error)

    if (showToast && window.$notification) {
      window.$notification.error({
        message: '复制失败',
        type: 'error',
      })
    }

    return false
  }
}
