export {}

declare global {

  /**
   * 全局 Window 对象类型扩展
   * @description 为 Window 对象添加全局插件和工具的类型定义
   */
  // eslint-disable-next-line ts/consistent-type-definitions
  export interface Window {

    /**
     * NProgress 进度条实例
     * @description 用于显示页面加载进度
     */
    NProgress: import('nprogress').NProgress

    /**
     * Element Plus 消息弹框实例
     * @description 用于显示确认框、提示框等
     */
    $messageBox: import('element-plus').IElMessageBox

    /**
     * Element Plus 消息提示实例
     * @description 用于显示轻量级的消息提示
     */
    $message: import('element-plus').Message

    /**
     * Element Plus 通知实例
     * @description 用于显示系统通知
     */
    $notification: import('element-plus').Notify

    /**
     *  是否为开发环境
     * @description 用于区分开发环境和生产环境
     */
    $isDevelopment: boolean
  }
}
