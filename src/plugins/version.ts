/**
 * 版本提示函数
 */
export function setVersionTip() {
  // 1. 从 meta 标签获取版本时间戳
  const metaTag = document.querySelector('meta[name="app-version"]')

  const version = metaTag?.getAttribute('content')

  if (!version) {
    console.error('获取版本号失败：未找到 app-version 标签')
    return
  }

  // 2. 存储到本地
  localStorage.setItem('appVersion', version)

  // 3. 格式化时间
  const formatTime = formatTimestampToChineseDate(version)

  // 4. 拼接要输出的文字（一行显示）
  const versionText = `当前版本: ${version} | 发布时间: ${formatTime}`

  // 5. 完全按照你要的样式输出 🎉
  console.info(
    `%c${versionText}`,
    'color: orange; background: ivory; font-size: 26px; border: 2px solid black; padding: 10px; text-shadow: 1px 1px grey; border-radius: 11px;',
  )
}
