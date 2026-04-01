import path, { resolve } from 'node:path'

import { crx } from '@crxjs/vite-plugin'

import vue from '@vitejs/plugin-vue'

import unoCSS from 'unocss/vite'

import autoImport from 'unplugin-auto-import/vite'

import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import components from 'unplugin-vue-components/vite'

import { defineConfig } from 'vite'

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons-ng'

import vueDevTools from 'vite-plugin-vue-devtools'

import zip from 'vite-plugin-zip-pack'

import manifest from './manifest.config.ts'

import { name, version } from './package.json'

export default defineConfig({
  resolve: {
    alias: {
      '@/': `${resolve(__dirname, 'src')}/`,
    },

    // 补充：省略文件扩展名，提升开发体验
    extensions: ['.vue', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },

  plugins: [
    vue(),

    vueDevTools(),

    // ===== 样式相关插件 =====
    unoCSS({
      mode: 'vue-scoped',
    }),

    // ===== 自动导入插件 =====
    autoImport({
      // 👇 配置需要自动导入的库
      imports: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core',
      ],

      // 👇 自动扫描指定目录下的文件导出
      dirs: [
        'src/composables',
        'src/stores',
        'src/utils',
        'src/directives',
        'src/configs',
      ],

      // 👇 解析器（此处配置 Element Plus 按需导入）
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],

      // 👇 生成自动导入的类型声明文件
      dts: 'src/types/core/auto-imports.d.ts',

      // 👇 启用 Vue 模板中的自动导入
      vueTemplate: true,

      // 👇 生成 ESLint 配置（解决未导入报错问题）
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
