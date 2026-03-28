<!------------------------------------  JavDB 列表页面优化  ------------------------------------------------->
<script setup lang="ts">
import AdultInventory from '@/components/Adult/adult-inventory.vue'

/**
 * 文件夹存储
 */
const folderStore = useFolderStore()

/**
 * 是否显示组件
 */
const isComponentVisible = ref<boolean>(false)

/**
 * 已匹配的视频列表
 */
const matchedVideoList = ref<MatchedVideoItem[]>([])

/**
 * 匹配的视频项接口
 */
type MatchedVideoItem = {

  /** 清理后的文件名（用于标识） */
  cleanFileName: string

  /** 匹配到的本地视频文件列表 */
  matchedFileList: FolderConfigType.File[]

  /** 是否显示更新中文字幕按钮 */
  isShowUpdateChinese: boolean

  /** 是否显示 Emby 按钮 */
  isShowEmby: boolean
}

/**
 * 处理页面主要逻辑
 * 遍历电影列表，匹配本地视频文件
 */
function processVideoList() {
  const movieItems = $$('.movie-list .item')

  movieItems.forEach((movieItem) => {
    const videoName = movieItem.querySelector('strong')?.textContent

    const cleanedVideoName = cleanVideoName(videoName)

    if (!cleanedVideoName) {
      return
    }

    const boxElement = asHTMLElement(movieItem.querySelector('.box'))

    const matchedFiles = folderStore.matchVideos(cleanedVideoName)

    if (matchedFiles.length === 0) {
      return
    }

    // 添加样式类
    boxElement?.classList.add(cleanedVideoName)
    boxElement?.classList.add('is-highlight')

    // 创建匹配项
    const matchedItem: MatchedVideoItem = {
      cleanFileName: cleanedVideoName,
      matchedFileList: matchedFiles,
      isShowUpdateChinese: false,
      isShowEmby: true,
    }

    // 检查是否需要更新中文字幕
    const hasChineseTag = !!movieItem.querySelector('.is-warning')

    const needsChineseUpdate = matchedFiles.some(
      file => !file.hasChineseSubtitles && hasChineseTag,
    )

    matchedItem.isShowUpdateChinese = needsChineseUpdate

    matchedVideoList.value.push(matchedItem)
  })

  isComponentVisible.value = true

  console.log('🚀 ~ 组件可见性:', isComponentVisible.value)
  console.log('🚀 ~ 匹配视频列表:', matchedVideoList.value)
}

onMounted(() => delayRun(processVideoList))
</script>

<template>
  <template
    v-for="videoItem in matchedVideoList"
    :key="videoItem.cleanFileName"
  >
    <Teleport
      :to="`.${videoItem.cleanFileName}`"
    >
      <!-- 关键：套一层真实 div，把 stop 写在这里 -->
      <div
        class="teleport-wrapper"
        @click.native.prevent
        @click.stop
      >
        <div
          class="grid grid-cols-2 grid-rows-2 w-full gap-2 text-white font-bold"
        >
          <AdultInventory
            v-for="file in videoItem.matchedFileList"
            :key="file.id"
          />

          <AdultChinese
            v-if="videoItem.isShowUpdateChinese"
            @click.stop
          />

          <AdultEmby />
        </div>
      </div>
    </Teleport>
  </template>
</template>

<style lang="scss" scoped></style>
