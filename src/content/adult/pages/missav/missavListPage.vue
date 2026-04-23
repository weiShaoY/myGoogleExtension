<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import { useAdultPageMatch } from '@/composables/useAdultPageMatch'

/**
 * 文件夹存储
 */
const adultStore = useAdultStore()

/**
 * 页面匹配结果列表
 */
const listPageAllVideoBoxes
  = ref<AdultType.ListPageMatchResultList>([])

/**
 * 工具函数
 */
const { cleanVideoName, createMatchResult }
  = useAdultPageMatch()

/* =========================================================
 *                  DOM 配置（统一结构）
 * ========================================================= */

const LIST_PAGE_DOM = {
  item: {
    selector: 'div.thumbnail.group',
  },

  video: {
    nameSelector:
      '.text-secondary.group-hover\\:text-primary',
  },

  tag: {
    chineseSelector: 'a.text-secondary',
    keyword: 'chinese-subtitle',
  },

  highlight: {
    class: 'is-highlight',
  },
}

/* =========================================================
 *                  视频名称解析
 * ========================================================= */

function getVideoName(item: Element): string {
  return (
    $(item, LIST_PAGE_DOM.video.nameSelector)
      ?.textContent
      ?.trim()
      ?.split(' ')[0] ?? ''
  )
}

/* =========================================================
 *                  主逻辑
 * ========================================================= */

function buildMatchResultList() {
  const result: AdultType.ListPageMatchResultList = []

  const items = $$(LIST_PAGE_DOM.item.selector)

  for (const item of items) {
    const videoName = getVideoName(item)

    const cleanName = cleanVideoName(videoName)

    if (!cleanName) {
      continue
    }

    const hasChineseTag = !!$<HTMLAnchorElement>(
      item,
      LIST_PAGE_DOM.tag.chineseSelector,
    )?.href?.includes(LIST_PAGE_DOM.tag.keyword)

    const folderMatchedVideos
      = adultStore.getFolderMatchedVideoList(cleanName)

    const teleportTarget
      = `${cleanName}_${getRandomNumber()}`

    if (item) {
      item.classList.add(teleportTarget)

      if (folderMatchedVideos.length) {
        item.classList.add(LIST_PAGE_DOM.highlight.class)
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

/* =========================================================
 *                  生命周期
 * ========================================================= */

onMounted(() => delayRun(main))
</script>

<template>
  <AdultListPage
    :list="listPageAllVideoBoxes"
  />
</template>

<style lang="scss" scoped></style>
