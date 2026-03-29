<!------------------------------------  JavDB 列表页面  ------------------------------------------------->
<script setup lang="ts">
import type { ListPageMatchResultList } from '@/types/content/javdb'

import { onMounted, ref } from 'vue'

import { useJavdbMatch } from '@/composables/useJavdbMatch'

/**
 * 文件夹存储
 */
const folderStore = useFolderStore()

/**
 * 页面上匹配到的视频结果列表
 */
const listPageMatchResultList = ref<ListPageMatchResultList>([])

/**
 * 导入共享逻辑
 */
const { handleWrapperClick, createMatchResult, isElementExists } = useJavdbMatch()

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
    if (isElementExists(boxElement)) {
      boxElement.classList.add(cleanName)
      boxElement.classList.add('is-highlight')
    }

    // 检查是否有中文字幕标签
    const hasChineseTag = !!movieItem.querySelector('.is-warning')

    // 创建匹配结果项
    const matchResultItem = createMatchResult(
      cleanName,
      localMatchedFileList,
      hasChineseTag,
    )

    listPageMatchResultList.value.push(matchResultItem)
  })

  console.log('🚀 ~ 匹配视频结果列表:', listPageMatchResultList.value)
}

onMounted(() => delayRun(processVideoList))
</script>

<template>
  <template
    v-for="matchResult in listPageMatchResultList"
    :key="matchResult.cleanName"
  >
    <Teleport
      v-if="matchResult.localMatchedFileList.length"
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

<style lang="scss" scoped>

</style>
