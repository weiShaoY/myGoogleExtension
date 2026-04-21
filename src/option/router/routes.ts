export const routes: RouterType.Route[] = [
  {
    path: '/workbench',
    name: 'Workbench',
    component: () => import('@/option/pages/workbench/index.vue'),
    meta: {
      title: '工作台',
      icon: 'option-menu-workbench',
    },
  },
  {
    path: '/emby',
    name: 'Emby',
    redirect: '/emby/folder-scanner',
    meta: {
      title: 'Emby',
      icon: 'option-menu-emby',
    },
    children: [
      {
        path: 'folder-scanner',
        name: 'EmbyScanner',
        component: () => import('@/option/pages/emby/scanner/index.vue'),
        meta: {
          title: '文件夹扫描',
          icon: 'option-menu-scanner',
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
        path: 'folder',
        name: 'EmbyFolder',
        component: () => import('@/option/pages/emby/folder/index.vue'),
        meta: {
          title: '文件夹',
          icon: 'option-menu-folder',
        },
      },
    ],
  },
  {
    path: '/data',
    name: 'Data',
    redirect: '/data/json',
    meta: {
      title: '数据',
      icon: 'option-menu-data',
    },
    children: [
      {
        path: 'folder',
        name: 'DataFolder',
        component: () => import('@/option/pages/data/folder/index.vue'),
        meta: {
          title: '文件夹',
          icon: 'option-menu-folder',
        },
      },
      {
        path: 'json',
        name: 'DataJson',
        component: () => import('@/option/pages/data/json/index.vue'),
        meta: {
          title: 'JSON',
          icon: 'option-menu-json',
        },
      },
      {
        path: 'indexedDB',
        name: 'DataIndexedDB',
        component: () => import('@/option/pages/data/indexedDB/index.vue'),
        meta: {
          title: 'IndexedDB',
          icon: 'option-menu-indexedDB',
        },
      },
    ],
  },
  {
    path: '/test',
    name: 'Test',
    meta: {
      title: '测试',
      icon: 'option-menu-test',
    },
    children: [
      {
        path: 'tampermonkey',
        name: 'TestTampermonkey',
        component: () => import('@/option/pages/test/tampermonkey/index.vue'),
        meta: {
          title: '油猴脚本',
          icon: 'option-menu-tampermonkey',
        },
      },

    ],
  },
]
