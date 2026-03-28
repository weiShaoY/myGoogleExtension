/**
 * Emby API 模块
 * @description 封装 Emby 服务器相关的 API 请求
 */

import { EmbyConfig } from '@/configs'

import { get } from '../index'

/**
 * Emby 搜索结果项接口
 */
type EmbyItem = {
  Id: string
  ServerId: string
  Name: string
  PremiereDate?: string
  ProductionYear?: number
  PrimaryImageAspectRatio?: number

  // 其他可能的字段
  [key: string]: any
}

/**
 * Emby 搜索响应接口
 */
type EmbySearchResponse = {
  Items: EmbyItem[]
  TotalRecordCount: number
  StartIndex: number
}

/**
 * 构建 Emby 请求 URL
 * @param videoName 视频名称
 * @returns 完整的请求 URL
 */
export function buildRequestUrl(videoName: string): string {
  console.log('🚀 ~ file: emby.ts:40 ~ videoName:', videoName)
  const { url, port, userId } = EmbyConfig.request

  return `${url}:${port}/emby/Users/${userId}/Items`
}

/**
 * 构建 Emby 请求参数
 * @param videoName 视频名称
 * @returns 请求参数对象
 */
export function buildRequestParams(videoName: string): Record<string, any> {
  const { deviceName, deviceId, clientVersion, token, language } = EmbyConfig.request

  return {
    'SearchTerm': videoName,
    'Recursive': true,
    'Fields': 'PrimaryImageAspectRatio,PremiereDate,ProductionYear',
    'EnableUserData': false,
    'GroupProgramsBySeries': true,
    'Limit': 30,

    // Emby 特定的查询参数
    'X-Emby-Client': 'Emby Web',
    'X-Emby-Device-Name': deviceName,
    'X-Emby-Device-Id': deviceId,
    'X-Emby-Client-Version': clientVersion,
    'X-Emby-Token': token,
    'X-Emby-Language': language,
  }
}

/**
 * 生成 Emby 项目详情页 URL
 * @param item Emby 项目对象
 * @returns Emby 详情页 URL
 */
export function getEmbyItemUrl(item: EmbyItem): string {
  const { url, port } = EmbyConfig.request

  return `${url}:${port}/web/index.html#!/item?id=${item.Id}&serverId=${item.ServerId}`
}

/**
 * 生成 Emby 首页 URL
 * @returns Emby 首页 URL
 */
export function getEmbyHomeUrl(): string {
  const { url, port } = EmbyConfig.request

  return `${url}:${port}/web/index.html#!/home`
}

/**
 * 搜索 Emby 服务器上的视频
 * @param videoName 视频名称
 * @returns Promise<EmbySearchResponse>
 */
export async function searchEmby(videoName: string): Promise<EmbySearchResponse> {
  const url = buildRequestUrl(videoName)

  const params = buildRequestParams(videoName)

  try {
    const response = await get<EmbySearchResponse>(url, {
      params,
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
