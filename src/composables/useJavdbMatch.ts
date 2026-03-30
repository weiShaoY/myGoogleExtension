import type { FileMatchItemType } from '@/types/content/javdb'

/**
 * JavDB 视频匹配逻辑
 * @returns 匹配相关的状态和方法
 */
export function useJavdbMatch() {
  /**
   * 处理包装器的事件，阻止事件透传到原始页面
   * @param event 事件对象
   */
  function handleWrapperClick(event: Event) {
    event.stopPropagation()
    event.stopImmediatePropagation()
    event.preventDefault()
    return false
  }

  /**
   * 创建匹配结果项
   * @param cleanName 清理后的文件名
   * @param localMatchedFileList 本地匹配的文件列表
   * @param hasChineseTag 是否有中文字幕标签
   * @returns 匹配结果项
   */
  function createMatchResult(
    cleanName: string,
    localMatchedFileList: AdultConfigType.VideoFile[],
    hasChineseTag: boolean,
  ): FileMatchItemType {
    const needsChineseUpdate = localMatchedFileList.some(
      file => !file.hasChineseSubtitle && hasChineseTag,
    )

    return {
      cleanName,
      localMatchedFileList,
      isShowUpdateChinese: needsChineseUpdate,
    }
  }

  /**
   * 检查元素是否存在
   * @param element 元素
   * @returns 是否存在
   */
  function isElementExists(element: any): element is HTMLElement {
    return !!element
  }

  return {
    handleWrapperClick,
    createMatchResult,
    isElementExists,
  }
}
