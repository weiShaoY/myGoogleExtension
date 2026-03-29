/**
 * JavDB 页面相关类型
 */

/**
 * 视频匹配结果项接口
 */
export type FileMatchItemType = {

  /** 清理后的文件名（用于标识） */
  cleanName: string

  /** 本地匹配到的视频文件数组 */
  localMatchedFileList: FolderConfigType.File[]

  /** 是否显示更新中文字幕按钮 */
  isShowUpdateChinese: boolean
}

/**
 * 列表页匹配结果列表类型
 */
export type ListPageMatchResultList = FileMatchItemType[]

/**
 * 详情页匹配结果类型
 */
export type DetailsPageMatchResult = FileMatchItemType
