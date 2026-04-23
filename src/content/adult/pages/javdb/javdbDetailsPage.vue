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
 *  页面视频名称
 */
const pageVideoName = ref<string>('')

/**
 * 工具
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
 * 磁链处理
 */
function getTorrentList() {
  // 1. 清空数据（防止重复追加）
  torrentList.value = []
  hasChineseTag.value = false

  // 2. 获取容器并校验
  const magnetsContent = $('#magnets-content')

  if (!magnetsContent?.children.length) {
    console.warn('未找到磁链区域或内容为空')
    return
  }

  // 3. 转数组遍历

  const items = Array.from($$(magnetsContent, '.columns'))

  const list: AdultType.TorrentItem[] = []

  for (const el of items) {
    const item = asHTMLElement(el)

    if (!item) {
      continue
    }

    const url = $(item, '.copy-to-clipboard')?.dataset.clipboardText || ''

    if (!url) {
      continue
    }

    const name = $(item, '.name')?.textContent?.trim() || ''

    const time = $(item, '.time')?.textContent?.trim() || ''

    const sizeText = $(item, '.meta')?.textContent?.trim() || ''

    const size = parseFileSizeToGB(sizeText)

    const tags = getVideoTagsFromName(name)

    const isChinese = AdultConfig.rules.chineseSubtitleRules.some(tag =>
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

  const ok = insertHtml('.no-bottom', '<div id="TorrentList"></div>')

  isShowTorrentList.value = ok
}

/**
 * 主逻辑
 */
function main() {
  const videoName = $('.video-detail strong')?.textContent

  const cleanName = cleanVideoName(videoName)

  pageVideoName.value = cleanName

  if (!cleanName) {
    return
  }

  const folderMatchedVideos = adultStore.getFolderMatchedVideoList(cleanName)

  if (!folderMatchedVideos.length) {
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

  <AdultDetailsPage
    :details-page-match-result="detailsPageMatchResult"
    :torrent-list="torrentList"
  />

</template>

<style lang="scss" scoped>

</style>
