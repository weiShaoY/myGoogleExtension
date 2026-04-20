import type { Router } from 'vue-router'

import { useTitle } from '@vueuse/core'

/**
 * 获取文档标题
 * @param meta - 路由元信息
 * @returns 文档标题
 */
function getDocumentTitle(meta: Record<string, unknown>): string {
  if (meta.documentTitle) {
    return meta.documentTitle as string
  }

  if (meta.title) {
    return `${meta.title} - ${import.meta.env.VITE_APP_TITLE}`
  }

  return import.meta.env.VITE_APP_DESC
}

/**
 * 创建文档标题守卫
 * @param router - 路由实例
 */
export function documentTitleGuard(router: Router): void {
  router.afterEach((to) => {
    try {
      const title = getDocumentTitle(to.meta)

      useTitle(title)
    }
    catch {
      window.$notification.error('未能设置页面标题!')
      useTitle(import.meta.env.VITE_APP_DESC)
    }
  })
}
