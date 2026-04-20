import type { NProgressOptions } from 'nprogress'

import NProgress from 'nprogress'

/**
 * NProgress 配置选项
 */
const NPROGRESS_CONFIG: NProgressOptions = {
  /**
   * 动画方式
   */
  easing: 'ease',

  /**
   * 递增进度条的速度
   */
  speed: 500,

  /**
   * 是否显示进度环
   */
  showSpinner: false,

  /**
   * 自动递增间隔
   */
  trickleSpeed: 200,

  /**
   * 启动时使用的最小百分比
   */
  minimum: 0.3,

  /**
   * 进度条的父容器
   */
  parent: 'body',

  /**
   * 进度条的 HTML 模板
   */
  template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>',

  /**
   * 是否启用自动递增
   */
  trickle: true,

  /**
   * 定位方式
   */
  positionUsing: '',

  /**
   * 进度条选择器
   */
  barSelector: '[role="bar"]',

  /**
   * 加载动画选择器
   */
  spinnerSelector: '[role="spinner"]',
}

/**
 * 配置并初始化 NProgress 进度条插件
 * @description 设置进度条的样式和行为，并将其挂载到全局 window 对象
 * @throws {Error} 当初始化失败时抛出错误
 */
export function setupNProgress(): void {
  try {
    // 配置进度条
    NProgress.configure(NPROGRESS_CONFIG)

    // 将 NProgress 挂载到全局 window 对象
    window.NProgress = NProgress
  }
  catch (error) {
    window.$notification.error('NProgress 初始化失败:')
    throw error
  }
}
