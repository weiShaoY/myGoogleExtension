import type { App } from 'vue'

import ElementPlus from 'element-plus'

import 'element-plus/dist/index.css'

import 'element-plus/theme-chalk/dark/css-vars.css'

/**
 * 配置 Element Plus 组件库
 * @param app - Vue 应用实例
 * @throws {Error} 当初始化失败时抛出错误
 * @description 设置组件默认配置并安装 Element Plus
 */
export function setElementPlus(app: App<Element>): void {
  try {
    // 安装 Element Plus
    app.use(ElementPlus)
  }
  catch (error) {
    window.$notification.error('Element Plus 初始化失败')
    throw error
  }
}
