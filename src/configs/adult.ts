/**
 * 成人内容全局配置文件
 * @description 包含 Emby 服务器配置、全局规则等全项目复用的配置项
 */

/**
 * 成人内容全局配置类型定义
 * @description 定义成人内容模块的全局配置结构
 */
type AdultConfigType = {

  /**
   * Emby 媒体服务器相关配置
   * @description 连接和请求 Emby 服务器的配置信息
   */
  emby: {

    /**
     * Emby 服务器请求配置
     * @description 包含连接 Emby 服务器所需的全部请求参数
     */
    request: AdultType.EmbyRequest
  }

  /**
   * 文件夹相关配置
   * @description 包含文件夹相关的配置信息
   */
  folder: {

    /**
     * 文件夹路径（不含文件）
     * @description 包含文件夹路径的配置信息
     */
    dirPath: string
  }

  /**
   * 在线播放站点配置列表
   * @description
   * 用于定义外部视频站点的搜索/播放规则配置，
   * 通过 hostname + searchUrl 模板拼接实现跳转到不同站点。
   * 支持在全局多个模块中复用（如：视频列表、详情页、右键菜单等）
   */
  siteList: {

    /**
     * 是否在界面中显示该站点
     * @description 控制该站点是否参与渲染（不影响逻辑调用）
     */
    isVisible: boolean

    /**
     * 站点名称
     * @example "JavDB"
     */
    name: string

    /**
     * 站点图标标识
     * @description 用于 UI 图标渲染（通常对应 SvgIcon key）
     * @example "content-adult-site-javDB"
     */
    icon: string

    /**
     * 站点域名
     * @description 用于标识站点来源或做白名单/匹配判断
     * @example "javdb.com"
     */
    hostname: string

    /**
     * 搜索 / 播放路径模板
     * @description
     * 支持 {{code}} 占位符，会被视频文件名或番号替换
     * @example "/search?q={{code}}"
     * @example "/videos/{{code}}/"
     */
    searchUrl: string
  }[]

  /**
   * 全局通用规则（全项目复用）
   * @description 适用于整个项目的规则配置，包括字幕匹配、文件类型等
   */
  rules: {

    /**
     * 中文字幕匹配关键词
     * @description 用于识别文件名中是否包含中文字幕信息的关键词列表
     */
    chineseSubtitleRules: string[]

    /**
     * 视频文件后缀
     * @description 支持的视频文件扩展名列表（不含点号）
     */
    videoExtRules: string[]

    /**
     * 种子标签规则
     * @description 从种子文件名匹配标签并映射到对应图标的规则配置
     */
    torrentTagRules: AdultType.TorrentTagRule[]

    /**
     * 种子排序规则
     * @description 定义种子列表的排序优先级、背景颜色和来源标识的规则配置
     */
    torrentSortRules: AdultType.TorrentSortRule[]
  }
}

/**
 * 成人内容全局配置
 * @config 纯数据 + 动态生成的正则与方法
 */
export const AdultConfig: AdultConfigType = {
  // ==========================================
  // 1. 第三方服务配置（仅连接信息）
  // ==========================================
  emby: {
    request: {
      url: 'http://192.168.0.3',
      port: '8096',
      userId: '705ae9fe2a814cb9bfb4133f2def52e6',
      deviceName: 'Chrome macOS',
      deviceId: 'e8b45a84-0a7e-4481-906a-3b0555555e0a',
      clientVersion: '4.9.3.0',
      token: '1d44f71e9e14cb0acebf66834d77044',
      language: 'zh-cn',
      queryParams: {
        SearchTerm: '',
        Recursive: true,
        Fields: 'PrimaryImageAspectRatio,PremiereDate,ProductionYear',
        EnableUserData: false,
        GroupProgramsBySeries: true,
        Limit: 30,
      },
    },
  },

  folder: {

    dirPath: 'Z:/日本-有码/',
  },
  siteList: [
    {
      isVisible: true,
      name: 'JavDB',
      icon: 'adult-site-javDB',
      hostname: 'javdb.com',
      searchUrl: '/search?q={{code}}',

    },

    {
      isVisible: true,
      name: 'JavBus',
      icon: 'adult-site-javBus',
      hostname: 'javbus.com',
      searchUrl: '/{{code}}',

    },
    {
      isVisible: true,
      name: 'MISSAV',
      icon: 'adult-site-missAv',
      hostname: 'missav.ai',
      searchUrl: '/{{code}}/',
    },
  ],

  // ==========================================
  // 2. 全局通用规则

  // ==========================================
  rules: {
    /**
     * 支持的视频扩展名列表（不含点）
     * @example ['mp4', 'mkv', 'avi', 'flv']
     */
    videoExtRules: [
      'mp4',
      'mkv',
      'avi',
      'flv',
      'wmv',
      'mov',
      'rmvb',
      'webm',
    ],

    chineseSubtitleRules: [
      '-c',
      '-C',
      '_ch',
      '-UC',
      '中文',
    ],

    /**
     * 种子标签规则
     */
    torrentTagRules: [
      {
        names: ['-c', '-C', '_ch', '-UC', '中文'],
        icon: 'adult-tag-ziMu',
      },
      {
        names: ['4K'],
        icon: 'adult-tag-4k',
      },
      {
        names: ['无码'],
        icon: 'adult-tag-wuMa',
      },
      {
        names: ['破解'],
        icon: 'adult-tag-poJie',
      },
      {
        names: ['流出'],
        icon: 'adult-tag-liuChu',
      },
    ],

    /**
     * 种子排序规则
     */
    torrentSortRules: [
      {
        name: 'UC.torrent.无码破解',
        backgroundColor: '#f12e01',
        web: '色花堂',
      },
      {
        name: 'U.torrent.无码破解',
        backgroundColor: '#2accea',
        web: '色花堂',
      },
      {
        name: '破解-c',
        backgroundColor: '#8441d8',
      },
      {
        name: 'UC',
        backgroundColor: '#7baefe',
      },
      {
        name: '-c',
        backgroundColor: '#25c9ba',
      },
      {
        name: '-C.torrent',
        backgroundColor: '#FF1166',
        web: '色花堂',
      },
      {
        name: '-C',
        backgroundColor: '#2668B5',
      },
      {
        name: '中文',
        backgroundColor: '#fe5f60',
      },
      {
        name: 'ch',
        backgroundColor: '#b6d984',
      },
      {
        name: '-U',
        backgroundColor: '#e147a3',
      },
      {
        name: 'ThZu.Cc',
        backgroundColor: '#FF4900',
        web: '桃花族',
      },
      {
        name: '4K-破解',
        backgroundColor: '#9BEC00',
      },
      {
        name: '4k',
        backgroundColor: '#e7bc86',
      },
      {
        name: '无码破解',
        backgroundColor: '#DDDD22',
      },
      {
        name: '无码',
        backgroundColor: '#95D2B3',
      },
    ],
  },

}
