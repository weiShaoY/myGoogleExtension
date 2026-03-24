import path from 'node:path'

import { crx } from '@crxjs/vite-plugin'

import vue from '@vitejs/plugin-vue'

import unoCSS from 'unocss/vite'

import autoImport from 'unplugin-auto-import/vite'

import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import components from 'unplugin-vue-components/vite'

import { defineConfig } from 'vite'

import zip from 'vite-plugin-zip-pack'

import manifest from './manifest.config.ts'

import { name, version } from './package.json'

export default defineConfig({
  resolve: {
    alias: {
      '@': `${path.resolve(__dirname, 'src')}`,
      '@assets': `${path.resolve(__dirname, 'src/assets')}`,
      '@svgs': `${path.resolve(__dirname, 'src/assets/svgs')}`,
      '@images': `${path.resolve(__dirname, 'src/assets/images')}`,
      '@hooks': `${path.resolve(__dirname, 'src/hooks')}`,
      '@stores': `${path.resolve(__dirname, 'src/stores')}`,
      '@utils': `${path.resolve(__dirname, 'src/utils')}`,
    },
  },
  plugins: [
    vue(),

    // ===== 样式相关插件 =====
    unoCSS(),

    // ===== 自动导入插件 =====
    autoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core',
        {
          from: 'vue-router',
          imports: ['RouteLocationRaw'],
          type: true,
        },
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
      resolvers: [
        // 使用 Sass 引入 Element Plus 样式
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],
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
