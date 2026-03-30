/**
 *  文件夹扫描和监控配置类型
 */
namespace FolderConfigType {

  /**
   *  Emby 文件夹
   */
  export type EmbyFolder = {

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
    folderVideoList: File[]

    /**
     *  文件夹内文件名重复的文件列表。
     */
    folderDuplicateNameFileList: File[]

    /**
     *  文件夹内文件名已去重的文件列表 (每个文件名仅出现一次)。
     */
    folderUniqueFileNameFileList: string[]
  }

  /**
   * 文件元数据信息
   * 用于存储视频文件的完整信息，包括文件名、标签、路径等
   */
  type File = {

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
     * 例如：['Movies', 'Action', '2024']
     */
    directoryPath: string[]

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
}
