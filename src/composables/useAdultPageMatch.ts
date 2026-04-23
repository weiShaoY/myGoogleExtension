/**
 * 成人网站 视频匹配相关组合式函数
 * @description 封装成人网站 页面与本地视频匹配的核心逻辑、工具方法
 * @returns  包含匹配相关的事件处理、结果创建、元素校验方法
 */
export function useAdultPageMatch() {
  /**
   * 清洗视频名称：小写 + 去空格
   */
  function cleanVideoName(name: string | null | undefined): string {
    if (!name) {
      return ''
    }

    return name.trim()
      .toLowerCase()
      .replace(/\s+/g, '')
  }

  // getFolderMatchedVideoList

  /**
   * 创建视频匹配结果项
   * @description 根据清理后的文件名、匹配到的视频列表、字幕标签，生成页面所需的匹配结果结构
   * @param  cleanName - 视频标准化纯净名称（去标签、去扩展名、小写）
   * @param  folderMatchedVideos - 文件夹中与当前名称匹配的所有视频文件列表
   * @param  hasChineseTag - 当前匹配项是否包含中文字幕标签
   * @returns 符合页面展示规范的匹配结果项
   */
  function createMatchResult(
    cleanName: string,
    folderMatchedVideos: AdultType.VideoFile[],
    hasChineseTag: boolean,
    teleportTarget = '',
  ): AdultType.PageVideoMatchItem {
    // 判断是否需要显示中文字幕更新按钮：
    // 1. 必须有中文字幕标签
    // 2. 所有视频都没有中文字幕（只要有一个视频有中文字幕，就不显示更新按钮）
    const needsChineseUpdate = hasChineseTag && folderMatchedVideos.every(
      file => !file.hasChineseSubtitle,
    )

    return {
      cleanName,
      folderMatchedVideos,
      isShowUpdateChinese: needsChineseUpdate,
      teleportTarget,
    }
  }

  return {
    cleanVideoName,
    createMatchResult,
  }
}
