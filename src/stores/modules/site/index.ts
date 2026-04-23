// src/stores/index.ts
// 2026-04-23---19:39---星期四

import { defineStore } from 'pinia'

import { ref } from 'vue'

/**
 *  网站模块
 */
export const useSiteStore = defineStore('site', () => {
  const site = ref({

    javDB: {
      /**
       *  是否开启瀑布流布局
       */
      isWaterfallLayout: false,
    },
  })

  return {
    site,
  }
})
