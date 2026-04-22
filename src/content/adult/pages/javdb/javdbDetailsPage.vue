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
 * 是否网站播放组件
 */
const isShowSitePlay = ref<boolean>(false)

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

    // 4. 插入容器（使用封装好的安全函数）
    const success1 = insertHtml('.no-bottom', '<div id="TorrentList"></div>')

    // 只有插入成功才显示
    if (success1) {
      isShowTorrentList.value = true
      isShowSitePlay.value = true
    }
  })
}

/**
 * 主逻辑
 */
function main() {
  const videoName = $('.video-detail strong')?.textContent

  const cleanName = cleanVideoName(videoName)

  pageVideoName.value = cleanName
  console.log('🚀 ~ file: javdbDetailsPage.vue:135 ~ pageVideoName.value:', pageVideoName.value)

  if (!cleanName) {
    return
  }

  const success2 = insertHtml(
    '.panel.movie-panel-info',
    '<div id="SitePlay"></div>',
    'beforeend',
  )

  if (success2) {
    isShowSitePlay.value = true
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

    console.log('🚀 ~ file: javdbDetailsPage.vue:160 ~ detailsPageMatchResult.value:', detailsPageMatchResult.value)
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

  <Teleport
    v-if="isShowSitePlay && pageVideoName"
    to="#SitePlay"
  >
    <div
      class="ml-5 mt-5 w-full flex items-center gap-4"
    >
      <SitePlayButton
        :video-name="pageVideoName"
        site="javdb"
        :size="60"
      />

      <SitePlayButton
        :video-name="pageVideoName"
        site="javBus"
        :size="60"
      />

      <SitePlayButton
        :video-name="pageVideoName"
        site="missAv"
        :size="60"
      />

      <SitePlayButton
        v-if="detailsPageMatchResult.folderMatchedVideos.length > 0 && detailsPageMatchResult.cleanName"
        :video-name="detailsPageMatchResult.cleanName"
        site="emby"
        :size="60"
      />

      <AdultThumbnail
        :video-name="pageVideoName"
        :size="60"
      />
    </div>

  </Teleport>

  <div
    v-if="detailsPageMatchResult.folderMatchedVideos.length > 0 "
    class="fixed left-2 top-60 box-border !w-70"
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
        class="h-15 w-full flex"
      >
        <AdultChinese
          v-if="detailsPageMatchResult.isShowUpdateChinese"
        />

      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>
