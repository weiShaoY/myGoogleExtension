/**
 * 在线播放相关类型
 */
namespace OnlinePlayConfigType {

  /**
   * 基础站点信息
   */
  export type SiteItemBase = {

    /** 是否显示 */
    isVisible: boolean

    /** 站点名称 */
    name: string

    /** 图标名称 */
    icon: string

    /** 站点主机名 */
    hostname: string

    /** 站点URL模板 */
    searchUrl: string
  }
}
