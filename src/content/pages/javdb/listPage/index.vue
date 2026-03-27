<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { useFolderStore } from '@/stores'

const folderStore = useFolderStore()

/**
 *  已入库的视频
 */
const addedToInventoryBtnList = ref<FolderConfigType.File[]>([])

/**
 *  在Emby打开按钮
 */
const embyBtnList = ref<string[]>([])

/**
 *  更新中文磁链按钮
 */
const updateChineseBtnList = ref<string[]>([])

// 顶部定义，只编译一次
const WHITESPACE_REGEX = /\s+/g

function main() {
  console.log('🚀 ~ file: index.vue:28 ~ folderStore.embyFolder:', folderStore.embyFolder)

  console.log('🚀 ~ file: index.vue:27 ~ folderStore.embyFolder.folderFileList.length:', folderStore.embyFolder.folderFileList.length)
  console.log('🚀 ~ file: index.vue:27 ~ folderStore.embyFolder.folderFileList:', folderStore.embyFolder.folderFileList)

  if (!folderStore.embyFolder.folderFileList.length) {
    return
  }

  const itemList = document.querySelectorAll('.movie-list .item')

  console.log('🚀 ~ file: index.vue:31 ~ itemList:', itemList)

  itemList.forEach((item) => {
    /**
     *  获取视频名称 (小写，去除空格)
     */
    const itemVideoName = item
      .querySelector('strong')
      ?.textContent
      ?.toLowerCase()
      .replace(WHITESPACE_REGEX, '') as string

    if (!itemVideoName) {
      return
    }

    const boxElement = item.querySelector('.box')

    /**
     * 当前视频名称已入库的视频列表
     */
    const matchedVideoList = folderStore.embyFolder.folderFileList.filter(sub => sub.cleanName.includes(itemVideoName))

    if (matchedVideoList.length) {
      //  添加高亮
      boxElement?.classList.add('is-highlight')

      // 添加 Emby 按钮的类名并更新列表
      addClassIfNotExists(boxElement, `emby_btn_${itemVideoName}`, embyBtnList, itemVideoName)

      /**
       *  页面列表当前视频是否含中文磁链
       */
      const isItemHaveChineseTorrent = !!item.querySelector('.is-warning')

      matchedVideoList.forEach((video: FolderConfigType.File) => {
        // 添加已入库视频按钮的类名并更新列表
        addClassAndUpdateList(boxElement, `added_to_emby_btn_${video.nameWithTags}`, addedToInventoryBtnList, video)

        if (!video.hasChineseSubtitles && isItemHaveChineseTorrent) {
          // 添加更新中文磁链按钮的类名并更新列表
          addClassIfNotExists(boxElement, `update_chinese_btn_${itemVideoName}`, updateChineseBtnList, itemVideoName)
        }
      })
    }
  })
}

onMounted(() => {
  window.$notification.success('列表页')

  // main()

  setTimeout(() => {
    main()
  }, 1000)
})
</script>

<template>

  <!-- 在Emby打开按钮 -->
  <template
    v-for="videoName in embyBtnList"
    :key="videoName"
  >

    <Teleport
      :to="`.emby_btn_${videoName}`"
    >
      <EmbyPlayButton
        :emby-search-name="videoName"
        :video-name="videoName"
      />
    </Teleport>
  </template>

  <!-- 可更新中文磁链按钮 -->
  <template
    v-for="videoName in updateChineseBtnList"
    :key="videoName"
  >
    <Teleport
      :to="`.update_chinese_btn_${videoName}`"
    >
      <PendingUpdateChineseButton
        :radius="0"
      />
    </Teleport>
  </template>

  <!-- 已入库的视频 -->
  <template
    v-for="item in addedToInventoryBtnList"
    :key="item.originalName"
  >
    <Teleport
      :to="`.added_to_emby_btn_${item.nameWithTags}`"
    >
      <EmbyCatalogedList
        :video="item"
      />
    </Teleport>
  </template>
</template>

<style lang="less" scoped></style>
