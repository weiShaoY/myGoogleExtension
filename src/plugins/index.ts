import type { App as VueApp } from 'vue'

import { setElementPlus } from './elementPlus'

/**
 * 设置插件
 * @param app - Vue 应用实例
 */
export function setupPlugins(app: VueApp) {
  setElementPlus(app)
}
