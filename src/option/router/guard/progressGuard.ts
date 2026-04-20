import type { Router } from 'vue-router'

/**
 * 开始进度条
 */
function startProgress(): void {
  try {
    window.NProgress?.start?.()
  }
  catch {
    window.$notification.error('未能启动进度条!')
  }
}

/**
 * 结束进度条
 */
function doneProgress(): void {
  try {
    window.NProgress?.done()
  }
  catch {
    window.$notification.error('未能结束进度条!')
  }
}

/**
 * 创建进度条守卫
 * @param router - 路由实例
 */
export function progressGuard(router: Router): void {
  /**
   *  @description 路由跳转前
   */
  router.beforeEach(async () => {
    startProgress()
  })

  /**
   *  @description 路由跳转结束
   */
  router.afterEach(() => {
    doneProgress()
  })

  /**
   *  @description 路由跳转错误
   */
  router.onError(() => {
    doneProgress()
  })
}
