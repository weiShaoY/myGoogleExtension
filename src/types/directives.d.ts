/* 全局指令类型命名空间 */
namespace DirectiveType {

  /**
   * 基础指令类型
   */
  type BaseDirectiveType = import('vue').Directive<HTMLElement>

  /**
   * v-copy 指令参数类型
   */
  type CopyParamsType = {

    /** 要复制的文本 */
    text: string

    /** 复制成功后的提示消息 */
    message?: string
  }

  /**
   * v-debounce 指令的参数类型
   * @description 防抖指令的参数类型
   */
  type DebounceParamsType = {

    /** 防抖时间（毫秒） */
    delay?: number

    /** 回调函数 */
    handler: (...args: any[]) => void
  }

  /**
   * v-throttle 指令的参数类型
   * @description 节流指令的参数类型
   */
  type ThrottleParamsType = {

    /** 节流时间（毫秒） */
    delay?: number

    /** 回调函数 */
    handler: (...args: any[]) => void
  }

  /**
   * v-waterMarker 指令的参数类型
   * @description 水印指令的参数类型
   */
  type WaterMarkerParamsType = {

    /** 水印文字 */
    text: string

    /** 文字颜色 */
    textColor?: string

    /** 字体样式 */
    font?: string
  }

  /**
   * 指令映射类型
   * @description 必须使用 v- 前缀
   */
  type DirectivesMapType = {
    vAnimatedText: BaseDirectiveType
    vCopy: import('vue').Directive<HTMLElement, CopyParamsType>
    vDebounce: import('vue').Directive<HTMLElement, DebounceParamsType>
    vThrottle: import('vue').Directive<HTMLElement, ThrottleParamsType>
    vWaterMarker: import('vue').Directive<HTMLElement, WaterMarkerParamsType>
  }
}
