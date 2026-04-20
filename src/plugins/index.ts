import type { App as VueApp } from 'vue'

import { setElementPlus } from './elementPlus'

import { setupNProgress } from './nprogress'

import { setVersionTip } from './version'

import { setWelcome } from './welcome'

/**
 * 设置插件
 * @param app - Vue 应用实例
 */
export function setupPlugins(app: VueApp) {
  setElementPlus(app)
  setupNProgress()

  setWelcome()
  setVersionTip()
}
