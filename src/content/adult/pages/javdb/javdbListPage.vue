<!------------------------------------  JavDB 列表页面  ------------------------------------------------->
<script setup lang="ts">

import { onMounted, ref } from 'vue'

import { useJavdbMatch } from '@/composables/useJavdbMatch'

/**
 * 文件夹存储
 */
const adultStore = useAdultStore()

/**
 *  页面所有视频列表盒子
 */
const listPageAllVideoBoxes = ref<AdultType.ListPageMatchResultList>([])

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

    const teleportTarget = `${getRandomString()}_${cleanName}`

    const targetElement = $(item, '.box')

    // 检查是否有中文字幕标签
    const hasChineseTag = isElementExists($(item, '.is-warning'))

    const folderMatchedVideos = adultStore.getFolderMatchedVideoList(cleanName)

    // 添加样式类
    if (isElementExists(targetElement)) {
      //  与详情页不同, 列表页 每个视频都有一个teleportTarget 不是匹配上才添加
      targetElement.classList.add(teleportTarget)
      if (folderMatchedVideos.length) {
        targetElement.classList.add('is-highlight')
      }
    }

    // 创建匹配结果项
    const matchResultItem = createMatchResult(
      cleanName,
      folderMatchedVideos,
      hasChineseTag,
      teleportTarget,
    )

    listPageAllVideoBoxes.value.push(matchResultItem)
  })
  console.log('🚀 ~ file: javdbListPage.vue:73 ~ listPageMatchResults.value:', listPageAllVideoBoxes.value)
}

onMounted(() => delayRun(main))
</script>

<template>

  <template
    v-for="item in listPageAllVideoBoxes"
    :key="item.teleportTarget"
  >
    <Teleport
      :to="`.${item.teleportTarget}`"
    >
      <!-- 事件处理包装器 -->
      <div
        class="teleport-wrapper"
        style="pointer-events: auto"
        @click="preventEvent"
        @mousedown="preventEvent"
        @mouseup="preventEvent"
        @pointerdown="preventEvent"
        @pointerup="preventEvent"
      >
        <div
          class="h-auto w-full flex flex-col items-center border border-gray-200 rounded-lg bg-white p-3 space-y-4"
        >
          <div
            class="w-full flex items-center justify-start gap-2"
          >

            <SitePlayButton
              :video-name="item.cleanName"
              site="javdb"
              :size="40"
            />

            <SitePlayButton
              :video-name="item.cleanName"
              site="javBus"
              :size="40"
            />

            <SitePlayButton
              :video-name="item.cleanName"
              site="missAv"
              :size="40"
            />

            <SitePlayButton
              v-if="item.folderMatchedVideos.length"
              :video-name="item.cleanName"
              site="emby"
              :size="40"
            />

            <AdultThumbnail
              :video-name="item.cleanName"
              :size="40"
            />
          </div>

          <template
            v-if="item.folderMatchedVideos.length"
          >
            <AdultChinese
              v-if="item.isShowUpdateChinese"
            />

            <AdultInventory
              v-for="file in item.folderMatchedVideos"
              :key="file.id"
              :file="file"
            />
          </template>
        </div>
      </div>
    </Teleport>
  </template>
</template>

<style lang="scss" scoped></style>
