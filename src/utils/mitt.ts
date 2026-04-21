/**
 * 全局事件总线，用于全局事件的发布与订阅
 * 用法：
 * pageLoadingMittBus.on('event', callback)
 */
import mitt from 'mitt'

export const pageLoadingMittBus = mitt()
