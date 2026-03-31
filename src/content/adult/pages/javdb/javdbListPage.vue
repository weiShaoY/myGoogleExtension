<!------------------------------------  JavDB 列表页面  ------------------------------------------------->
<script setup lang="ts">

import { onMounted, ref } from 'vue'

import { useJavdbMatch } from '@/composables/useJavdbMatch'

/**
 * 文件夹存储
 */
const adultStore = useAdultStore()

/**
 * 页面上匹配到的视频结果列表
 */
const listPageMatchResultList = ref<AdultType.ListPageMatchResultList>([])

/**
 * 导入共享逻辑
 */
const { cleanVideoName, createMatchResult } = useJavdbMatch()

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

    const folderMatchedVideoList = adultStore.matchVideos(cleanName)

    if (folderMatchedVideoList.length === 0) {
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
      folderMatchedVideoList,
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
      v-if="matchResult.folderMatchedVideoList.length"
      :to="`.${matchResult.cleanName}`"
    >
      <!-- 事件处理包装器 -->
      <div
        class="teleport-wrapper"
        style="pointer-events: auto;"
        @click="preventEvent"
        @mousedown="preventEvent"
        @mouseup="preventEvent"
        @pointerdown="preventEvent"
        @pointerup="preventEvent"
      >
        <div
          class="h-auto w-full flex flex-col items-center border border-gray-200 rounded-lg bg-[rgb(255,255,255)] p-3 space-y-4"
        >
          <section
            class="w-full space-y-2"
          >
            <AdultInventory
              v-for="file in matchResult.folderMatchedVideoList"
              :key="file.id"
              :file="file"
            />
          </section>

          <section
            class="grid grid-cols-2 h-15 w-full gap-2 [&>*:last-child:nth-child(1)]:col-span-2"
          >
            <AdultChinese
              v-if="matchResult.isShowUpdateChinese"
            />

            <AdultEmby
              :video-name="matchResult.cleanName"
            />

          </section>
        </div>

      </div>
    </Teleport>
  </template>
</template>

<style lang="scss" scoped>

</style>
