import { IFRAME_LAYOUT } from '@/option/layouts'

import { router } from '@/option/router/index'

/**
 * 基础递归路由处理函数
 * @param routes 路由数组
 * @param handler 路由处理回调
 * @param parentPath 父路径（用于路径处理）
 * @returns 处理后的新路由数组
 * @example
 * // 为所有路由添加前缀
 * const routes = recursiveWalkRoutes(routes, (route, parentPath) => {
 *   route.path = `/prefix${route.path}`
 * })
 *
 * // 为所有路由添加 meta 信息
 * const routes = recursiveWalkRoutes(routes, (route) => {
 *   route.meta = { ...route.meta, isNew: true }
 * })
 */
function recursiveWalkRoutes<T extends { path: string, children?: T[] }>(
  routes: T[],
  handler: (route: T, parentPath?: string) => void,
  parentPath: string = '',
): T[] {
  return routes.map((route) => {
    const newRoute = {
      ...route,
    } // 创建副本避免修改原对象

    handler(newRoute, parentPath) // 执行处理逻辑

    // 递归处理子路由
    if (newRoute.children) {
      newRoute.children = recursiveWalkRoutes(
        newRoute.children,
        handler,
        newRoute.path, // 传递当前路径作为子路由的父路径
      )
    }

    return newRoute
  })
}

/**
 * 递归规范化路由完整路径
 * @param routes 路由配置数组
 * @returns 带完整路径的新路由数组
 * @example
 * // 规范化路由路径
 * const routes = [
 *   { path: 'home', children: [{ path: 'about' }] },
 *   { path: 'user', children: [{ path: 'profile' }] }
 * ]
 * const normalizedRoutes = recursiveNormalizeRoutesPath(routes, '/app')
 * // 结果:
 * // [
 * //   { path: '/app/home', children: [{ path: '/app/home/about' }] },
 * //   { path: '/app/user', children: [{ path: '/app/user/profile' }] }
 * // ]
 */
export function recursiveNormalizeRoutesPath(routes: any[], parentPath = ''): any[] {
  return recursiveWalkRoutes(routes, (route, _parentPath = parentPath) => {
    if (!route.path.startsWith('/')) {
      route.path = `${_parentPath}${_parentPath.endsWith('/') ? '' : '/'}${route.path}`
        .replace(/\/+/g, '/')
    }
  }, parentPath)
}

/**
 * 递归设置路由默认重定向
 * @param routes 路由数组
 * @returns 带默认重定向的新路由数组
 * @example
 * // 设置默认重定向
 * const routes = [
 *   { path: '/police', children: [{ path: 'dashboard' }, { path: 'users' }] },
 *   { path: '/admin', children: [{ path: 'posts' }, { path: 'categories' }] }
 * ]
 * const routesWithRedirect = recursiveSetRoutesRedirect(routes)
 * // 结果:
 * // [
 * //   { path: '/police', redirect: '/police/dashboard', children: [...] },
 * //   { path: '/admin', redirect: '/admin/posts', children: [...] }
 * // ]
 */
export function recursiveSetRoutesRedirect(routes: any[]): any[] {
  return recursiveWalkRoutes(routes, (route) => {
    if (!route.redirect && route.children?.length) {
      const firstChild = route.children[0]

      route.redirect = firstChild.path.startsWith('/')
        ? firstChild.path
        : `${route.path}/${firstChild.path}`.replace(/\/+/g, '/')
    }
  })
}

/**
 * 递归按order排序路由（修复版）
 * @param routes 路由数组
 * @returns 排序后的新路由数组
 * @example
 * // 按 order 排序路由
 * const routes = [
 *   { path: '/c', meta: { order: 3 } },
 *   { path: '/a', meta: { order: 1 } },
 *   { path: '/b', meta: { order: 2 } }
 * ]
 * const sortedRoutes = recursiveSortRoutesByOrder(routes)
 * // 结果:
 * // [
 * //   { path: '/a', meta: { order: 1 } },
 * //   { path: '/b', meta: { order: 2 } },
 * //   { path: '/c', meta: { order: 3 } }
 * // ]
 */
export function recursiveSortRoutesByOrder(routes: any[]): any[] {
  // 1. 对当前层级路由排序
  const sorted = [...routes].sort((a, b) => {
    const aOrder = a.meta?.order ?? Number.MAX_SAFE_INTEGER

    const bOrder = b.meta?.order ?? Number.MAX_SAFE_INTEGER

    return aOrder - bOrder
  })

  // 2. 递归排序子路由
  return sorted.map((route) => {
    if (!route.children) {
      return route
    }

    return {
      ...route,
      children: recursiveSortRoutesByOrder(route.children),
    }
  })
}

/**
 * 递归处理 iframe 路由
 * @param routes 路由数组
 * @returns 处理后的新路由数组
 * @example
 * // 处理 iframe 路由
 * const routes = [
 *   { path: '/normal', component: 'NormalComponent' },
 *   { path: '/iframe', meta: { iframeUrl: 'https://example.com' } }
 * ]
 * const processedRoutes = recursiveHandleIframeRoutes(routes)
 * // 结果:
 * // [
 * //   { path: '/normal', component: 'NormalComponent' },
 * //   { path: '/iframe', meta: { iframeUrl: 'https://example.com' }, component: ADMIN_IFRAME_LAYOUT }
 * // ]
 */
export function recursiveHandleIframeRoutes(routes: any[]): any[] {
  return recursiveWalkRoutes(routes, (route) => {
    if (route.meta?.iframeUrl) {
      route.component = IFRAME_LAYOUT
    }
  })
}

