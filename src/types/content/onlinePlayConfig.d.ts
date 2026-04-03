/**
 * 在线播放相关类型
 */
namespace OnlinePlayConfigType {

  /**
   * 基础站点信息
   */
  export type SiteItemBase = {

    /** 是否显示 */
    isVisible: boolean

    /** 站点名称 */
    name: string

    /** 图标名称 */
    icon: string

    /** 站点主机名 */
    hostname: string

    /** 站点URL模板 */
    searchUrl: string

    /** 代码格式化函数 */
    codeFormater?: (code: string) => string
  }

  /**
   * DOM查询配置
   */
  export type DomQuery = {

    /** 链接查询选择器 */
    linkQuery?: string

    /** 标题查询选择器 */
    titleQuery?: string

    /** 视频查询选择器 */
    videoQuery?: string

    /** 字幕查询选择器 */
    subQuery?: string

    /** 泄露资源查询选择器 */
    leakQuery?: string

    /** 搜索结果索引 */
    listIndex?: number

    /** 是否使用空格分隔代码 */
    spaceCode?: boolean
  }

  /**
   * 站点配置项
   */
  export type SiteItem = {

    /** 获取类型 */
    fetchType: 'get' | 'parser' | 'post' | 'false'

    /** DOM查询配置 */
    domQuery: DomQuery

    /** POST请求参数（仅post类型需要） */
    postParams?: Record<string, any>
  } & SiteItemBase

  /**
   * 站点状态
   */
  export type SiteRequestStatus = {

    /** 请求状态 */
    requestStatus: 'pending' | 'fulfilled' | 'rejected'

    /** 是否有字幕 */
    hasSubtitle: boolean

    /** 是否有泄露资源 */
    hasLeakage: boolean

    /** 目标链接 */
    targetLink: string
  }

  /**
   * 站点响应结果
   */
  export type SiteRequestResponse = {

    /** 是否成功 */
    requestStatus: boolean

    /** 是否有字幕 */
    hasSubtitle: boolean

    /** 是否有泄露资源 */
    hasLeakage: boolean

    /** 目标链接 */
    targetLink: string
  }

  /**
   * 正则表达式配置
   */
  export type RegExpConfig = {

    /** 字幕匹配正则 */
    subtitle: RegExp

    /** 泄露资源匹配正则 */
    leakage: RegExp
  }

}
