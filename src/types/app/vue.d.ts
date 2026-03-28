/**
 * Vue 模块声明
 * @description Vue 单文件组件类型声明和全局属性扩展
 */

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}

/* eslint-disable */
import 'vue'
// 扩展指令类型
declare module 'vue' {
  interface ComponentCustomProperties extends DirectiveType.DirectivesMapType {}
}
