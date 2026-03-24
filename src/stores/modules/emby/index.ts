import { defineStore } from 'pinia'

import { embyConfig } from '@/config'

import { openLink } from '@/utils'

const useEmbyStore = defineStore(
  'emby',
  () => {
    /**
     * 构建 Emby 请求 URL
     * @param  videoName - 视频名称
     * @returns   完整的请求 URL
     */
    function buildRequestUrl(videoName: string) {
      const queryParams = {
        'SearchTerm': videoName,
        'Recursive': true,
        'Fields': 'PrimaryImageAspectRatio,PremiereDate,ProductionYear',
        'EnableUserData': false,
        'GroupProgramsBySeries': true,
        'Limit': 30,

        // 添加 Emby 特定的查询参数
        'X-Emby-Client': 'Emby Web',
        'X-Emby-Device-Name': embyConfig.request.deviceName,
        'X-Emby-Device-Id': embyConfig.request.deviceId,
        'X-Emby-Client-Version': embyConfig.request.clientVersion,
        'X-Emby-Token': embyConfig.request.token,
        'X-Emby-Language': embyConfig.request.language,
      }

      const queryString = Object.entries(queryParams)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`,
        )
        .join('&')

      return `${embyConfig.request.url}:${embyConfig.request.port}/emby/Users/${embyConfig.request.userId}/Items?${queryString}`
    }

    /**
     *  搜索 Emby 服务器上的视频。
     *  @param  videoName - 视频名称
     */
    function embySearch(videoName: string) {
    /**
     *  设置超时时间为 2 秒
     */
      const timeoutDuration = 10000

      const timeoutId = setTimeout(() => {
        window.$notification.error({
          title: '请求超时, 请检查 Emby 服务器',
          duration: 5000,
        })
      }, timeoutDuration)

      // GM_xmlhttpRequest({
      //   method: 'GET',
      //   url: buildRequestUrl(videoName),
      //   headers: {
      //     'Accept': 'application/json',
      //     'Accept-Language': 'zh,zh-CN;q=0.9,ja;q=0.8',
      //     'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
      //   },
      //   onload: (response: any) => {
      //     // 请求成功，清除超时计时器
      //     clearTimeout(timeoutId)

      //     if (response.status >= 200 && response.status < 300) {
      //       GM_setValue('EMBY-BTN-VALUE', '')

      //       try {
      //       // 将 JSON 字符串转换为 JSON 对象
      //         const result = JSON.parse(response.responseText)

      //         //  如果结果为空，则提示没有找到
      //         if (result.Items.length === 0) {
      //           window.$messageBox.confirm(`是否打开 Emby 首页?`, 'Emby中没有找到该视频!', {
      //             confirmButtonText: '确认',
      //             cancelButtonText: '取消',
      //             type: 'warning',
      //           })
      //             .then(() => {
      //               openLink(`${embyConfig.request.url}:${embyConfig.request.port}/web/index.html#!/home`)
      //             })
      //             .catch(() => {
      //               window.$notification.error('Emby中没有找到该视频!')
      //             })
      //         }

      //         //  如果只有一个结果，则直接打开
      //         else if (result.Items.length === 1) {
      //           const id = result.Items[0].Id

      //           const serverId = result.Items[0].ServerId

      //           const url = `${embyConfig.request.url}:${embyConfig.request.port}/web/index.html#!/item?id=${id}&serverId=${serverId}`

      //           openLink(url)
      //         }
      //         else {
      //           window.$notification.error('Emby中找到多个结果!')

      //           GM_setValue('EMBY-SEARCH-VALUE', videoName)

      //           openLink(`${embyConfig.request.url}:${embyConfig.request.port}/web/index.html#!/home`)
      //         }
      //       }
      //       catch (e) {
      //         console.error('请求失败:', e)
      //         GM_setValue('EMBY-BTN-VALUE', '')
      //       }
      //     }
      //     else {
      //       console.error(`HTTP 错误: ${response.status}`)
      //     }
      //   },
      //   onerror: () => {
      //     window.$notification.error({
      //       title: '请求失败, 请检查 Emby 服务器',
      //       duration: 5000,
      //     })
      //   },
      // })
    }

    return {
      embySearch,
    }
  },

)

export default useEmbyStore
