/**
 * 打开链接
 */
export function openLink(url: string): void {
  try {
    // 首先尝试使用创建隐藏链接的方法，这是最可靠的
    const link = document.createElement('a')

    link.href = url
    link.target = '_blank'
    link.style.display = 'none'
    link.rel = 'noopener noreferrer'

    // 添加到文档并点击
    document.body.appendChild(link)
    link.click()

    // 延迟移除，确保点击事件完成
    setTimeout(() => {
      document.body.removeChild(link)
    }, 100)
  }
  catch (error) {
    console.warn('创建链接方法失败，尝试使用 window.open:', error)

    try {
      // 备用方案：window.open
      const newWindow = window.open(url, '_blank')

      if (!newWindow) {
        throw new Error('window.open 被阻止')
      }
    }
    catch (windowOpenError) {
      console.error('所有打开链接的方法都失败了:', windowOpenError)

      // 显示用户友好的错误信息
      if (window.$notification) {
        window.$notification.error({
          title: '链接打开失败',
          message: '请检查浏览器设置，确保允许弹出窗口',
          duration: 5000,
        })
      }
    }
  }
}
