import {
  isCaseInsensitiveEqual,
  isErrorCode,
  regEnum,
} from './'

import { gmGet } from './gmRequest'

/**
 * 针对视频播放页进行解析，寻找字幕等信息
 * @param responseText - 页面响应文本
 * @param domQuery - 包含字幕、泄露、视频查询选择器的对象
 * @returns 包含是否成功、是否有字幕、是否有码泄露的对象
 */
function parseVideoPage(
  responseText: string,
  domQuery: OnlinePlayConfigType.DomQuery,
): OnlinePlayConfigType.SiteRequestResponse {
  /**
   * 将响应文本解析为DOM文档
   */
  const doc = new DOMParser().parseFromString(responseText, 'text/html')

  /**
   *  查找字幕信息节点
   */
  const subNode = domQuery.subQuery ? doc.querySelector<HTMLElement>(domQuery.subQuery) : null

  /**
   *  获取字幕节点的HTML内容
   */
  const subNodeText = subNode?.innerHTML || ''

  /**
   *  查找泄露资源信息节点
   */
  const leakNode = domQuery.leakQuery ? doc.querySelector<HTMLElement>(domQuery.leakQuery) : null

  /**
   *  获取泄露资源节点的HTML内容
   */
  const leakNodeText = leakNode?.innerHTML || ''

  /**
   *  查找视频资源信息节点
   */
  const videoNode = domQuery.videoQuery ? doc.querySelector<HTMLElement>(domQuery.videoQuery) : true

  return {
    requestStatus: !!videoNode,
    hasSubtitle: regEnum.subtitle.test(subNodeText),
    hasLeakage: regEnum.leakage.test(leakNodeText),
    targetLink: '',
  }
}

/**
 * 针对搜索结果页进行解析，寻找是否存在视频资源
 * @param responseText - 页面响应文本
 * @param domQuery - 包含链接、标题查询选择器的对象
 * @param siteHostName - 网站的主机名
 * @param code - 视频代码
 * @returns 包含是否成功、目标链接、是否有码泄露、是否有字幕的对象
 */
function parseSearchPage(
  responseText: string,
  domQuery: OnlinePlayConfigType.DomQuery,
  siteHostName: string,
  code: string,
): OnlinePlayConfigType.SiteRequestResponse {
  const doc = new DOMParser().parseFromString(responseText, 'text/html')

  const linkNode = domQuery.linkQuery ? doc.querySelectorAll<HTMLAnchorElement>(domQuery.linkQuery)[domQuery.listIndex ?? 0] : null

  const titleNode = domQuery.titleQuery ? doc.querySelectorAll(domQuery.titleQuery)[domQuery.listIndex ?? 0] : null

  const titleNodeText = titleNode?.outerHTML || ''

  const codeRegex = /[a-z]{3,5}-\d{3,5}/i

  const matchCode = titleNodeText.match(codeRegex)

  const isSuccess = linkNode && titleNode && matchCode && isCaseInsensitiveEqual(matchCode[0], code)

  if (isSuccess && linkNode) {
    const targetLink = linkNode.href.replace(linkNode.host, siteHostName)

    return {
      requestStatus: true,
      targetLink,
      hasLeakage: regEnum.leakage.test(titleNodeText),
      hasSubtitle: regEnum.subtitle.test(titleNodeText),
    }
  }

  return {
    requestStatus: false,
    targetLink: '',
    hasLeakage: false,
    hasSubtitle: false,
  }
}

/**
 * 处理站点请求
 * @param siteItem - 站点配置项
 * @param url - 请求URL
 * @param code - 视频代码
 * @returns 站点响应结果
 */
export async function handleFetch(
  siteItem: OnlinePlayConfigType.SiteItem,
  url: string,
  code: string,
): Promise<OnlinePlayConfigType.SiteRequestResponse> {
  try {
    const response = await gmGet(url)

    if (
      siteItem.name === '18av'
      || siteItem.name === 'NETFLAV'
      || siteItem.name === 'paipancon'
      || siteItem.name === 'GGJAV'
      || siteItem.name === 'AV01'
      || siteItem.name === 'highporn'
    ) {
      console.log(`%c Line:111 🍅 ${siteItem.name}  ${siteItem.fetchType}`, 'color:#e41a6a', response)
    }

    if (isErrorCode(response.status)) {
      console.log(`%c Line:111 🍅  ${siteItem.name}  ${siteItem.fetchType}`, 'color:#e41a6a', response)

      return {
        requestStatus: false,
        targetLink: '',
        hasSubtitle: false,
        hasLeakage: false,
      }
    }

    if (siteItem.fetchType === 'get') {
      return parseVideoPage(response.responseText, siteItem.domQuery)
    }
    else if (siteItem.fetchType === 'parser') {
      return parseSearchPage(response.responseText, siteItem.domQuery, siteItem.hostname, code)
    }

    return {
      requestStatus: false,
      targetLink: '',
      hasSubtitle: false,
      hasLeakage: false,
    }
  }
  catch (error) {
    console.error('请求失败:', error)
    return {
      requestStatus: false,
      targetLink: '',
      hasSubtitle: false,
      hasLeakage: false,
    }
  }
}

/**
 * 处理 Jable 站点的特殊请求
 * @param siteItem - 站点配置项
 * @param url - 请求URL
 * @param _code - 视频代码（未使用）
 * @returns 站点响应结果
 */
export async function handleFetchJavBle(
  siteItem: OnlinePlayConfigType.SiteItem,
  url: string,
  _code: string,
): Promise<OnlinePlayConfigType.SiteRequestResponse> {
  try {
    const response = await gmGet(url)

    if (isErrorCode(response.status)) {
      return {
        requestStatus: false,
        targetLink: '',
        hasSubtitle: false,
        hasLeakage: false,
      }
    }

    return parseVideoPage(response.responseText, siteItem.domQuery)
  }
  catch (error) {
    console.error('Jable 请求失败:', error)
    return {
      requestStatus: false,
      targetLink: '',
      hasSubtitle: false,
      hasLeakage: false,
    }
  }
}
