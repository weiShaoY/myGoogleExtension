/**
 *  搜索组件配置类型
 */
namespace SearchConfigType {

  /**
   *  搜索引擎站点类型
   */
  export type SiteItem = {

    /** 名称 */
    name: string

    /** 图标 */
    icon: string

    /** 主机名 */
    hostname?: string

    /** 输入框ID */
    inputId?: string

    /** 输入框class */
    inputClass?: string

    /** 输入框索引 */
    inputIndex?: number

    /** 搜索URL */
    searchUrl?: string

    /** 子菜单 */
    siteList?: SiteItem[]
  }

}
