/**
 * 搜索功能相关类型定义
 * @description 包含搜索组件的配置类型定义
 * @namespace SearchConfigType
 */

namespace SearchConfigType {

  /**
   * 搜索组件显示的网站路径列表
   * @description 定义在哪些网站路径上显示搜索组件
   * @example ["google.com/search", "baidu.com/s"]
   */
  export type displayOnPaths = string[]

  /**
   * 搜索引擎站点类型
   * @description 定义搜索引擎站点的配置结构
   */
  export type SiteItem = {

    /**
     * 站点名称
     * @description 搜索引擎或网站的名称
     * @example "Google", "百度"
     */
    name: string

    /**
     * 站点图标
     * @description 站点的图标标识
     * @example "google", "baidu"
     */
    icon: string

    /**
     * 主机名
     * @description 站点的主机名，用于识别当前网站
     * @example "google.com", "baidu.com"
     */
    hostname?: string

    /**
     * 输入框ID
     * @description 搜索输入框的DOM ID
     * @example "APjFqb", "chat-textarea"
     */
    inputId?: string

    /**
     * 输入框class
     * @description 搜索输入框的DOM class
     * @example "input.search-input"
     */
    inputClass?: string

    /**
     * 输入框索引
     * @description 当页面有多个输入框时，指定使用第几个
     * @example 1
     */
    inputIndex?: number

    /**
     * 搜索URL
     * @description 站点的搜索URL，用于构建搜索链接
     * @example "https://www.google.com/search?q="
     */
    searchUrl?: string

    /**
     * 子菜单
     * @description 包含子站点的数组，用于创建多级菜单
     */
    siteGroups?: SiteItem[]
  }

}
