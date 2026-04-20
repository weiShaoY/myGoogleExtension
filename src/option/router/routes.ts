/**
 * 路由配置
 * @description 定义所有路由配置
 */
export type RouteConfig = {
  path: string
  name: string
  component?: () => Promise<any>
  meta: {
    title: string
    icon?: string
    requiresAuth?: boolean
    keepAlive?: boolean
  }
}

export const routes: RouterType.Route[] = [
  {
    path: '/emby',
    name: 'Emby',
    meta: {
      title: 'Emby',
      icon: 'option-menu-emby',
    },
    children: [
      {
        path: '/emby-folderScanner',
        name: 'EmbyFolderScanner',
        component: () => import('@/option/pages/home/index.vue'),
        meta: {
          title: '首页1',
          icon: 'option-menu-emby',
        },
      },
    ],
  },
  {
    path: '/general',
    name: 'GeneralSettings',
    component: () => import('@/option/pages/general/index.vue'),
    meta: {
      title: '通用设置',
      icon: 'option-menu-emby',
    },
  },

  {
    path: '/folder-scanner',
    name: 'FolderScanner',
    component: () => import('@/option/pages/folderScanner/index.vue'),
    meta: {
      title: '文件夹扫描',
      icon: 'option-menu-emby',
    },
  },
  {
    path: '/search',
    name: 'SearchSettings',
    component: () => import('@/option/pages/search/index.vue'),
    meta: {
      title: '搜索设置',
      icon: 'option-menu-emby',
    },
  },
  {
    path: '/online-play',
    name: 'OnlinePlaySettings',
    component: () => import('@/option/pages/onlinePlay/index.vue'),
    meta: {
      title: '在线播放',
      icon: 'option-menu-emby',
    },
  },
  {
    path: '/advanced',
    name: 'AdvancedSettings',
    component: () => import('@/option/pages/advanced/index.vue'),
    meta: {
      title: '高级设置',
      icon: 'option-menu-emby',
    },
  },
]
