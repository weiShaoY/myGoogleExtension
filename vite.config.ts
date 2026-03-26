import path from 'node:path'

import { fileURLToPath, URL } from 'node:url' // 更现代的路径处理方式

import { crx } from '@crxjs/vite-plugin'

import vue from '@vitejs/plugin-vue'

import unoCSS from 'unocss/vite'

import autoImport from 'unplugin-auto-import/vite'

import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import components from 'unplugin-vue-components/vite'

import { defineConfig } from 'vite'

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons-ng'

import zip from 'vite-plugin-zip-pack'

import manifest from './manifest.config.ts'

import { name, version } from './package.json'

/**
 * 创建路径别名配置
 */
function pathAlias(aliasName: string, targetPath: string) {
  return {
    [aliasName]: fileURLToPath(new URL(targetPath, import.meta.url)),
  }
}

export default defineConfig({
  resolve: {
    alias: {
      ...pathAlias('@', './src'),
      ...pathAlias('@assets', './src/assets'),
      ...pathAlias('@svgs', './src/assets/svgs'),
      ...pathAlias('@images', './src/assets/images'),
      ...pathAlias('@hooks', './src/hooks'),
      ...pathAlias('@stores', './src/stores'),
      ...pathAlias('@utils', './src/utils'),
    },

    // 补充：省略文件扩展名，提升开发体验
    extensions: ['.vue', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },

  plugins: [
    vue(),

    // ===== 样式相关插件 =====
    unoCSS({
      mode: 'vue-scoped',
    }),

    // ===== 自动导入插件 =====
    autoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core',
      ],
      dirs: [
        'src/composables',
        'src/stores',
        'src/utils',
        'src/directives',
      ],
      resolvers: [
        ElementPlusResolver({
          importStyle: false,
        }),
      ],
      dts: 'src/types/core/auto-imports.d.ts',
      vueTemplate: true,
      eslintrc: {
        enabled: true,
      },
    }),

    // ===== 组件自动导入插件 =====
    components ({
      // 生成 TypeScript 组件声明文件
      dts: 'src/types/core/components.d.ts',
      resolvers: [
        // 使用 Sass 引入 Element Plus 样式
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],
    }),

    // SVG 图标插件配置
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹路径
      iconDirs: [path.resolve(process.cwd(), 'src/assets/svgs')],

      // SVG 图标的 symbol ID 命名规则
      symbolId: `icon-[dir]-[name]`,
    }),

    crx({
      manifest,
    }),

    zip({
      outDir: 'release',
      outFileName: `crx-${name}-${version}.zip`,
    }),
  ],

  server: {
    cors: {
      origin: [
        /chrome-extension:\/\//,
      ],
    },
  },
})
