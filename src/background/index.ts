/**
 * 扩展后台服务
 * @description 处理网络请求代理，解决混合内容问题
 */

// 监听消息来自内容脚本
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'embySearch') {
    // 处理 Emby 搜索请求
    handleEmbySearch(message.data, sendResponse)
    return true // 保持消息通道开放
  }

  if (message.type === 'openEmbyTab') {
    // 打开 Emby 标签页
    handleOpenEmbyTab(message.data, sendResponse)
    return true // 保持消息通道开放
  }
})

/**
 * 处理 Emby 搜索请求
 * @param data 请求数据
 * @param data.url 请求 URL
 * @param data.params 查询参数
 * @param data.headers 请求头
 * @param sendResponse 响应回调
 */
async function handleEmbySearch(data: { url: string, params: any, headers: any }, sendResponse: (response: any) => void) {
  try {
    // 构建完整的请求 URL
    const url = new URL(data.url)

    // 添加查询参数
    if (data.params) {
      Object.entries(data.params).forEach(([key, value]) => {
        url.searchParams.append(key, value as string)
      })
    }

    // 发送请求
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: data.headers,
    })

    console.log('🚀 ~ file: index.ts:39 ~ response:', response)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const responseData = await response.json()

    sendResponse({
      success: true,
      data: responseData,
    })
  }
  catch (error) {
    console.error('Emby 搜索请求失败:', error)
    sendResponse({
      success: false,
      error: (error as Error).message,
    })
  }
}

/**
 * 处理打开 Emby 标签页请求
 * @param data 请求数据
 * @param data.url 要打开的 URL
 * @param sendResponse 响应回调
 */
async function handleOpenEmbyTab(data: { url: string }, sendResponse: (response: any) => void) {
  try {
    // 使用 Chrome 扩展 API 打开新标签页
    await chrome.tabs.create({
      url: data.url,
      active: true,
    })
    sendResponse({
      success: true,
    })
  }
  catch (error) {
    console.error('打开标签页失败:', error)
    sendResponse({
      success: false,
      error: (error as Error).message,
    })
  }
}

// 监听安装事件
chrome.runtime.onInstalled.addListener(() => {
  console.log('扩展已安装')
})
