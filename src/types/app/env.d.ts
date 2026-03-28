/**
 * Vite 环境变量类型定义
 * @description 定义 import.meta.env 的类型
 */

// eslint-disable-next-line ts/consistent-type-definitions
interface ImportMeta {
  readonly env: Env.ImportMeta
}

/**
 * 命名空间 Env
 *
 * 用于声明 import.meta 对象的类型
 */
declare namespace Env {

  /** import.meta 接口 */
  type ImportMeta = {

    /**
     * 运行环境
     * @default development
     */
    readonly VITE_APP_ENV: 'development' | 'production'

    /**
     * 应用显示名称 (用于页面标题和浏览器标签)
     */
    readonly VITE_APP_TITLE: string

    /**
     * 应用描述信息 (用于 SEO 和社交媒体分享)
     */
    readonly VITE_APP_DESC: string

    /**
     * 应用全局字体家族 (需在 CSS 中定义对应字体)
     */
    readonly VITE_APP_FONT_FAMILY: string

    /**
     * 应用内图标名称的前缀 (用于统一管理Svg图标命名)
     * @default icon
     */
    readonly VITE_APP_ICON_PREFIX: string

  } & ImportMetaEnv
}
