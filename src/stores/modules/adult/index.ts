import { defineStore } from 'pinia'

import { ref } from 'vue'

export const useAdultStore = defineStore(
  'adult',
  () => {
    const embyFolder = ref<AdultType.Folder>({
      folderName: 'emby名称',
      folderScanTimestamp: 0,
      folderScanDuration: '',
      folderVideoFileList: [],
      folderDuplicateVideoFileList: [],
      folderUniqueVideoNameList: [],
    })

    /**
     *  保存文件夹文件列表
     *  @param _folderName - 文件夹名
     *  @param videoFileSet - 视频文件集合
     *  @description 保存 Emby 文件夹数据，并将其存储到 GM_setValue 和 Pinia store 中
     */
    function saveEmbyFolderData(_folderName: string, videoFileSet: Set<AdultType.VideoFile>, startTime: number) {
      embyFolder.value = {
        folderName: _folderName,
        folderScanTimestamp: Date.now(),
        folderScanDuration: getDuration(startTime, Date.now()),
        folderVideoFileList: Array.from(videoFileSet),
        folderDuplicateVideoFileList: getDuplicateItems(Array.from(videoFileSet), 'cleanName'),
        folderUniqueVideoNameList: getDuplicateItemKeys(Array.from(videoFileSet), 'cleanName'),
      }
    }

    /**
     * 根据标准化名称获取文件夹中的视频列表
     * @description 通过 cleanName 模糊匹配当前文件夹内的视频文件
     * @param cleanName 标准化纯净名称
     * @returns 匹配到的视频文件列表
     */
    function getFolderVideosByCleanName(cleanName: string) {
      const list = embyFolder.value.folderVideoFileList ?? []

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
       * 根据清洗后的名称匹配视频
       * @param cleanName - 清洗后的名称
       * @return 匹配到的视频列表
       */
      matchVideos: getFolderVideosByCleanName,
    }
  },

)
