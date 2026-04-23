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
 * 是否显示在线播放组件
 */
const isShowOnlinePlay = ref<boolean>(false)

/**
 * 是否显示磁链列表
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
 *                  DOM 配置（统一结构）
 * ========================================================= */

const DETAILS_PAGE_DOM = {
  highlight: {
    class: 'is-highlight',
    selector: '.relative.-mx-4.sm\\:m-0.-mt-6',
  },

  video: {
    titleSelector: 'h1.text-base.lg\\:text-lg.text-nord6',
  },

  torrent: {
    table: 'div[x-show="currentTab === \'magnets\'"] table',
    row: 'tbody tr',
    cell: 'td',
    link: 'a',
  },

  ui: {
    mount:
      '.grid.grid-cols-2.md\\:grid-cols-3.xl\\:grid-cols-4.gap-5',

    torrentMount: '#TorrentList',
    onlineMount: '#OnlinePlay',
  },
}

/* =========================================================
 *                    磁链解析
 * ========================================================= */

function getTorrentList() {
  torrentList.value = []
  hasChineseTag.value = false

  const table = $(DETAILS_PAGE_DOM.torrent.table)

  if (!table) {
    console.warn('未找到磁力表格')
    return
  }

  const rows = Array.from(
    $$(table, DETAILS_PAGE_DOM.torrent.row),
  )

  for (const row of rows) {
    const cells = $$(row, DETAILS_PAGE_DOM.torrent.cell)

    if (cells.length < 3) {
      continue
    }

    const firstCell = cells[0]

    const link = $<HTMLAnchorElement>(
      firstCell,
      DETAILS_PAGE_DOM.torrent.link,
    )

    const url = link?.href ?? ''

    const name = link?.textContent?.trim() ?? ''

    const time = cells[2]?.textContent?.trim() ?? ''

    const sizeText = cells[1]?.textContent?.trim() ?? ''

    if (!url) {
      continue
    }

    const size = parseFileSizeToGB(sizeText)

    const tags = getVideoTagsFromName(name)

    const isChinese
      = AdultConfig.rules.chineseSubtitleRules.some(tag =>
        name.toLowerCase().includes(tag.toLowerCase()),
      )

    if (isChinese) {
      hasChineseTag.value = true
    }

    torrentList.value.push({
      url,
      name,
      size,
      time,
      tags,
    })
  }

  const inserted = insertHtml(
    DETAILS_PAGE_DOM.ui.mount,
    `
      <div id="TorrentList"></div>
      <div id="OnlinePlay"></div>
    `,
  )

  if (inserted) {
    isShowTorrentList.value = true
    isShowOnlinePlay.value = true
  }
}

/* =========================================================
 *                    主逻辑
 * ========================================================= */

function main() {
  const videoName
    = $(DETAILS_PAGE_DOM.video.titleSelector)
      ?.textContent
      ?.split(' ')[0] ?? ''

  const cleanName = cleanVideoName(videoName)

  if (!cleanName) {
    return
  }

  const folderMatchedVideos
    = adultStore.getFolderMatchedVideoList(cleanName)

  if (!folderMatchedVideos.length) {
    return
  }

  const targetElement
    = $(DETAILS_PAGE_DOM.highlight.selector)

  targetElement?.classList.add(
    DETAILS_PAGE_DOM.highlight.class,
  )

  detailsPageMatchResult.value = createMatchResult(
    cleanName,
    folderMatchedVideos,
    hasChineseTag.value,
  )
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
