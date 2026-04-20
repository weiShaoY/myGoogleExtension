import type { Router } from 'vue-router'

import { documentTitleGuard } from './documentTitleGuard'

import { progressGuard } from './progressGuard'

import { versionChecker } from './versionChecker'

/**
 *  创建路由守卫
 *  @param router 路由实例
 */
export function createRouterGuard(router: Router) {
  // 版本检查
  versionChecker()

  // 创建进度条守卫
  progressGuard(router)

  // 创建文档标题守卫
  documentTitleGuard(router)
}
