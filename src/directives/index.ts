import type { App, Directive } from 'vue'

import { copy } from './modules/copy'

import debounce from './modules/debounce'

import { throttle } from './modules/throttle'

import { waterMarker } from './modules/waterMarker'

/**
 * 指令映射表
 */
const directivesMap: { [key: string]: Directive } = {
  copy,
  debounce,
  throttle,
  waterMarker,
}

export function setDirectives(app: App<Element>) {
  Object.keys(directivesMap).forEach((name) => {
    app.directive(name, directivesMap[name])
  })
}
