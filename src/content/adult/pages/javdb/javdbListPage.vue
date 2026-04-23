<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useJavdbMatch } from '@/composables/useJavdbMatch'

/**
 * 文件夹存储
 */
const adultStore = useAdultStore()

/**
 * 页面所有视频列表盒子
 */
const listPageAllVideoBoxes = ref<AdultType.ListPageMatchResultList>([])

/**
 * 导入共享逻辑
 */
const { cleanVideoName, createMatchResult } = useJavdbMatch()

/**
 * 中文磁链标记选择器
 */
const CHINESE_TAG_SELECTOR = '.is-warning'

/**
 * 获取标题
 * @param {Element} item
 * @returns {string}
 */
function getVideoName(item: Element): string {
  return $(item, 'strong')?.textContent?.trim() || ''
}

/**
 * 获取列表 DOM
 * @returns {Element[]}
 */
function getMovieItems(): Element[] {
  return Array.from($$('.movie-list .item .box'))
}

/**
 * 构建匹配结果列表（优化版）
 * @returns {AdultType.ListPageMatchResultList}
 */
function buildMatchResultList(): AdultType.ListPageMatchResultList {
  const result: AdultType.ListPageMatchResultList = []

  for (const item of getMovieItems()) {
    // 👉 语义函数保留
    const videoName = getVideoName(item)

    const cleanName = cleanVideoName(videoName)

    if (!cleanName) {
      continue
    }

    // 👉 DOM 查询统一
    const hasChineseTag = isElementExists($(item, CHINESE_TAG_SELECTOR))

    const folderMatchedVideos = adultStore.getFolderMatchedVideoList(cleanName)

    const teleportTarget = `video_${cleanName}`

    // 👉 DOM 操作
    if (item) {
      item.classList.add(teleportTarget)

      if (folderMatchedVideos.length) {
        item.classList.add('is-highlight')
      }
    }

    // 👉 收集结果
    result.push(
      createMatchResult(
        cleanName,
        folderMatchedVideos,
        hasChineseTag,
        teleportTarget,
      ),
    )
  }

  return result
}

/**
 * 主逻辑
 */
function main() {
  listPageAllVideoBoxes.value = buildMatchResultList()
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
      <!-- 阻止事件冒泡 -->
      <div
        class="teleport-wrapper"
        style="pointer-events: auto"
        @click="preventEvent"
        @mousedown="preventEvent"
        @mouseup="preventEvent"
        @pointerdown="preventEvent"
        @pointerup="preventEvent"
      >
        <!-- 卡片主体 -->
        <div
          class="h-auto w-full flex flex-col items-center border border-gray-200 rounded-lg bg-white p-3 space-y-4"
        >
          <!-- 操作区 -->
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

          <!-- 文件信息 -->
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

<style scoped>
.teleport-wrapper {
  pointer-events: auto;
}
</style>
