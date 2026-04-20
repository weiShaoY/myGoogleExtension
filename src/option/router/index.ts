import type { App } from 'vue'

import type { RouteRecordRaw } from 'vue-router'

/**
 * 路由入口
 * @description 创建并导出 vue-router 实例
 */
import { createRouter, createWebHashHistory } from 'vue-router'

import { createRouterGuard } from './guard'

import { routes } from './routes'

console.log('🚀 ~ file: index.ts:12 ~ routes:', routes)

export const router = createRouter({
  history: createWebHashHistory(),

  routes: [

    {

      name: 'Root',

      path: '/',

      redirect: '/emby',

    },

    ...routes as RouteRecordRaw[], // ✅ 正确：数组展开

  ],
})

/**
 * 设置 Vue Router
 * @param app Vue 应用实例
 */
export async function setupRouter(app: App) {
  try {
    // 创建并应用路由守卫
    createRouterGuard(router)

    // 在 Vue 应用中使用路由
    app.use(router)
  }
  catch (error) {
    window.$notification.error('路由器设置失败')
    throw error
  }
}
