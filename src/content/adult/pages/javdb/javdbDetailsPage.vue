<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import { AdultConfig } from '@/configs'

/**
 * 文件夹存储
 */
const adultStore = useAdultStore()

/**
 * 是否视频存在中文磁链
 */
const hasChineseTag = ref<boolean>(false)

/**
 * 是否显示自定义磁链列表
 */
const isShowTorrentList = ref<boolean>(false)

/**
 * 磁链列表
 */
const torrentList = ref<AdultType.TorrentItem[]>([])

/**
 * 工具函数
 */
const { cleanVideoName, createMatchResult } = useAdultPageMatch()

/**
 * 详情页匹配结果
 */
const detailsPageMatchResult = ref<AdultType.DetailsPageMatchResult>({
  cleanName: '',
  isShowUpdateChinese: false,
  folderMatchedVideos: [],
})

/* =========================================================
 *                  详情页 DOM 配置对象
 * ========================================================= */

const DETAILS_PAGE_DOM = {
  highlight: {
    class: 'is-highlight',
    selector: '.video-meta-panel',
  },

  /**
   * 磁链模块
   */
  torrent: {
    /**
     * 容器
     */
    container: '#magnets-content',

    /**
     * item
     */

    item: '.columns',

    /**
     * 下载链接
     */
    url: '.copy-to-clipboard',

    /**
     * 名称
     */

    name: '.name',

    /**
     * 时间
     */

    time: '.time',

    /**
     * 大小
     */
    size: '.meta',

    /**
     * * 插入容器
     */
    mount: '.no-bottom',
  },
}

/**
 * 获取标题
 */
function getVideoName(): string {
  return $('.video-detail strong')?.textContent || ''
}

/* =========================================================
 *                    磁链解析
 * ========================================================= */

function getTorrentList() {
  torrentList.value = []

  hasChineseTag.value = false

  const magnetsContent = $(DETAILS_PAGE_DOM.torrent.container)

  if (!magnetsContent?.children.length) {
    console.warn('未找到磁链区域或内容为空')
    return
  }

  const items = Array.from(

    $$(magnetsContent, DETAILS_PAGE_DOM.torrent.item),

  )

  const list: AdultType.TorrentItem[] = []

  for (const el of items) {
    const item = asHTMLElement(el)

    if (!item) {
      continue
    }

    const url

      = $(item, DETAILS_PAGE_DOM.torrent.url)

        ?.dataset
        .clipboardText || ''

    if (!url) {
      continue
    }

    const name

      = $(item, DETAILS_PAGE_DOM.torrent.name)

        ?.textContent
        ?.trim() || ''

    const time

      = $(item, DETAILS_PAGE_DOM.torrent.time)

        ?.textContent
        ?.trim() || ''

    const sizeText

      = $(item, DETAILS_PAGE_DOM.torrent.size)

        ?.textContent
        ?.trim() || ''

    const size = parseFileSizeToGB(sizeText)

    const tags = getVideoTagsFromName(name)

    const isChinese

      = AdultConfig.rules.chineseSubtitleRules.some(tag =>

        name.toLowerCase().includes(tag.toLowerCase()),

      )

    if (isChinese) {
      hasChineseTag.value = true
    }

    list.push({
      url,
      name,
      size,
      time,
      tags,
    })
  }

  torrentList.value = list

  insertHtml(
    DETAILS_PAGE_DOM.torrent.mount,
    '<div id="TorrentList"></div>',
  )

  isShowTorrentList.value = true
}

/* =========================================================
 *                    主逻辑
 * ========================================================= */

function main() {
  const videoName = getVideoName()

  const cleanName = cleanVideoName(videoName)

  if (!cleanName) {
    return
  }

  const folderMatchedVideos = adultStore.getFolderMatchedVideoList(cleanName)

  detailsPageMatchResult.value = createMatchResult(
    cleanName,
    folderMatchedVideos,
    hasChineseTag.value,
  )

  // 没有匹配到文件
  if (!folderMatchedVideos.length) {
    return
  }

  const highlightElement = $(DETAILS_PAGE_DOM.highlight.selector)

  highlightElement?.classList.add(DETAILS_PAGE_DOM.highlight.class)
}

/* =========================================================
 *                    生命周期
 * ========================================================= */

onMounted(() => {
  delayRun(() => {
    getTorrentList()
    main()
  })
})
</script>

<template>
  <AdultDetailsPage
    :details-page-match-result="detailsPageMatchResult"
    :torrent-list="torrentList"
  />
</template>

<style lang="scss" scoped></style>
