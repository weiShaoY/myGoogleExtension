/** 路由类型 */

/**
 * 路由类型命名空间
 */
declare namespace RouterType {
  import type { Component } from 'vue'

  import type { RouteRecordRedirectOption } from 'vue-router'

  /** 路由类型 */
  type Route = {

    /** 路由路径 */
    path: string

    /** 路由名称（唯一标识） */
    name: string

    /** 重定向地址 */
    redirect?: RouteRecordRedirectOption

    /** 组件路径的异步导入 */
    component?: Component | (() => Promise<Component>)

    /** 路由元信息 */
    meta: {

      /** 菜单显示标题（必填） */
      title: string

      /** 菜单图标组件 */
      icon?: string

      /** 是否在菜单中隐藏该路由 */
      isHideInMenu?: boolean

      /** 进入该路由时激活的菜单键 */
      activeMenu?: string

      /** 是否缓存组件 */
      keepAlive?: boolean

      /** 菜单排序（越小越靠前） */
      order?: number

      /** 文本徽标内容 */
      textBadge?: string

      /** 图标徽标组件（优先级高于textBadge） */
      iconBadge?: string

      /** 若设置，路由将在标签页中固定显示，其值表示固定标签页的顺序（首页是特殊的，它将自动保持fixed） */
      fixedTabIndex?: number

      /**
       * 在快速菜单中的排序（数字越小越靠前）
       * - 如果未定义，则不会出现在快速菜单
       * - 如果定义，则按升序排列
       */
      fastMenuOrder?: number
    } & (
      {

        /** 内嵌iframe地址（禁止同时存在） */
        iframeUrl?: never

        /** 外链跳转地址 */
        externalUrl: string

      }
      | {

        /** 内嵌iframe地址 */
        iframeUrl: string

        /** 外链跳转地址（禁止同时存在） */
        externalUrl?: never
      }
      | {

        /** 内嵌iframe地址（禁止同时存在） */
        iframeUrl?: never

        /** 外链跳转地址（禁止同时存在） */
        externalUrl?: never

      }
    )

    /** 子路由配置（如果存在 externalUrl 或 iframeUrl，则禁止 children） */
    children?: Route[]
  } & (
    | {
      meta: { externalUrl: string } | { iframeUrl: string }

      /** 如果 meta 有 externalUrl 或 iframeUrl，则禁止 children */
      children?: never
    }
    | {
      meta: { externalUrl?: never, iframeUrl?: never }

      /** 如果 meta 没有 externalUrl 或 iframeUrl，则允许 children */
      children?: Route[]
    }
  )
}
