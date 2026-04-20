import { BASE_LAYOUT } from '@/option/layouts'

export const routes: RouterType.Route[] = [
  {
    path: '/emby',
    name: 'Emby',
    component: BASE_LAYOUT,
    redirect: '/emby/home',
    meta: {
      title: 'Emby',
      icon: 'option-menu-emby',
    },
    children: [
      {
        path: 'folder-scanner',
        name: 'EmbyFolderScanner',
        component: () =>
          import('@/option/pages/emby/folderScanner/aaa.vue'),
        meta: {
          title: '文件夹扫描',
        },
      },
      {
        path: 'home',
        name: 'EmbyHome',
        component: () =>
          import('@/option/pages/emby/home/index.vue'),
        meta: {
          title: '首页',
        },
        children: [
          {
            path: 'detail',
            name: 'EmbyHomeDetail',
            component: () =>
              import('@/option/pages/emby/home/index.vue'),
            meta: {
              title: '详情',
            },
          },
        ],
      },
    ],
  },
]
