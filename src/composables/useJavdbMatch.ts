/**
 * JavDB 视频匹配相关组合式函数
 * @description 封装 JavDB 页面与本地视频匹配的核心逻辑、工具方法
 * @returns  包含匹配相关的事件处理、结果创建、元素校验方法
 */
export function useJavdbMatch() {
  /**
   * 处理包装器点击事件，阻止事件透传
   * @description 防止点击自定义组件时，事件冒泡到 JavDB 原始页面，避免触发页面默认行为
   * @param event 事件对象
   * @returns  返回 false，进一步阻止默认行为
   */
  function handleWrapperClick(event: Event) {
    // 阻止事件冒泡到父元素（原始页面）
    event.stopPropagation()

    // 阻止同元素上其他事件监听器执行
    event.stopImmediatePropagation()

    // 阻止事件默认行为（如链接跳转、表单提交）
    event.preventDefault()
    return false
  }

  /**
   * 创建视频匹配结果项
   * @description 根据清理后的文件名、匹配到的视频列表、字幕标签，生成页面所需的匹配结果结构
   * @param  cleanName - 视频标准化纯净名称（去标签、去扩展名、小写）
   * @param  folderMatchedVideoList - 文件夹中与当前名称匹配的所有视频文件列表
   * @param  hasChineseTag - 当前匹配项是否包含中文字幕标签
   * @returns 符合页面展示规范的匹配结果项
   */
  function createMatchResult(
    cleanName: string,
    folderMatchedVideoList: AdultType.VideoFile[],
    hasChineseTag: boolean,
  ): AdultType.PageVideoMatchItem {
    // 判断是否需要显示中文字幕更新按钮：存在无中文字幕但有字幕标签的视频
    const needsChineseUpdate = folderMatchedVideoList.some(
      file => !file.hasChineseSubtitle && hasChineseTag,
    )

    return {
      cleanName,
      folderMatchedVideoList,
      isShowUpdateChinese: needsChineseUpdate,
    }
  }

  /**
   * 校验元素是否为有效的 HTMLElement
   * @description 用于避免 DOM 操作时出现类型错误，过滤无效元素（null/undefined/非DOM元素）
   * @param  element - 需要校验的元素（可能为 null、undefined 或非 DOM 元素）
   * @returns  类型守卫，返回 true 则元素为有效的 HTMLElement
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
