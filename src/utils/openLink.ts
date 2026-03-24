/**
 * 打开链接
 */
export function openLink(url: string): void {
  try {
    // 备用方案：window.open
    const newWindow = window.open(url, '_blank')

    if (!newWindow) {
      throw new Error('window.open 被阻止')
    }
  }
  catch (error) {
    console.warn('链接打开失败，使用备用方案:', error)

    // 最后的备用方案：创建隐藏链接
    try {
      const link = document.createElement('a')

      link.href = url
      link.target = '_blank'
      link.style.display = 'none'
      link.rel = 'noopener noreferrer'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
    catch (fallbackError) {
      console.error('所有打开链接的方法都失败了:', fallbackError)
    }
  }
}
