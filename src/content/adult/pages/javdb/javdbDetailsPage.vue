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
  // 1. 清空数据（防止重复追加）
  torrentList.value = []
  hasChineseTag.value = false

  // 2. 获取容器并校验
  const magnetsContent = $('#magnets-content')

  if (!magnetsContent || !magnetsContent.children.length) {
    console.warn('未找到磁链区域或内容为空')
    return
  }

  // 3. 转数组遍历

  const items = Array.from($$(magnetsContent, '.columns'))

  items.forEach((itemElement) => {
    // 1. 安全转为 HTMLElement
    const item = asHTMLElement(itemElement)

    if (!item) {
      return
    }

    // 提取字段
    const url = $(item, '.copy-to-clipboard')?.dataset.clipboardText || ''

    const name = $(item, '.name')?.textContent?.trim() || ''

    const time = $(item, '.time')?.textContent?.trim() || ''

    const sizeText = $(item, '.meta')?.textContent?.trim() || ''

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

  // 4. 插入容器（使用封装好的安全函数）
  const success1 = insertHtml('.no-bottom', '<div id="TorrentList"></div>')

  const success2 = insertHtml('.no-bottom', '<div id="OnlinePlay"></div>')

  // 只有插入成功才显示
  if (success1 && success2) {
    isShowTorrentList.value = true
    isShowOnlinePlay.value = true
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
