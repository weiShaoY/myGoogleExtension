<script lang="ts" setup>

import { onMounted, ref } from 'vue'

import { useJavdbMatch } from '@/composables/useJavdbMatch'

/**
 * 文件夹存储
 */
const adultStore = useAdultStore()

/**
 * 页面视频名称
 */
const pageVideoName = ref<string>('')

/**
 * 是否视频存在中文磁链
 */
const isVideoHaveChineseTorrent = ref<boolean>(false)

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
  folderMatchedVideoList: [],
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

    const copyBtn = item.querySelector('.copy-to-clipboard') as HTMLElement

    const url = copyBtn?.dataset?.clipboardText || ''

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

    const tagArray = getFileTagIconArray(name)

    if (
      (
        name.toLowerCase().includes('-c')
        || name.toLowerCase().includes('中文')
      )
      && !isVideoHaveChineseTorrent.value
    ) {
      isVideoHaveChineseTorrent.value = true
    }

    const torrentListItem: TorrentType = {
      url,
      name,
      size,
      time,
      tags: tagArray,
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

  pageVideoName.value = cleanName

  const localMatchedFileList = adultStore.matchVideos(cleanName)

  if (localMatchedFileList.length === 0) {
    return
  }

  const highlightElement = $('.video-meta-panel')

  highlightElement?.classList.add('is-highlight')

  // 使用共享函数创建匹配结果
  detailsPageMatchResult.value = createMatchResult(
    cleanName,
    localMatchedFileList,
    isVideoHaveChineseTorrent.value,
  )

  console.log('🚀 ~ file: javdbDetailsPage.vue:161 ~ detailsPageMatchResult.localMatchedFileList:', detailsPageMatchResult.value.folderMatchedVideoList)
}

onMounted(() => {
  getTorrentList()
  delayRun(main)
})
</script>

<template>

  <!-- 在线播放 -->
  <!-- <OnlinePlay
    v-if="isShowOnlinePlay"
    to="#OnlinePlay"
    :video-name="detailsPageMatchResult.cleanName"
  /> -->
  <!-- 自定义磁链列表 -->
  <TorrentList
    v-if="isShowTorrentList"
    to="#TorrentList"
    scroll-target=".video-panel"
    :torrent-list="torrentList"
  />

  <!-- 到右侧 -->
  <div
    v-if="detailsPageMatchResult.folderMatchedVideoList.length > 0 "
    class="fixed left-2 top-60 !w-70"
  >
    <div
      class="h-auto w-full flex flex-col items-center border border-gray-200 rounded-lg bg-[rgb(255,255,255)] p-3 space-y-4"
    >
      <section
        class="w-full space-y-2"
      >
        <AdultInventory
          v-for="file in detailsPageMatchResult.folderMatchedVideoList"
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
