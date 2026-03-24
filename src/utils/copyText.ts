/**
 * 复制文本到剪贴板，并根据需要显示通知
 *
 * @param  text 要复制的文本
 * @param  message 复制成功后的通知消息（可选）
 */
export async function copyText(text: string, message = ''): Promise<void> {
  try {
    const { copy } = useClipboard()

    // 支持异步 copy
    await copy(text)

    window.$notification?.success({
      title: '复制成功',
      message: message || text,
    })
  }
  catch (err) {
    console.error('复制操作不被支持或失败: ', err)

    window.$notification?.error({
      title: '复制失败',
      message: '复制操作不被支持或失败',
    })
  }
}
