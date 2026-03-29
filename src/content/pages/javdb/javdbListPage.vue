<!------------------------------------  JavDB 列表页面优化  ------------------------------------------------->
<script setup lang="ts">
import AdultInventory from '@/components/Adult/adult-inventory.vue'

/**
 * 文件夹存储
 */
const folderStore = useFolderStore()

/**
 * 页面上匹配到的视频结果列表
 */
const pageMatchResultList = ref<VideoMatchItem[]>([])

/**
 * 单个视频匹配结果项接口
 */
type VideoMatchItem = {

  /** 清理后的文件名（用于标识） */
  cleanName: string

  /** 本地匹配到的视频文件数组 */
  localMatchedFileList: FolderConfigType.File[]

  /** 是否显示更新中文字幕按钮 */
  isShowUpdateChinese: boolean

  /** 是否显示 Emby 按钮 */
  isShowEmby: boolean
}

/**
 * 处理包装器的事件，阻止事件透传到原始页面
 * @param event 事件对象
 */
function handleWrapperClick(event: Event) {
  event.stopPropagation()
  event.stopImmediatePropagation()
  event.preventDefault()
  return false
}

/**
 * 处理页面主要逻辑
 * 遍历电影列表，匹配本地视频文件
 */
function processVideoList() {
  const movieItems = $$('.movie-list .item')

  movieItems.forEach((movieItem) => {
    const videoName = movieItem.querySelector('strong')?.textContent

    const cleanName = cleanVideoName(videoName)

    if (!cleanName) {
      return
    }

    const boxElement = asHTMLElement(movieItem.querySelector('.box'))

    const localMatchedFileList = folderStore.matchVideos(cleanName)

    if (localMatchedFileList.length === 0) {
      return
    }

    // 添加样式类
    boxElement?.classList.add(cleanName)
    boxElement?.classList.add('is-highlight')

    // 创建匹配结果项
    const matchResultItem: VideoMatchItem = {
      cleanName,
      localMatchedFileList,
      isShowUpdateChinese: false,
      isShowEmby: true,
    }

    // 检查是否需要更新中文字幕
    const hasChineseTag = !!movieItem.querySelector('.is-warning')

    const needsChineseUpdate = localMatchedFileList.some(
      file => !file.hasChineseSubtitles && hasChineseTag,
    )

    matchResultItem.isShowUpdateChinese = needsChineseUpdate

    pageMatchResultList.value.push(matchResultItem)
  })

  console.log('🚀 ~ 匹配视频结果列表:', pageMatchResultList.value)
}

onMounted(() => delayRun(processVideoList))
</script>

<template>
  <template
    v-for="matchResult in pageMatchResultList"
    :key="matchResult.cleanName"
  >
    <Teleport
      :to="`.${matchResult.cleanName}`"
    >
      <!-- 事件处理包装器 -->
      <div
        class="teleport-wrapper"
        style="pointer-events: auto;"
        @click="handleWrapperClick"
        @mousedown="handleWrapperClick"
        @mouseup="handleWrapperClick"
        @pointerdown="handleWrapperClick"
        @pointerup="handleWrapperClick"
      >
        <div
          class="grid grid-cols-2 grid-rows-2 w-full gap-2 text-white font-bold"
        >
          <AdultInventory
            v-for="file in matchResult.localMatchedFileList"
            :key="file.id"
            :file="file"
          />

          <AdultChinese
            v-if="matchResult.isShowUpdateChinese"
          />

          <AdultEmby
            v-model:clean-name="matchResult.cleanName"
          />
        </div>
      </div>
    </Teleport>
  </template>
</template>

<style lang="scss" scoped></style>
