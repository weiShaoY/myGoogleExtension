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
    return ''
  }
}

/**
 * 设置剪贴板内容
 * @param text 要设置的文本内容
 * @returns 是否设置成功
 */
export async function setClipboardText(text: string): Promise<boolean> {
  try {
    if (!isClipboardSupported()) {
      return false
    }

    if (!text?.trim()) {
      return false
    }

    await navigator.clipboard.writeText(text)
    return true
  }
  catch (error) {
    console.warn('设置剪贴板失败:', error)
    return false
  }
}

/**
 * 复制文本到剪贴板（带成功提示）
 * @param text 要复制的文本
 * @param showToast 是否显示成功提示
 * @returns 是否复制成功
 */
export async function copyToClipboard(text: string, showToast = true): Promise<boolean> {
  const success = await setClipboardText(text)

  if (success && showToast) {
    // 使用全局提示组件（如果已注册）
    if (window.$message) {
      window.$message({
        message: '已复制到剪贴板',
        type: 'success',
      })
    }
    else {
      console.log('已复制到剪贴板:', text)
    }
  }

  return success
}

/**
 * 安全地获取剪贴板内容（带用户交互检查）
 * @returns 剪贴板文本内容
 * @deprecated 使用 getClipboardText 替代，已集成权限检查
 */
export async function getClipboardTextSafely(): Promise<string> {
  try {
    if (!isClipboardSupported()) {
      return ''
    }

    const text = await navigator.clipboard.readText()

    return text || ''
  }
  catch (error) {
    if (error instanceof Error && error.name === 'NotAllowedError') {
      console.warn('需要用户交互才能访问剪贴板')
    }

    return ''
  }
}