/**
 * 递归查找匹配指定属性值的路由
 * @param routes 路由数组
 * @param property 要匹配的属性名（支持嵌套属性，如 'meta.isHideInMenu'）
 * @param value 要匹配的属性值，如果为 undefined 则查找属性存在且有值的路由
 * @param options 配置选项
 * @param options.sortBy 排序属性名（支持嵌套属性）
 * @param options.sortOrder 排序方向，'asc' 为升序，'desc' 为降序
 * @returns 匹配的路由数组
 * @example
 * // 查找所有 meta.isHideInMenu 为 true 的路由
 * const hiddenRoutes = recursiveFindRoutesByProperty(routes, 'meta.isHideInMenu', true)
 *
 * // 查找所有 path 为 '/about' 的路由
 * const aboutRoutes = recursiveFindRoutesByProperty(routes, 'path', '/about')
 *
 * // 查找所有 meta.title 为 '首页' 的路由
 * const homeRoutes = recursiveFindRoutesByProperty(routes, 'meta.title', '首页')
 *
 * // 查找所有 meta.order 为 1 的路由
 * const orderRoutes = recursiveFindRoutesByProperty(routes, 'meta.order', 1)
 *
 * // 查找所有有 meta.order 的路由并按 order 升序排序
 * const hasOrderRoutes = recursiveFindRoutesByProperty(routes, 'meta.order', undefined, {
 *   sortBy: 'meta.order',
 *   sortOrder: 'asc'
 * })
 */
export function recursiveFindRoutesByProperty(
  routes: any[],
  property: string,
  value: any,
  options?: {
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  },
): any[] {
  const result: any[] = []

  // 获取嵌套属性的值
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  // 比较值是否相等
  const isEqual = (a: any, b: any) => {
    // 如果 b 是 undefined，则检查 a 是否存在且有值
    if (b === undefined) {
      return a !== undefined && a !== null && a !== ''
    }

    // 处理数字类型
    if (typeof a === 'number' && typeof b === 'number') {
      return a === b
    }

    // 处理字符串类型
    if (typeof a === 'string' && typeof b === 'string') {
      return a === b
    }

    // 处理布尔类型
    if (typeof a === 'boolean' && typeof b === 'boolean') {
      return a === b
    }

    // 其他类型使用严格相等
    return a === b
  }

  const findRoutes = (routeList: any[]) => {
    for (const route of routeList) {
      const currentValue = getNestedValue(route, property)

      // 检查当前路由是否匹配
      if (isEqual(currentValue, value)) {
        result.push(route)
      }

      // 递归检查子路由
      if (route.children?.length) {
        findRoutes(route.children)
      }
    }
  }

  findRoutes(routes)

  // 如果需要排序
  if (options?.sortBy) {
    const sortProperty = options.sortBy

    const sortOrder = options.sortOrder || 'asc'

    result.sort((a, b) => {
      const aValue = getNestedValue(a, sortProperty)

      const bValue = getNestedValue(b, sortProperty)

      // 处理数字类型
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
      }

      // 处理字符串类型
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      // 其他类型使用默认排序
      return 0
    })
  }

  return result
}

// /////////////////////////////////////////////////////////
/**
 * 递归查找包含目标路径的第一级父路由项
 * @param {string} path - 要查找的完整路径
 * @param {RouterType.AdminRoute[]} routes - 路由列表
 * @returns {RouterType.AdminRoute | undefined} 匹配到的第一级路由项
 */
export function findTopRouteByPath(
  path: string,
  routes: RouterType.Route[],
): RouterType.Route | undefined {
  // 使用 Map 缓存已查找的路由，避免重复查找
  const routeCache = new Map<string, RouterType.Route>()

  for (const route of routes) {
    // 检查缓存
    if (routeCache.has(route.path)) {
      return routeCache.get(route.path)
    }

    // 如果是顶级路径，直接匹配
    if (route.path === path) {
      routeCache.set(route.path, route)
      return route
    }

    // 如果有子路由，递归查找
    if (route.children?.length) {
      // 先查找直接子路由
      const found = route.children.find(child => child.path === path)

      if (found) {
        routeCache.set(route.path, route)
        return route
      }

      // 进一步递归查找更深层级
      const deepMatch = findTopRouteByPath(path, route.children)

      if (deepMatch) {
        routeCache.set(route.path, route)
        return route
      }
    }
  }

  return undefined
}

/**
 * 菜单跳转
 * @param {RouterType.AdminRoute} item - 菜单项
 * @param {boolean} jumpToFirst - 是否跳转到第一个子菜单
 * @returns {Promise<void>}
 */
export async function menuJump(
  item: RouterType.Route,
  jumpToFirst: boolean = false,
): Promise<void> {
  if (!item?.path) {
    return
  }

  try {
    // 处理外部链接
    if (item.meta?.externalUrl) {
      const url = new URL(item.meta.externalUrl)

      window.open(url.toString(), '_blank', 'noopener,noreferrer')
      return
    }

    // 如果不需要跳转到第一个子菜单，或者没有子菜单，直接跳转当前路径
    if (!jumpToFirst || !item.children?.length) {
      await router.push(item.path)
      return
    }

    // 获取第一个可见的子菜单，如果没有则取第一个子菜单
    const firstChild = item.children.find(child => !child.meta?.isHideInMenu) || item.children[0]

    if (!firstChild?.path) {
      return
    }

    // 如果第一个子菜单是外部链接，打开外部链接
    if (firstChild.meta?.externalUrl) {
      const url = new URL(firstChild.meta.externalUrl)

      window.open(url.toString(), '_blank', 'noopener,noreferrer')
      return
    }

    // 跳转到子菜单路径
    await router.push(firstChild.path)
  }
  catch {
    window.$notification.error('Menu jump failed:')
  }
}
