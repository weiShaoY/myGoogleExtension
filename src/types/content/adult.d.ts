/**
 * 成人内容配置类型
 */
namespace AdultConfigType {
  type EmbyRequest = {

    /**
     * Emby 服务器的 URL。
     * @example "http://192.168.0.5"
     */
    url: string

    /**
     * Emby 服务器的端口号。
     * @example "8096"
     */
    port: string

    /**
     * Emby 服务器用户 ID。
     * @example "2409e0a7f21047ba9c74b41be14c6729"
     */
    userId: string

    /**
     * 发起请求的设备名称。
     * @example "Chrome macOS"
     */
    deviceName: string

    /**
     * 发起请求设备的 ID。
     * @example "a6f53c21-ff50-4ccd-a6ba-94f5f4830e87"
     */
    deviceId: string

    /**
     * Emby 客户端的版本号。
     * @example "4.8.11.0"
     */
    clientVersion: string

    /**
     * 用户的认证令牌。
     * @example "8713e19e82f64fd3a50207b0321f3538"
     */
    token: string

    /**
     * Emby 服务器使用的语言代码。
     * @example "zh-cn"
     */
    language: string

    /**
     * 发送到 Emby 服务器的查询字符串参数。
     */
    queryParams: RequestQueryParams
  }
  type EmbyResponse = {
    TotalRecordCount: number

    StartIndex: number

    Items: {
      Id: string
      ServerId: string
      Name: string
      PremiereDate?: string
      ProductionYear?: number
      PrimaryImageAspectRatio?: number

      // 其他可能的字段
      [key: string]: any
    }
  }

  /**
   * 视频文件识别和标签处理配置
   */
  type VideoFileProcessing = {

    /**
     *  文件夹地址
     */
    folderPath: string

    /**
     * 支持的视频文件扩展名列表
     * @example ['mp4', 'mkv', 'avi']
     */
    videoFileExtensions: string[]

    /**
     * 视频文件标签配置列表
     */
    videoFileTagConfigs: {
      names: string[]
      icon: string
    }[]

    /**
     * 用于从视频文件名中提取标签的正则表达式
     */
    videoFileTagExtractionRegex: RegExp

  }

  type VideoFile = {

    /**
     * 唯一标识
     */
    id: string

    /**
     * 视频文件原始完整名称（包含扩展名和所有标签）
     * @example IPZZ-105-C-破解.mp4
     */
    originalName: string

    /**
     * 视频文件基础名称（去除扩展名，保留标签信息）
     * @example IPZZ-105-C-破解
     */
    baseName: string

    /**
     * 视频文件处理后的名称（去除扩展名、去除所有标签、转换为小写）
     * 标准化文件名（唯一标识)
     * 用于 Emby 媒体库匹配和搜索
     * @example ipzz-105
     */
    cleanName: string

    /**
     * 视频文件标签图标标识数组
     * 通过文件名解析得出的标签，用于在界面上显示对应的图标
     * @example ['tag-4k', 'tag-ziMu', 'tag-wuMa']
     */
    tags: string[]

    /**
     * 视频文件扩展名（不含点号）
     * @example 'mp4','mkv','avi'
     */
    extension: string

    /**
     * 视频文件在文件系统中的完整目录路径
     * 数组形式，从根目录到文件所在目录的层级结构
     * @example ["日本-有码", "优梨舞奈","328HMDN-412-C 优梨舞奈","328HMDN-412-C.mp4"]
     */
    filePath: string[]

    /**
     * 视频文件是否包含中文字幕
     * @example（-c, -C, _ch,中文）
     */
    hasChineseSubtitle: boolean

    /**
     * 视频文件大小（格式化后的字符串）
     * 以 GB 为单位，保留两位小数
     * @example '2.45 GB'
     */
    size: string

    /**
     * 视频文件分辨率信息
     * 从 NFO 文件或文件名中提取的分辨率数据
     * @example '720p','1080p','4K'
     */
    resolution: string

  }

  /**
   *  Emby 文件夹
   */
  export type Folder = {

    /**
     *  文件夹名称
     */
    folderName: string

    /**
     * 文件夹扫描时间戳
     */
    folderScanTimestamp: number

    /**
     *  文件夹扫描耗时
     */
    folderScanDuration: string

    /**
     *  文件夹视频列表
     */
    folderVideoFileList: VideoFile[]

    /**
     * @description 文件夹内全量重复视频文件列表
     * 基于视频文件的 cleanName 不区分大小写进行重复匹配，
     * 包含所有判定为重复的视频文件完整 File 对象（保留全部重复项，不去重），
     * 仅排除无重复的独立文件，所有重复文件都会完整保留在数组中
     * @example 原始视频列表：[aaa-bbb.mp4, aaa-bbb.mp4, aaa-BBB.mp4, ccc-ddd.mp4,eee-fff.mp4, eee-fff.mp4]
     * @example 重复判定依据：cleanName 小写一致视为重复
     * @example 结果：[File(aaa-bbb.mp4), File(aaa-bbb.mp4), File(aaa-BBB.mp4), File(eee-fff.mp4), File(eee-fff.mp4)]
     */
    folderDuplicateVideoFileList: VideoFile[]

    /**
     * @description 文件夹内重复视频唯一名称列表
     * 基于视频文件的 cleanName 不区分大小写进行重复匹配，
     * 每组重复文件仅保留一条原始文件名（字符串格式，用于展示重复组标识），
     * 不包含重复项，也不包含无重复的独立文件
     * @example 原始视频列表：[aaa-bbb.mp4, aaa-bbb.mp4, aaa-BBB.mp4, ccc-ddd.mp4,eee-fff.mp4, eee-fff.mp4]
     * @example 重复判定依据：cleanName 小写一致视为重复
     * @example 结果：['aaa-bbb.mp4', 'eee-fff.mp4']
     */
    folderUniqueVideoNameList: string[]
  }

  /**
   * 文件识别和标签处理配置
   */
  type FileProcessing = {

    /**
     *  文件夹地址
     */
    folderPath: string

    /**
     * 支持的视频文件扩展名列表
     */
    fileExtensions: string[]

    /**
     * 视频标签配置列表
     */
    fileTagConfigs: {
      names: string[]
      icon: string
    }[]

    /**
     * 用于从文件名中提取标签的正则表达式
     */
    fileTagExtractionRegex: RegExp

  }

  // # 页面视频匹配结果项接口

  /**
   * 页面视频匹配结果项
   */
  export type PageVideoMatchItem = {

    /** 视频文件处理后的名称（去除扩展名、去除所有标签、转换为小写）） */
    cleanName: string

    /** 是否显示中文字幕更新按钮 */
    isShowUpdateChinese: boolean

    /** 文件夹中匹配到的视频列表 */
    folderMatchedVideoList: AdultConfigType.VideoFile[]
  }

  /**
   * 列表页匹配结果列表类型
   */
  export type ListPageMatchResultList = PageVideoMatchItem[]

  /**
   * 详情页匹配结果类型
   */
  export type DetailsPageMatchResult = PageVideoMatchItem
}
