<script lang="ts" setup>
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
const detailsPageMatchResult
  = ref<AdultType.DetailsPageMatchResult>({
    cleanName: '',
    isShowUpdateChinese: false,
    folderMatchedVideos: [],
  })

/* =========================================================
 *                  DOM 配置（统一风格）
 * ========================================================= */

const DETAILS_PAGE_DOM = {
  /**
   * 高亮配置
   */
  highlight: {
    class: 'is-highlight',
    selector: '.movie',
  },

  /**
   * 磁链模块
   */
  torrent: {
    container: '#magnet-table',
    item: 'tr',
    url: '.copy-to-clipboard',
    name: '.name',
    time: '.time',
    size: '.meta',
    mount: '.container #magneturlpost',
  },

  /**
   * 结构解析规则（table结构专用）
   */
  table: {
    minColumns: 3,
  },
}

/* =========================================================
 *                    标题获取
 * ========================================================= */

function getVideoName(): string {
  return location.pathname.split('/').pop() || ''
}

/* =========================================================
 *                    磁链解析
 * ========================================================= */

function getTorrentList() {
  torrentList.value = []
  hasChineseTag.value = false

  const container = $(DETAILS_PAGE_DOM.torrent.container)

  if (!container?.children.length) {
    console.warn('未找到磁链区域或内容为空')
    return
  }

  const items = Array.from(
    container.querySelectorAll(DETAILS_PAGE_DOM.torrent.item),
  )

  const list: AdultType.TorrentItem[] = []

  for (const el of items) {
    const item = asHTMLElement(el)

    if (!item) {
      continue
    }

    const tdList = item.children

    if (tdList.length < DETAILS_PAGE_DOM.table.minColumns) {
      continue
    }

    const url
      = $<HTMLAnchorElement>(tdList[0], 'a')?.href || ''

    if (!url) {
      continue
    }

    const name
      = tdList[0]?.children[0]?.textContent?.trim() || ''

    const sizeText
      = tdList[1]?.children[0]?.textContent?.trim() || ''

    const time
      = tdList[2]?.children[0]?.textContent?.trim() || ''

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

  const folderMatchedVideos
    = adultStore.getFolderMatchedVideoList(cleanName)

  detailsPageMatchResult.value = createMatchResult(
    cleanName,
    folderMatchedVideos,
    hasChineseTag.value,
  )

  if (!folderMatchedVideos.length) {
    return
  }

  const highlightElement
    = $(DETAILS_PAGE_DOM.highlight.selector)

  highlightElement?.classList.add(
    DETAILS_PAGE_DOM.highlight.class,
  )
}

/* =========================================================
 *                页面结构调整（保留逻辑）
 * ========================================================= */

function adjustJavbusDetailLayout() {
  const sampleWaterfall = $('#sample-waterfall')

  const torrentListEl = $('#TorrentList')

  if (isElementExists(sampleWaterfall) && isElementExists(torrentListEl)) {
    sampleWaterfall.style.margin = '24px auto'
    torrentListEl.parentNode?.insertBefore(
      sampleWaterfall,
      torrentListEl,
    )
  }

  $('#mag-submit-show')?.remove()
}

/* =========================================================
 *                    生命周期
 * ========================================================= */

onMounted(() => {
  delayRun(() => {
    getTorrentList()
    main()
    adjustJavbusDetailLayout()
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
