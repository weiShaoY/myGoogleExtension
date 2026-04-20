/**
 * 检查并处理版本更新
 * - 从 index.html 的 <meta name="app-version"> 获取版本时间戳
 * - 与本地缓存版本对比
 * - 版本不一致时：更新本地缓存 + 刷新页面（仅一次）
 */
export function versionChecker() {
  // 非浏览器环境直接退出
  if (typeof document === 'undefined') {
    return
  }

  try {
    // 1. 获取最新版本号
    const metaTag = document.querySelector('meta[name="app-version"]')

    const latestVersion = metaTag?.getAttribute('content')?.trim()

    if (!latestVersion) {
      console.warn('未检测到版本信息：app-version 标签不存在')
      return
    }

    // 2. 获取本地缓存版本
    const cachedVersion = localStorage.getItem('appVersion')

    // 3. 版本相同 → 不处理
    if (latestVersion === cachedVersion) {
      return
    }

    // 4. 防无限刷新
    if (sessionStorage.getItem('version_reloaded')) {
      sessionStorage.removeItem('version_reloaded')
      localStorage.setItem('appVersion', latestVersion)
      return
    }

    console.log('✅ 检测到新版本，刷新页面以应用更新')

    // 标记刷新
    sessionStorage.setItem('version_reloaded', 'true')
    localStorage.setItem('appVersion', latestVersion)

    // 异步刷新，不阻塞 Vue
    setTimeout(() => window.location.reload(), 60)
  }
  catch (error) {
    console.error('❌ 版本检查失败：', error)
  }
}
