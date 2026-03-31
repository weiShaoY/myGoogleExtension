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
   * 视频文件匹配与标签解析配置
   */
  videoFileMatch: AdultType.VideoFileMatch & {

    /**
     * 根据视频文件名提取标签图标
     */
    getVideoTagsFromName: (fullName: string) => string[]
  }
}

/**
 * 成人内容全局配置
 * @description 包含 Emby 请求、视频标签规则、文件后缀、正则匹配及工具方法
 */
export const AdultConfig: AdultConfigType = {
  emby: {
    request: {
      url: 'http://192.168.0.3',
      port: '8096',
      userId: '705ae9fe2a814cb9bfb4133f2def52e6',
      deviceName: 'Chrome macOS',
      deviceId: 'e8b45a84-0a7e-4481-906a-3b0555555e0a',
      clientVersion: '4.9.3.0',
      token: '1d454f71e9e14cb0acebf66834d77044',
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

  videoFileMatch: (() => {
    /**
     * 支持的视频文件扩展名
     */
    const videoFileExtensions = ['mp4', 'mkv', 'avi', 'flv', 'wmv', 'mov', 'rmvb']

    /**
     * 标签匹配规则
     */
    const videoFileTags = [
      {
        names: ['4K'],
        icon: 'tag-4k',
      },
      {
        names: ['-c', '-C', '_ch', '-UC'],
        icon: 'tag-ziMu',
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
    ]

    /**
     * 自动从标签生成正则表达式
     */
    const videoFileTagExtractionRegex = new RegExp(
      videoFileTags
        .flatMap(tag => tag.names)
        .map((name) => {
          const escaped = name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')

          return name.startsWith('-') ? escaped : `-?${escaped}`
        })
        .join('|'),
      'gi',
    )

    return {
      videoFileExtensions,
      videoFileTags,
      videoFileTagExtractionRegex,

      /**
       * 从文件名提取匹配的标签图标数组
       * @description 自动识别标签并返回对应图标，自动去重，大小写不敏感
       * @param fullName 视频完整名称（含扩展名）
       * @returns 图标名称数组
       */
      getVideoTagsFromName(fullName: string): string[] {
        const matches = [...fullName.matchAll(videoFileTagExtractionRegex)]

        if (matches.length === 0) {
          return []
        }

        const lowerMatches = matches.map(m => m[0].toLowerCase())

        const icons: string[] = []

        for (const tag of videoFileTags) {
          const hit = tag.names.some(n => lowerMatches.includes(n.toLowerCase()))

          if (hit) {
            icons.push(tag.icon)
          }
        }

        return [...new Set(icons)]
      },
    }
  })(),
}
