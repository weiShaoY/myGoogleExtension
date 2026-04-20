export const routes: RouterType.Route[] = [{
  path: '/workbench',
  name: 'Workbench',
  component: () =>
    import('@/option/pages/workbench/index.vue'),
  meta: {
    title: '工作台',
    icon: 'option-menu-workbench',
  },

}, {
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

  ],

}]
