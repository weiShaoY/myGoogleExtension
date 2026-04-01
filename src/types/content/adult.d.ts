/**
 * 成人内容相关类型定义
 * @description 包含 Emby 接口、视频文件处理、页面数据结构等全量类型
 */
namespace AdultType {

  /**
   * Emby 请求配置类型
   * @description 连接 Emby 服务器所需的全部请求参数
   */
  type EmbyRequest = {

    /**
     * 服务器的 URL
     * @example "http://192.168.0.3"
     */
    url: string

    /**
     * 服务器的端口号
     * @example "8096"
     */
    port: string

    /**
     * 服务器使用的语言代码
     * @example "zh-cn"
     */
    language: string

    /**
     * 服务器用户 ID
     * @example "705ae9fe2a814cb9bfb4133f2def52e6"
     */
    userId: string

    /**
     * 用户的认证令牌
     * @example "1d454f71e9e14cb0acebf66834d77044"
     */
    token: string

    /**
     * 客户端设备名称（自定义）
     * @description 用于向 Emby 服务器标识当前网页客户端
     * @example "Chrome macOS"
     */
    deviceName: string

    /**
     * 客户端设备唯一ID（自定义）
     * @description 用于区分不同访问者，自行生成 UUID 即可
     * @example "e8b45a84-0a7e-4481-906a-3b0555555e0a"
     */
    deviceId: string

    /**
     * 客户端版本号（自定义）
     * @description 标识当前网页工具的版本，非 Emby 服务端版本
     * @example "4.9.3.0"
     */
    clientVersion: string

    /**
     * 查询参数
     * @description 请求媒体库时的默认查询参数
     */
    queryParams: {

      /**
       * 搜索关键词
       */
      SearchTerm: string

      /**
       * 需要额外返回的媒体信息字段（逗号分隔）
       */
      Fields: string

      /**
       * 是否递归查询子目录
       */
      Recursive: boolean

      /**
       * 是否返回用户数据（收藏/观看记录等）
       */
      EnableUserData: boolean

      /**
       * 是否按剧集系列分组
       */
      GroupProgramsBySeries: boolean

      /**
       * 单次请求最大返回数量
       */
      Limit: number
    }
  }

  /**
   * Emby 媒体库 API 响应标准格式
   * @description 符合 Emby /Items 端点返回的分页列表结构
   */
  type EmbyResponse = {

    /**
     * 符合条件的总记录数
     */
    TotalRecordCount: number

    /**
     * 当前页起始索引
     */
    StartIndex: number

    /**
     * 当前返回条目数量
     */
    ItemsLength: number

    /**
     * 媒体项数组
     */
    Items: {

      /**
       * 媒体唯一ID
       */
      Id: string

      /**
       * 所属服务器ID
       */
      ServerId: string

      /**
       * 媒体名称/标题
       */
      Name: string

      /**
       * 首映日期
       */
      PremiereDate?: string

      /**
       * 制作年份
       */
      ProductionYear?: number

      /**
       * 封面图宽高比
       */
      PrimaryImageAspectRatio?: number

      /**
       * 媒体类型（Movie / Episode / Series 等）
       */
      Type?: string

      /**
       * 海报图片ID
       */
      PrimaryImageItemId?: string

      /**
       * 其他扩展字段
       */
      [key: string]: any
    }[]
  }

  /**
   * 单个视频文件完整信息结构
   * @description 包含原始名称、解析后名称、标签、路径、大小、字幕等全量信息
   */
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
     * 视频文件基础名称（去除扩展名，保留标签）
     * @example IPZZ-105-C-破解
     */
    baseName: string

    /**
     * 标准化纯净名称 （唯一标识)
     * @description 视频文件处理后的名称（去除扩展名、去除所有标签、转换为小写）
     * @description 用于 Emby 媒体库匹配和搜索
     * @example ipzz-105
     */
    cleanName: string

    /**
     * 视频文件标签图标标识数组
     * @description 通过文件名解析得出的标签标识，用于在界面上显示对应的图标
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
     * @description 数组形式，从根目录到文件所在目录的层级结构
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
     * @description 以 GB 为单位，保留两位小数
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
    folderVideoFiles: VideoFile[]

    /**
     * @description 文件夹内全量重复视频文件列表
     * 基于视频文件的 cleanName 不区分大小写进行重复匹配，
     * 包含所有判定为重复的视频文件完整 File 对象（保留全部重复项，不去重），
     * 仅排除无重复的独立文件，所有重复文件都会完整保留在数组中
     * @example 原始视频列表：[aaa-bbb.mp4, aaa-bbb.mp4, aaa-BBB.mp4, ccc-ddd.mp4,eee-fff.mp4, eee-fff.mp4]
     * @example 重复判定依据：cleanName 小写一致视为重复
     * @example 结果：[File(aaa-bbb.mp4), File(aaa-bbb.mp4), File(aaa-BBB.mp4), File(eee-fff.mp4), File(eee-fff.mp4)]
     */
    folderAllDuplicateVideoFiles: VideoFile[]

