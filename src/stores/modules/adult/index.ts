import { defineStore } from 'pinia'

import { ref } from 'vue'

export const useAdultStore = defineStore(
  'adult',
  () => {
    const embyFolder = ref<AdultType.Folder>({
      folderName: 'emby名称',
      folderScanTimestamp: 0,
      folderScanDuration: '',
      folderVideoFiles: [],
      folderAllDuplicateVideoFiles: [],
      folderUniqueDuplicateVideoNames: [],
    })

    /**
     *  保存文件夹文件列表
     *  @param _folderName - 文件夹名
     *  @param folderVideoFiles - 视频文件集列表
     *  @description 保存 Emby 文件夹数据，并将其存储到 GM_setValue 和 Pinia store 中
     */
    function saveEmbyFolderData(_folderName: string, folderVideoFiles: AdultType.VideoFile[], startTime: number) {
      embyFolder.value = {
        folderName: _folderName,
        folderVideoFiles,
        folderScanTimestamp: Date.now(),
        folderScanDuration: getDuration(startTime, Date.now()),
        folderAllDuplicateVideoFiles: getDuplicateItems(folderVideoFiles, 'cleanName'),
        folderUniqueDuplicateVideoNames: getDuplicateItemKeys(folderVideoFiles, 'cleanName'),
      }
    }

    /**
     * 根据标准化名称获取文件夹中的视频列表
     * @description 通过 cleanName 模糊匹配当前文件夹内的视频文件
     * @param cleanName 标准化纯净名称
     * @returns 匹配到的视频文件列表
     */
    function getFolderMatchedVideoList(cleanName: string) {
      const list = embyFolder.value.folderVideoFiles ?? []

      if (!list.length || !cleanName) {
        return []
      }

      return list.filter(item => item.cleanName.includes(cleanName))
    }

    return {

      /**
       * Emby 文件夹数据。
       */
      embyFolder,

      /**
       * 保存文件夹文件列表的函数。
       * @param folderName_ - 文件夹名
       * @param videoFileSet - 视频文件集合
       * @description 保存 Emby 文件夹数据，并将其存储到 GM_setValue 和 Pinia store 中
       */
      saveEmbyFolderData,

      /**
       * 根据标准化名称获取文件夹中的视频列表
       * @description 通过 cleanName 模糊匹配当前文件夹内的视频文件
       * @param cleanName 标准化纯净名称
       * @returns 匹配到的视频文件列表
       */
      getFolderMatchedVideoList,
    }
  },

)
