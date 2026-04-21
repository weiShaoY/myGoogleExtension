/**
 * Emby 相关逻辑
 */

/**
 * 构建 URL（内部小工具）
 */
function buildUrl(baseUrl: string, params?: Record<string, any>) {
  const url = new URL(baseUrl)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value))
    })
  }

  return url.toString()
}

/**
 * Emby 搜索
 */
export async function handleEmbySearch(
  data: {
    url: string
    params?: Record<string, any>
    headers?: Record<string, string>
  },
  sendResponse: (res: any) => void,
) {
  try {
    const url = buildUrl(data.url, data.params)

    const response = await fetch(url, {
      method: 'GET',
      headers: data.headers,
    })

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    const result = await response.json()

    sendResponse({
      success: true,
      data: result,
    })
  }
  catch (error) {
    console.error('Emby 搜索失败:', error)

    sendResponse({
      success: false,
      error: (error as Error).message,
    })
  }
}

/**
 * 打开 Emby 页面
 */
export async function handleOpenEmbyTab(
  data: { url: string },
  sendResponse: (res: any) => void,
) {
  try {
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