    /**
     * @description 文件夹内重复视频唯一名称列表
     * 基于视频文件的 cleanName 不区分大小写进行重复匹配，
     * 每组重复文件仅保留一条原始文件名（字符串格式，用于展示重复组标识），
     * 不包含重复项，也不包含无重复的独立文件
     * @example 原始视频列表：[aaa-bbb.mp4, aaa-bbb.mp4, aaa-BBB.mp4, ccc-ddd.mp4,eee-fff.mp4, eee-fff.mp4]
     * @example 重复判定依据：cleanName 小写一致视为重复
     * @example 结果：['aaa-bbb.mp4', 'eee-fff.mp4']
     */
    folderUniqueDuplicateVideoNames: string[]
  }

  /**
   * 页面视频匹配项
   * @description 列表页 / 详情页用于展示匹配结果的结构
   */
  export type PageVideoMatchItem = {

    /**
     * 视频文件标准化纯净名称（去除扩展名、去除所有标签、转换为小写））
     */
    cleanName: string

    /**
     * 是否显示中文字幕更新按钮
     */
    isShowUpdateChinese: boolean

    /**
     * 文件夹中匹配到的视频列表
     */
    folderMatchedVideos: AdultType.VideoFile[]

    /**
     * 唯一标识
     */
    id?: string
  }

  /**
   * 列表页匹配结果数组
   */
  export type ListPageMatchResultList = PageVideoMatchItem[]

  /**
   * 详情页匹配结果
   */
  export type DetailsPageMatchResult = PageVideoMatchItem

  // ! //////////////////////////////  种子 ////////////////////////////////////////

  /**
   * 种子/磁链项的类型
   * 用于存储从种子网站抓取的磁链信息，包含文件名、大小、标签等元数据
   */
  type TorrentItem = {

    /**
     * 磁链/种子链接地址
     * 支持 magnet 链接和 HTTP/HTTPS 链接
     * 例如：'magnet:?xt=urn:btih:...' 或 'https://example.com/file.torrent'
     */
    url: string

    /**
     * 种子文件名（包含标签信息）
     * 用于显示、搜索和标签解析
     * 例如：'Movie.Title.2024.4K.1080p.BluRay.x264'
     */
    name: string

    /**
     * 文件大小（以 GB 为单位）
     * 通过 parseFileSize 函数解析后的标准化大小值
     * 例如：2.5 (表示 2.5GB)
     */
    size: number

    /**
     * 种子发布时间
     * 从种子网站抓取的时间信息，用于排序和显示
     * 格式：'2024-01-15 14:30:00' 或 '2小时前'
     */
    time: string

    /**
     * 种子项的背景颜色（可选）
     * 根据排序规则自动设置，用于在界面上区分不同类型的种子
     * 例如：'#00FFFF', '#FF9F9F'
     */
    backgroundColor?: string

    /**
     * 视频标签图标标识数组
     * 通过文件名解析得出的标签，用于在界面上显示对应的图标
     * 例如：['tag-4k', 'tag-ziMu', 'tag-wuMa']
     */
    tags: string[]

    /**
     * 种子来源网站标识（可选）
     * 用于标识种子来自哪个网站，影响排序优先级和显示样式
     * 例如：'色花堂', '桃花族', 'BT天堂'
     */
    source?: string
  }

  /**
   * 种子列表排序和样式规则配置
   * 用于定义种子列表的排序优先级、背景颜色和来源标识
   * 规则按数组顺序排列，越靠前的规则优先级越高
   */
  type TorrentSortRule = {

    /**
     * 匹配规则名称（关键词）
     * 用于在种子文件名中查找匹配项，支持部分匹配
     * 例如：'4K', '1080p', 'BluRay', '无码破解', '-c'
     * 注意：匹配是大小写敏感的，建议使用小写关键词
     */
    name: string

    /**
     * 匹配上该规则时的背景颜色
     * 用于在界面上突出显示符合规则的种子，提高视觉识别度
     * 建议使用对比度较高的颜色，例如：'#FF6B6B', '#4ECDC4', '#fca650'
     */
    backgroundColor: string

    /**
     * 种子来源网站标识（可选）
     * 用于标识符合该规则的种子来源网站，影响排序和显示
     * 例如：'色花堂', '桃花族', 'BT天堂'
     * 当多个规则匹配时，此属性用于进一步区分优先级
     */
    web?: string
  }

  /**
   * 标签规则配置
   * @description 从文件名匹配标签并映射图标
   */
  type TorrentTagRule = {

    /**
     * 标签图标标识
     * @example 'tag-4k'
     */
    icon: string

    /**
     * 标签匹配关键词
     * @example ['2160P','4K']
     */
    names: string[]

  }
}
