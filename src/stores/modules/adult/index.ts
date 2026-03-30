import { defineStore } from 'pinia'

import { ref } from 'vue'

export const useAdultStore = defineStore(
  'adult',
  () => {
    const embyFolder = ref<AdultConfigType.Folder>({
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
    function saveEmbyFolderData(_folderName: string, videoFileSet: Set<AdultConfigType.VideoFile>, startTime: number) {
      embyFolder.value = {
        folderName: _folderName,
        folderScanTimestamp: Date.now(),
        folderScanDuration: getDuration(startTime, Date.now()),
        folderVideoFileList: Array.from(videoFileSet),
        folderDuplicateVideoFileList: getFolderDuplicateNameFileList(Array.from(videoFileSet), 'cleanName'),
        folderUniqueVideoNameList: getFolderUniqueFileNameFileList(Array.from(videoFileSet), 'cleanName'),
      }
    }

    /**
     * 获取 文件夹内文件名重复的文件列表。
     * @param  list - 要检查的列表
     * @param  property - 用于比较的属性名
     * @return 返回文件夹文件名重复的文件列表
     */
    function getFolderDuplicateNameFileList<T>(list: T[], property: keyof T): T[] {
      const propertyMap = list.reduce((acc, item) => {
        const key = item[property] as unknown as string

        acc[key] = acc[key] || []
        acc[key].push(item)
        return acc
      }, {
      } as { [key: string]: T[] })

      return Object.values(propertyMap)
        .filter(items => items.length > 1) // 过滤掉那些只有一个项的属性值
        .flat() // 展平数组，返回所有重复项
    }

    /**
     * 获取 文件夹内文件名已去重的文件列表 (每个文件名仅出现一次)。
     * @param  items - 要处理的数组
     * @param  property - 用于比较的属性名
     * @returns 返回文件夹内文件名已去重的文件列表 (每个文件名仅出现一次)。
     */
    function getFolderUniqueFileNameFileList<T>(items: T[], property: keyof T): string[] {
      const propertyMap = items.reduce((acc, item) => {
        const key = item[property] as unknown as string

        acc[key] = acc[key] || []
        acc[key].push(item)
        return acc
      }, {
      } as { [key: string]: T[] })

      return Object.keys(propertyMap).filter(key => propertyMap[key].length > 1)
    }

    /**
     * 根据清洗后的名称匹配视频
     */
    function matchVideos(cleanName: string) {
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
      matchVideos,
    }
  },

)
