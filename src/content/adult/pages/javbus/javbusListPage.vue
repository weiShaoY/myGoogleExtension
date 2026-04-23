<script setup lang="ts">
import { onMounted, ref } from 'vue'

/**
 * 文件夹存储
 */
const adultStore = useAdultStore()

/**
 * 页面所有视频列表盒子
 */
const listPageAllVideoBoxes = ref<AdultType.ListPageMatchResultList>([])

const HIGHLIGHT_CLASS = 'is-highlight'

const CHINESE_TAG_SELECTOR = '.btn-warning'

const LIST_PAGE_VIDEO_ITEM_SELECTOR = '#waterfall .movie-box'

const { cleanVideoName, createMatchResult } = useAdultPageMatch()

function getVideoName(item: Element): string {
  return item
    .getAttribute('href')
    ?.split('/')
    ?.pop() ?? ''
}

function getMovieItems(): Element[] {
  return Array.from($$(LIST_PAGE_VIDEO_ITEM_SELECTOR))
}

function buildMatchResultList(): AdultType.ListPageMatchResultList {
  const result: AdultType.ListPageMatchResultList = []

  for (const item of getMovieItems()) {
    // 👉 语义函数保留
    const videoName = getVideoName(item)

    const cleanName = cleanVideoName(videoName)

    if (!cleanName) {
      continue
    }

    const hasChineseTag = isElementExists($(item, CHINESE_TAG_SELECTOR))

    const folderMatchedVideos = adultStore.getFolderMatchedVideoList(cleanName)

    const teleportTarget = `${getRandomString(6)}_${cleanName}`

    if (item) {
      item.classList.add(teleportTarget)

      if (folderMatchedVideos.length) {
        item.classList.add(HIGHLIGHT_CLASS)
      }
    }

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
  <AdultListPage
    :list="listPageAllVideoBoxes"
  />
</template>

<style lang="scss" scoped></style>
