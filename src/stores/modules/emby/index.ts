import { defineStore } from 'pinia'

import {
  getEmbyHomeUrl,
  getEmbyItemUrl,
  searchEmby,
} from '@/apis/modules/emby'

export const useEmbyStore = defineStore(
  'emby',
  () => {
    /**
     *  搜索 Emby 服务器上的视频
     *  @param  videoName - 视频名称
     */
    async function embySearch(videoName: string) {
      console.log('🚀 ~ file: index.ts:10 ~ videoName:', videoName)

      try {
        const result = await searchEmby(videoName)

        //  如果结果为空，则提示没有找到
        if (result.Items.length === 0) {
          window.$messageBox.confirm(`是否打开 Emby 首页?`, 'Emby中没有找到该视频!', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          })
            .then(() => {
              openLink(getEmbyHomeUrl())
            })
            .catch(() => {
              window.$notification.error('Emby中没有找到该视频!')
            })
        }

        //  如果只有一个结果，则直接打开
        else if (result.Items.length === 1) {
          const item = result.Items[0]

          const url = getEmbyItemUrl(item)

          openLink(url)
        }
        else {
          window.$notification.error('Emby中找到多个结果!')
          openLink(getEmbyHomeUrl())
        }
      }
      catch (error) {
        console.error('Emby 搜索失败:', error)
        window.$notification.error({
          title: '请求失败, 请检查 Emby 服务器',
          duration: 5000,
        })
      }
    }

    return {
      embySearch,
    }
  },
)
