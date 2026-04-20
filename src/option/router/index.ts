/**
 * 路由入口
 * @description 创建并导出 vue-router 实例
 */
import { createRouter, createWebHashHistory } from 'vue-router'

import { routes } from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
