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
          import('@/option/pages/emby/folder-scanner/index.vue'),
        meta: {
          title: '文件夹扫描',
          icon: 'option-menu-folderScanner',
        },
      },

      {
        path: 'duplicate',
        name: 'EmbyDuplicate',
        meta: {
          title: '查找重复',
          icon: 'option-menu-duplicate',
        },
        children: [
          {
            path: 'all',
            name: 'EmbyDuplicateAll',
            component: () =>
              import('@/option/pages/emby/duplicate/all/index.vue'),
            meta: {
              title: '所有重复',
              icon: 'option-menu-duplicateAll',
            },
          },
          {
            path: 'unique',
            name: 'EmbyDuplicateUnique',
            component: () =>
              import('@/option/pages/emby/duplicate/unique/index.vue'),
            meta: {
              title: '去重重复',
              icon: 'option-menu-duplicateUnique',
            },
          },
        ],
      },

      {
        path: 'home',
        name: 'EmbyHome',
        component: () =>
          import('@/option/pages/emby/home/index.vue'),
        meta: {
          title: '首页',
        },
      },

    ],
  },
]
