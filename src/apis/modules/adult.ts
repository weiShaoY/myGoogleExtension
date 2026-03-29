import { AdultConfig } from '@/configs'

import { get } from '../http/fetch'

/**
 * 生成 Emby 首页 URL
 * @returns Emby 首页 URL
 */
export function getEmbyHomeUrl(): string {
  const { url, port } = AdultConfig.emby.request

  return `${url}:${port}/web/index.html#!/home`
}

/**
 * 生成 Emby 项目详情页 URL
 * @param item Emby 项目对象
 * @returns Emby 详情页 URL
 */
export function getEmbyItemUrl(item: EmbyItem): string {
  const { url, port } = AdultConfig.emby.request

  return `${url}:${port}/web/index.html#!/item?id=${item.Id}&serverId=${item.ServerId}`
}

/**
 * 搜索 Emby 服务器上的视频
 * @param videoName 视频名称
 * @returns Promise<EmbySearchResponse>
 */
export async function searchEmby(videoName: string): Promise<AdultConfigType.EmbyResponse> {
  const url = `${AdultConfig.emby.request.url}:${AdultConfig.emby.request.port}/emby/Users/${AdultConfig.emby.request.userId}/Items`

  const requestParams = {
    'SearchTerm': videoName,
    'Recursive': true,
    'Fields': 'PrimaryImageAspectRatio,PremiereDate,ProductionYear',
    'EnableUserData': false,
    'GroupProgramsBySeries': true,
    'Limit': 30,

    // Emby 特定的查询参数
    'X-Emby-Client': 'Emby Web',
    'X-Emby-Device-Name': AdultConfig.emby.request.deviceName,
    'X-Emby-Device-Id': AdultConfig.emby.request.deviceId,
    'X-Emby-Client-Version': AdultConfig.emby.request.clientVersion,
    'X-Emby-Token': AdultConfig.emby.request.token,
    'X-Emby-Language': AdultConfig.emby.request.language,
  }

  try {
    const response = await get<AdultConfigType.EmbyResponse>(url, {
      params: requestParams,
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'zh,zh-CN;q=0.9,ja;q=0.8',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
      },
      timeout: 10000,
    })

    return response.data
  }
  catch (error) {
    console.error('Emby 搜索请求失败:', error)
    throw error
  }
}
