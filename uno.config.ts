import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup,

} from 'unocss'

/**
 *  @description UnoCSS 配置文件
 */
export default defineConfig({
  /**
   *  @description 定义全局主题设置，供规则或组件之间共享
   */
  theme: {
    /**
     *  @description 主题颜色
     */
    colors: {
      /**
       *  @description 主题色
       */
      primary: '#00ff00',

      /**
       *  @description 次要颜色
       */
      secondary: '#BFFFBF',

      /**
       *  @description 错误颜色
       */
      error: '#E43961',

      /**
       *  @description 信息颜色
       */
      info: '#D0D2D6',

      /**
       *  @description 成功颜色
       */
      success: '#00D89E',

      /**
       *  @description 警告颜色
       */
      warning: '#FF9800',

      /**
       *  @description 危险颜色
       */
      danger: '#FF4C4C',

    },

  },

  /**
   *  @description 预定义的样式快捷方式，可直接在模板中通过类名使用
   */
  shortcuts: {
    // 宽高 100%
    'wh-full': 'w-full h-full',

    // Flex 布局居中
    'flex-center': 'flex justify-center items-center',

    // Flex 列布局
    'flex-col': 'flex flex-col',

    // 文本溢出显示省略号
    'text-ellipsis': 'truncate',

    'card-wrapper': 'rd-8px shadow-sm',

    // //////////////////  主题  //////////////////
    'switch-animation': 'transition duration-300',

    'bg-base': 'bg-[#9B9996] dark:bg-[#212223] switch-animation',

    'card-base': 'bg-[#D9D5C9] dark:bg-[#0E0E0F] rounded-lg overflow-hidden switch-animation ',

    // ///////////////////
    'text-base': 'text-[#333333] dark:text-[#D0D2D6] switch-animation',

    'switch-label-base': 'bg-gray-200 dark:bg-gray-800 switch-animation',

    'switch-span-base': 'bg-white dark:bg-gray-300 switch-animation',
  },

  /**
   *  @description 自定义生成 CSS 工具的规则，后定义的规则优先级更高
   *  @example /^bc-(.+)$/ 将 `bc-颜色值` 转换为对应的 border-color 样式
   */
  rules: [
    //  将 `bc-颜色值` 转换为对应的 border-color 样式
    [
      /^bc-(.+)$/,
      ([, color]) => ({
        'border-color': `#${color}`,
      }),
    ],
  ],

  /**
   *  @description UnoCSS 使用的转换器，处理高级指令与变体组合
   */
  transformers: [
    /**
     *  @description 支持 `@apply` 等指令的转换器
     *  @see https://github.com/unocss/unocss#transformer-directives
     */
    transformerDirectives(),

    /**
     *  @description 允许通过逗号分隔的语法同时应用多个变体 例如 hover:(text-error bg-blue)
     *  @see https://github.com/unocss/unocss#transformer-variantgroup
     */
    transformerVariantGroup(),
  ],

  /**
   *  @description UnoCSS 使用的预设
   */
  presets: [
    /**
     *  @description UnoCSS 的核心预设
     *  @see https://github.com/unocss/unocss#preset-uno
     */
    presetWind3({
      // dark: 'class',
    }),

    /**
     *  @description 属性化预设，允许通过 HTML 属性直接应用样式
     *  @see https://github.com/unocss/unocss#preset-attributify
     */
    // presetAttributify(),

    /**
     *  @description 图标预设，支持通过类名插入 SVG 图标
     *  @see https://github.com/unocss/unocss#preset-icons
     */
    presetIcons({
      // /**
      //  *  @description 设置图标的缩放比例
      //  */
      // scale: 1.2,
      /**
       *   @description 开启警告提示
       */
      warn: true,
    }),

    /**
     *  @description 排版预设，提供优化的排版样式
     *  @see https://github.com/unocss/unocss#preset-typography
     */
    presetTypography(),

    /**
     *  @description Google Web Fonts 预设，自动生成 Web 字体相关的 CSS
     *  @see https://github.com/unocss/unocss#preset-webfonts
     */
    presetWebFonts({
      provider: 'none',

      /**
       *  @description 定义字体家族
       */
      fonts: {
        /**
         *  @description 中文字体
         *  @default '改良瘦金体'
         */
        theme: ['shouJinTi', 'firaCode'],

        shouJinTi: ['shouJinTi'],

        firaCode: ['firaCode'],

      },
    }),

  ],
})
