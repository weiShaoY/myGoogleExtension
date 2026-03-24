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
