/**
 * 成人内容全局配置类型定义
 */
type AdultConfigType = {

  /**
   * Emby 媒体服务器相关配置
   */
  emby: {
    request: AdultType.EmbyRequest
  }

  /**
   * 全局通用规则（全项目复用）
   */
  rules: {
    chineseSubtitleRules: string[] // 中文字幕匹配关键词
    videoExtRules: string[] // 视频文件后缀
  }

  /**
   * 种子模块专属配置
   */
  torrent: {
    tagRules: AdultType.TorrentTagRule[]

    sortRules: AdultType.TorrentSortRule[]
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
      '中字',
      '中文',
      '字幕',
      'ch',
      'CH',
      '简中',
      '繁中',
      '汉语',
    ],
  },

  // ==========================================
  // 3. 种子模块（含动态生成正则 + 方法）
  // ==========================================
  torrent: {
    tagRules: [
      {
        names: ['-c', '-C', '_ch', '-UC', '中文'],
        icon: 'tag-ziMu',
      },
      {
        names: ['4K'],
        icon: 'tag-4k',
      },
      {
        names: ['无码'],
        icon: 'tag-wuMa',
      },
      {
        names: ['破解'],
        icon: 'tag-poJie',
      },
      {
        names: ['流出'],
        icon: 'tag-liuChu',
      },
    ],

    sortRules: [
      {
        name: 'UC.torrent.无码破解',
        backgroundColor: '#00FFFF',
        web: '色花堂',
      },
      {
        name: 'U.torrent.无码破解',
        backgroundColor: '#FF9F9F',
        web: '色花堂',
      },
      {
        name: '破解-c',
        backgroundColor: '#00BFFF',
      },
      {
        name: 'UC',
        backgroundColor: '#fca650',
      },
      {
        name: '-c',
        backgroundColor: '#FF6347',
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
        name: 'ch',
        backgroundColor: '#2A9D8F',
      },
      {
        name: '-U',
        backgroundColor: '#8FBC8F',
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
        backgroundColor: '#C75B7A',
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
