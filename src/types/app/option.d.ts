/**
 * Option 模块类型定义
 * @description 定义设置页面相关的类型
 */

declare global {
  interface Window {
    $notification: {
      success: (options: { title: string; message?: string; duration?: number }) => void
      error: (options: { title: string; message?: string; duration?: number }) => void
      warning: (options: { title: string; message?: string; duration?: number }) => void
      info: (options: { title: string; message?: string; duration?: number }) => void
    }
  }
}

/**
 * 菜单项类型
 */
export interface MenuItem {
  index: string
  title: string
  icon: string
  children?: MenuItem[]
}

/**
 * 路由元信息类型
 */
export interface RouteMeta {
  title: string
  icon?: string
  requiresAuth?: boolean
  keepAlive?: boolean
}

/**
 * 路由配置类型
 */
export interface RouteConfig {
  path: string
  name: string
  component: () => Promise<any>
  meta: RouteMeta
}

export {}
