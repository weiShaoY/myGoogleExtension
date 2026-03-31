type AdultConfigType = {
  emby: {
    request: AdultType.EmbyRequest
  }
  videoFileMatch: AdultType.VideoFileMatch
}

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

  videoFileMatch: {
    videoFileExtensions: ['mp4', 'mkv', 'avi', 'flv', 'wmv', 'mov', 'rmvb'],

    videoFileTags: [
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
    ],

    // 一次性生成的正则表达式，避免重复计算
    videoFileTagExtractionRegex: (() => {
      const tagsPattern = ['4K', '-c', '-C', '_ch', '-UC', '无码', '破解', '流出']
        .map((name) => {
          const escaped = name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')

          return name.startsWith('-') ? escaped : `-?${escaped}`
        })
        .join('|')

      return new RegExp(tagsPattern, 'gi')
    })(),

  },
}
