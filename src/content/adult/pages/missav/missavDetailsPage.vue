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
 * 是否显示自定义磁链列表
 */
const isShowTorrentList = ref<boolean>(false)

/**
 * 磁链列表
 */
const torrentList = ref<AdultType.TorrentItem[]>([])

/**
 * 导入共享逻辑
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

/**
 * 获取页面中的磁链列表
 */
function getTorrentList() {
  // 1. 清空数据（防止重复追加）
  torrentList.value = []
  hasChineseTag.value = false

  const table = $('div[x-show="currentTab === \'magnets\'"] table')

  if (!table) {
    console.warn('未找到磁力表格')
    return
  }

  const items = Array.from($$(table, 'tbody tr'))

  items.forEach((row) => {
    const cells = $$(row, 'td')

    if (cells.length < 3) {
      return
    }

    const firstCell = cells[0]

    // 安全获取链接（指定 a 标签类型）
    const link = $<HTMLAnchorElement>(firstCell, 'a')

    const url = link?.href ?? ''

    const name = link?.textContent?.trim() ?? ''

    const time = cells[2]?.textContent?.trim() ?? ''

    const sizeText = cells[1]?.textContent?.trim() ?? ''

    const size = parseFileSizeToGB(sizeText)

    const tags = getVideoTagsFromName(name)

    // 无 URL 直接跳过
    if (!url) {
      return
    }

    // 判断中文字幕
    const isChineseSub = AdultConfig.rules.chineseSubtitleRules.some(tag =>
      name.toLowerCase().includes(tag.toLowerCase()),
    )

    if (isChineseSub) {
      hasChineseTag.value = true
    }

    // 推入列表
    torrentList.value.push({
      url,
      name,
      size,
      time,
      tags,
    })
  })

  // 8. 安全插入容器（一次性插入，顺序不乱）
  const targetSelector = '.grid.grid-cols-2.md\\:grid-cols-3.xl\\:grid-cols-4.gap-5'

  const inserted = insertHtml(targetSelector, `
    <div id="TorrentList"></div>
    <div id="OnlinePlay"></div>
  `)

  // 插入成功后再显示
  if (inserted) {
    isShowTorrentList.value = true
    isShowOnlinePlay.value = true
  }
}

/**
 * 主逻辑
 */
function main() {
  const videoName = $('h1.text-base.lg\\:text-lg.text-nord6')?.textContent.split(' ')[0] ?? ''

  const cleanName = cleanVideoName(videoName)

  if (!cleanName) {
    return
  }

  const folderMatchedVideos = adultStore.getFolderMatchedVideoList(cleanName)

  if (folderMatchedVideos.length === 0) {
    return
  }

  const targetElement = $('.relative.-mx-4.sm\\:m-0.-mt-6')

  // const targetElement = $('.flex-1.order-first')

  targetElement?.classList.add('is-highlight')

  // 使用共享函数创建匹配结果
  detailsPageMatchResult.value = createMatchResult(
    cleanName,
    folderMatchedVideos,
    hasChineseTag.value,
  )
}

onMounted(() => {
  delayRun(() => {
    getTorrentList()
    main()
  })
})
</script>

<template>
  <!-- 自定义磁链列表 -->
  <AdultTorrent
    v-if="isShowTorrentList"
    to="#TorrentList"
    :torrent-list="torrentList"
  />

  <div
    v-if="detailsPageMatchResult.folderMatchedVideos.length > 0 "
    class="fixed left-2 top-60 !w-70"
  >
    <div
      class="h-auto w-full flex flex-col items-center border border-gray-200 rounded-lg bg-white p-3 space-y-4"
    >
      <section
        class="w-full space-y-2"
      >
        <AdultInventory
          v-for="file in detailsPageMatchResult.folderMatchedVideos"
          :key="file.id"
          :file="file"
        />
      </section>

      <section
        class="grid grid-cols-2 h-15 w-full gap-2 [&>*:last-child:nth-child(1)]:col-span-2"
      >
        <AdultChinese
          v-if="detailsPageMatchResult.isShowUpdateChinese"
        />

        <AdultEmby
          :video-name="detailsPageMatchResult.cleanName"
        />

      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
