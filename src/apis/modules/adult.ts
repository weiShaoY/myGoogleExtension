import { AdultConfig } from '@/configs'

/**
 * 构建 URL（带 query）
 * @param baseUrl 基础地址
 * @param params 查询参数
 */
function buildUrl(baseUrl: string, params: Record<string, any>): string {
  const url = new URL(baseUrl)

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value))
    }
  })

  return url.toString()
}

/**
 * 生成 Emby 首页 URL
 */
function getEmbyHomeUrl(): string {
  const { url, port } = AdultConfig.emby.request

  return `${url}:${port}/web/index.html#!/home`
}

/**
 * 生成 Emby 详情页 URL
 * @param item Emby 项目
 */
function getEmbyItemUrl(item: any): string {
  const { url, port } = AdultConfig.emby.request

  return `${url}:${port}/web/index.html#!/item?id=${item.Id}&serverId=${item.ServerId}`
}

/**
 * 请求 Emby 搜索
 * @param videoName 视频名称
 */
async function requestEmbySearch(videoName: string): Promise<AdultType.EmbyResponse> {
  const { url, port, userId, token } = AdultConfig.emby.request

  const apiUrl = `${url}:${port}/emby/Users/${userId}/Items`

  const params = {
    SearchTerm: videoName,
    Recursive: true,
    Fields: 'PrimaryImageAspectRatio,PremiereDate,ProductionYear',
    EnableUserData: false,
    GroupProgramsBySeries: true,
    Limit: 30,
  }

  const finalUrl = buildUrl(apiUrl, params)

  const res = await fetch(finalUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',

      /**
       * ✅ 正确鉴权方式（关键）
       */
      'X-Emby-Token': token,
    },
  })

  if (!res.ok) {
    const text = await res.text()

    throw new Error(`HTTP ${res.status} - ${text}`)
  }

  return res.json()
}

/**
 * 打开页面
 * @param url 页面地址
 */
function openUrl(url: string): void {
  window.open(url, '_blank')
}

/**
 * Emby 搜索入口
 * @param videoName 视频名称
 */
export async function embySearch(videoName: string) {
  try {
    const result = await requestEmbySearch(videoName)

    console.log('🚀 Emby 搜索结果:', result)

    // 没结果
    if (!result?.Items?.length) {
      window.$messageBox
        .confirm(`是否打开 Emby 首页?`, 'Emby中没有找到该视频!', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .then(() => openUrl(getEmbyHomeUrl()))
        .catch(() => {
          window.$notification.error('Emby中没有找到该视频!')
        })

      return
    }

    if (result.Items.length > 0) {
      for (const item of result.Items) {
        openUrl(getEmbyItemUrl(item))
      }
    }
  }
  catch (error) {
    console.error('❌ Emby 搜索失败:', error)

    window.$notification.error({
      title: '请求失败，请检查 Emby Token / userId / 跨域',
      duration: 5000,
    })
  }
}
