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
const listPageMatchResults = ref<AdultType.ListPageMatchResultList>([])

/**
 * 导入共享逻辑
 */
const { cleanVideoName, createMatchResult } = useJavdbMatch()

/**
 * 处理页面主要逻辑
 * 遍历电影列表，匹配本地视频文件
 */
function main() {
  $$('.movie-list .item').forEach((item) => {
    const videoName = $(item, 'strong')?.textContent

    const cleanName = cleanVideoName(videoName)

    if (!cleanName) {
      return
    }

    const folderMatchedVideos = adultStore.getFolderMatchedVideoList(cleanName)

    if (folderMatchedVideos.length === 0) {
      return
    }

    const teleportTarget = `${cleanName}_${getRandomNumber()}`

    const targetElement = $(item, '.box')

    // 添加样式类
    if (isElementExists(targetElement)) {
      targetElement.classList.add('is-highlight')
      targetElement.classList.add(teleportTarget)
    }

    // 检查是否有中文字幕标签
    const hasChineseTag = isElementExists($(item, '.is-warning'))

    // 创建匹配结果项
    const matchResultItem = createMatchResult(
      cleanName,
      folderMatchedVideos,
      hasChineseTag,
      teleportTarget,
    )

    listPageMatchResults.value.push(matchResultItem)
  })
}

onMounted(() => delayRun(main))
</script>

<template>
  <template
    v-for="matchResult in listPageMatchResults"
    :key="matchResult.teleportTarget"
  >
    <Teleport
      v-if="matchResult.folderMatchedVideos.length"
      :to="`.${matchResult.teleportTarget}`"
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
          class="h-auto w-full flex flex-col items-center border border-gray-200 rounded-lg bg-white p-3 space-y-4"
        >
          <section
            class="w-full space-y-2"
          >
            <AdultInventory
              v-for="file in matchResult.folderMatchedVideos"
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
