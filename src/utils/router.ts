import type { RouteRecordRaw } from 'vue-router'

import { RouterView } from 'vue-router'

/**
 * 转换自定义路由为 vue-router 路由
 */
export function transformRoutes(
  routes: RouterType.Route[],
): RouteRecordRaw[] {
  return routes.map((route) => {
    const record = {
      path: route.path,
      name: route.name,
      meta: route.meta,
    } as unknown as RouteRecordRaw

    // 👉 redirect
    if (route.redirect) {
      record.redirect = route.redirect
    }

    // 👉 component
    if (route.component) {
      record.component = route.component
    }

    // 👉 children
    if (route.children?.length) {
      record.component = route.component || RouterView
      record.children = transformRoutes(route.children)
    }

    return record
  })
}
