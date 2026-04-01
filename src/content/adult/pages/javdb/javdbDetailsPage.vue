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
const torrentList = ref<TorrentType[]>([])

/**
 * 导入共享逻辑
 */
const { cleanVideoName, createMatchResult } = useJavdbMatch()

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
  const magnetsContent = $('#magnets-content')

  if (!magnetsContent || magnetsContent.children.length === 0) {
    console.warn('未找到 magnetsContent 元素或其子元素为空')
    return
  }

  const items = Array.from(magnetsContent.querySelectorAll('.columns'))

  items.forEach((itemElement) => {
    const item = asHTMLElement(itemElement)

    if (!item) {
      return
    }

    const url = (item.querySelector('.copy-to-clipboard') as HTMLElement)?.dataset?.clipboardText || ''

    const name = item.querySelector('.name')?.textContent?.trim() || ''

    const sizeText = item.querySelector('.meta')?.textContent?.trim() || ''

    const time = item.querySelector('.time')?.textContent?.trim() || ''

    let size = 0

    const sizeMatch = sizeText.match(/(\d+(\.\d+)?)\s*(GB|MB)/i)

    if (sizeMatch) {
      const value = Number.parseFloat(sizeMatch[1])

      const unit = sizeMatch[3]?.toUpperCase()

      size = unit === 'MB' ? value / 1024 : value
      size = Math.round(size * 100) / 100
    }

    const tags = AdultConfig.videoFileMatch.getVideoTagsFromName(name)

    const isMatched = AdultConfig.videoFileMatch.videoFileTags[0].names.some(tag =>
      name.toLowerCase().includes(tag.toLowerCase()),
    )

    if (isMatched && !hasChineseTag.value) {
      hasChineseTag.value = true
    }

    const torrentListItem: TorrentType = {
      url,
      name,
      size,
      time,
      tags,
    }

    torrentList.value.push(torrentListItem)
  })

  const targetElement = $('.no-bottom')

  if (targetElement) {
    targetElement.insertAdjacentHTML('afterend', '<div id="TorrentList"></div>')
    targetElement.insertAdjacentHTML('afterend', '<div id="OnlinePlay"></div>')

    isShowOnlinePlay.value = true
    isShowTorrentList.value = true
  }
}

/**
 * 主逻辑
 */
function main() {
  const el = $('.video-detail strong')

  const cleanName = cleanVideoName(el?.textContent)

  if (!cleanName) {
    return
  }

  const folderMatchedVideos = adultStore.getFolderMatchedVideoList(cleanName)

  if (folderMatchedVideos.length === 0) {
    return
  }

  const targetElement = $('.video-meta-panel')

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
      class="h-auto w-full flex flex-col items-center border border-gray-200 rounded-lg bg-[rgb(255,255,255)] p-3 space-y-4"
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

<style lang="scss" scoped>

</style>
