import path from 'node:path'

import { fileURLToPath, URL } from 'node:url' // 更现代的路径处理方式

import { crx } from '@crxjs/vite-plugin'

import vue from '@vitejs/plugin-vue'

import unoCSS from 'unocss/vite'

import autoImport from 'unplugin-auto-import/vite'

import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

import components from 'unplugin-vue-components/vite'

import { defineConfig } from 'vite'

import zip from 'vite-plugin-zip-pack'

// 导入配置文件（解构赋值更清晰）
import manifest from './manifest.config.ts'

import pkg from './package.json' assert { type: 'json' }

// ESM 规范的 package.json 导入

const { name, version } = pkg

// 路径别名工具函数（复用性更高）
function pathAlias(aliasName: string, targetPath: string) {
  return {
    [aliasName]: fileURLToPath(new URL(targetPath, import.meta.url)),
  }
}

// Vite 核心配置
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'

  return {
    // 基础路径配置（适配生产环境部署）
    base: isProduction ? './' : '/',

    // 路径解析（优化：使用 import.meta.url 替代 __dirname，适配 ESM）
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

    // 插件配置（按功能分组，注释更清晰）
    plugins: [
      // 核心框架插件
      vue(),

      // UnoCSS 样式插件
      unoCSS(),

      // 自动导入（优化：配置拆分，逻辑更清晰）
      autoImport({
        // 预设导入
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

        // 自定义目录导入
        dirs: [
          'src/composables',
          'src/stores',
          'src/utils',
          'src/directives',
        ],
        // UI 组件解析器
        resolvers: [
          ElementPlusResolver({
            importStyle: false,
          }),
        ],

        // 类型声明（指定输出路径，规范类型文件位置）
        dts: 'src/types/core/auto-imports.d.ts',

        // 模板中自动导入
        vueTemplate: true,

        // ESLint 兼容
        eslintrc: {
          enabled: true,
          filepath: './.eslintrc-auto-import.json', // 显式指定生成路径
        },
      }),

      // 组件自动注册
      components({
        // Element Plus 样式导入（统一使用 Sass）
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass',
          }),
        ],
        // 补充：指定组件扫描目录，提升性能
        dirs: ['src/components', 'src/layouts'],

        // 生成类型声明文件
        dts: 'src/types/core/components.d.ts',
      }),

      // Chrome 扩展打包
      crx({
        manifest,

        // 补充：生产环境压缩
        minify: isProduction,
      }),

      // 打包后压缩为 ZIP（仅生产环境启用，提升开发速度）
      isProduction && zip({
        outDir: 'release',
        outFileName: `crx-${name}-${version}.zip`,

        // 补充：排除无用文件，减小 ZIP 体积
        exclude: ['node_modules/**/*', 'src/**/*', '.git/**/*'],
      }),
    ].filter(Boolean), // 过滤掉 null/false 插件（比如开发环境的 zip 插件）

    // 开发服务器配置
    server: {
      cors: {
        origin: [/chrome-extension:\/\//],
      },

      // 补充：自动打开浏览器（可选）
      open: false,

      // 补充：端口冲突自动切换
      strictPort: true,
      port: 3000,
    },

    // 构建优化（补充生产环境构建配置）
    build: {
      // 生产环境启用代码压缩
      minify: isProduction ? 'esbuild' : false,

      // 生成源映射（生产环境可选关闭，减小体积）
      sourcemap: !isProduction,

      // 输出目录
      outDir: 'dist',

      // 静态资源打包策略
      assetsDir: 'assets',

      // 拆分包（优化加载速度）
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]',
        },
      },
    },
  }
})
