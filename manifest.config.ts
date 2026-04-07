import { defineManifest } from '@crxjs/vite-plugin' // 导入CRXJS Vite插件定义清单方法

import pkg from './package.json' // 导入package.json配置文件

export default defineManifest({
  manifest_version: 3, // 插件清单版本，Chrome强制使用Manifest V3
  name: pkg.name, // 插件名称，读取package.json中的name字段
  version: pkg.version, // 插件版本号，读取package.json中的version字段
  icons: {
    48: 'public/logo.png', // 插件48x48尺寸图标，用于扩展管理页、商店展示
  },
  action: {
    default_icon: {
      48: 'public/logo.png', // 浏览器工具栏48x48尺寸默认图标
    },
    default_popup: 'src/popup/index.html', // 点击插件图标弹出的弹窗页面路径
  },

  permissions: [
    'sidePanel', // 侧边栏权限，启用Chrome官方侧边栏功能
    'contentSettings', // 内容设置权限，管理网页JS、图片、权限等配置
    'storage', // 本地存储权限，持久化保存插件配置数据
    'unlimitedStorage', // 无限制存储权限，突破本地存储大小限制
    'clipboardRead', // 剪贴板读取权限，读取用户剪贴板内容
    'clipboardWrite', // 剪贴板写入权限，向剪贴板写入内容
    'tabs', // 标签页权限，获取、管理浏览器标签页信息
    'declarativeNetRequest', // 网络请求权限，拦截/修改/重定向网络请求
    'scripting', // 脚本注入权限，动态向网页注入JS/CSS代码
  ],
  host_permissions: [
    'http://192.168.0.3:8096/*', // 允许插件访问该HTTP本地服务地址
    'https://192.168.0.3:8096/*', // 允许插件访问该HTTPS本地服务地址
  ],
  side_panel: {
    default_path: 'src/sidepanel/index.html', // Chrome侧边栏默认展示的页面路径
  },
  background: {
    service_worker: 'src/background/index.ts', // MV3后台常驻脚本（Service Worker）路径
  },
  content_scripts: [{
    js: ['src/content/main.ts'], // 注入网页的内容脚本主文件
    matches: ['https://*/*'], // 匹配所有HTTPS协议的网页并注入脚本
  }],
  options_ui: {
    page: 'src/option/index.html',
    open_in_tab: true,
  },

})
