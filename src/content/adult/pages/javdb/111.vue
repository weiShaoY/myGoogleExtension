<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { useAdultPageMatch } from '@/composables/useJavdbMatch'

/**
 * 文件夹存储
 */
const adultStore = useAdultStore()

/**
 * 页面所有视频列表盒子
 */
const listPageAllVideoBoxes = ref<AdultType.ListPageMatchResultList>([])

/**
 * 视频项高亮状态类名
 *
 * @description
 * 当当前视频在本地文件夹中匹配到资源时，
 * 会为对应 item/box 添加该 class，用于视觉高亮提示。
 *
 * @usage
 * element.classList.add(HIGHLIGHT_CLASS)
 */
const HIGHLIGHT_CLASS = 'is-highlight'

/**
 * 导入共享逻辑
 */
const { cleanVideoName, createMatchResult } = useAdultPageMatch()

/**
 * 中文磁链状态标记选择器
 *
 * @description
 * 用于检测当前视频条目是否包含中文磁链提示信息。
 * 通常存在于列表项 box 内部，用于标识该视频是否存在中文资源标签。
 *
 * ⚠️ 注意：
 * 该选择器仅用于状态判断（hasChineseTag），
 * 不参与 DOM 结构渲染或布局控制。
 *
 * @usage
 * const hasChineseTag = isElementExists($(item, CHINESE_TAG_SELECTOR))
 */
const CHINESE_TAG_SELECTOR = '.is-warning'

/**
 * 列表页视频 item 的 box 容器选择器
 *
 * @description
 * 用于定位每个视频条目中的操作容器
 * 该容器内部包含：
 * - 标题
 * - 中文磁链标记（.is-warning）
 * - 其他操作 UI 区域
 *
 * ⚠️ 注意：
 * 中文磁链状态通过 `.is-warning` 判断，而不是 box 本身
 */
const LIST_PAGE_VIDEO_ITEM_SELECTOR = '.movie-list .item .box'

/**
 * 获取标题
 * @param {Element} item
 * @returns {string}
 */
function getVideoName(item: Element): string {
  return $(item, 'strong')?.textContent?.trim() || ''
}

/**
 * 获取列表 DOM 元素列表
 * @returns {Element[]}
 */
function getMovieItems(): Element[] {
  return Array.from($$(LIST_PAGE_VIDEO_ITEM_SELECTOR))
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

    const teleportTarget = `${getRandomString(6)}_${cleanName}`

    // 👉 DOM 操作
    if (item) {
      item.classList.add(teleportTarget)

      if (folderMatchedVideos.length) {
        item.classList.add(HIGHLIGHT_CLASS)
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
