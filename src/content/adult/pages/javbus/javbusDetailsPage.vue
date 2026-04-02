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
  const magnetsContent = $('#magnet-table')

  if (!magnetsContent || magnetsContent.children.length === 0) {
    console.warn('未找到 magnetsContent 元素或其子元素为空')
    return
  }

  const items = Array.from(magnetsContent.querySelectorAll('tr'))

  console.log('🚀 ~ file: javbusDetailsPage.vue:55 ~ items:', items)

  items.forEach((itemElement) => {
    const item = asHTMLElement(itemElement)

    if (!item) {
      return
    }

    const tdList = item.children

    if (tdList.length < 3) {
      return
    } // 防止结构异常报错

    // 安全获取 URL
    const url = $<HTMLAnchorElement>(tdList[0], 'a')?.href ?? ''

    // 安全获取名称
    const name = tdList[0]?.children[0]?.textContent?.trim() || ''

    const sizeText = tdList[1]?.children[0]?.textContent?.trim() || ''

    const size = parseFileSizeToGB(sizeText)

    // 安全获取时间
    const time = tdList[2]?.children[0]?.textContent?.trim() || ''

    // 提取标签
    const tags = getVideoTagsFromName(name)

    if (!url) {
      return
    }

    // 判断中文字幕

    const isChineseSub = AdultConfig.rules.chineseSubtitleRules.some(tag =>
      name.toLowerCase().includes(tag.toLowerCase()),
    )

    if (isChineseSub && !hasChineseTag.value) {
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

  // 👇 使用封装的 insertHtml 安全插入 DOM
  const target = '.container #magneturlpost'

  const success1 = insertHtml(target, '<div id="TorrentList"></div>')

  const success2 = insertHtml(target, '<div id="OnlinePlay"></div>')

  // 插入成功后再显示
  if (success1 && success2) {
    isShowTorrentList.value = true
    isShowOnlinePlay.value = true
  }
}

/**
 * 主逻辑
 */
function main() {
  const name = location.pathname.split('/').pop()

  const cleanName = cleanVideoName(name)

  if (!cleanName) {
    return
  }

  const folderMatchedVideos = adultStore.getFolderMatchedVideoList(cleanName)

  if (folderMatchedVideos.length === 0) {
    return
  }

  const targetElement = $('.movie')

  targetElement?.classList.add('is-highlight')

  // 使用共享函数创建匹配结果
  detailsPageMatchResult.value = createMatchResult(
    cleanName,
    folderMatchedVideos,
    hasChineseTag.value,
  )
}

/**
 * 调整 Javbus 详情页页面元素结构
 * @description 修改预览图位置、移除无用模块、优化页面布局
 */
function adjustJavbusDetailLayout() {
  // 获取目标元素
  const sampleWaterfall = $('#sample-waterfall')

  const torrentList = $('#TorrentList')

  // 调整预览图位置：放到种子列表上方
  if (isElementExists(sampleWaterfall) && isElementExists(torrentList)) {
    sampleWaterfall.style.margin = '24px auto'
    torrentList.parentNode?.insertBefore(sampleWaterfall, torrentList)
  }

  // 移除无用模块：磁力链接投稿
  $('#mag-submit-show')?.remove()
}

onMounted(() => {
  delayRun(() => {
    getTorrentList()

    main()

    // 调整 Javbus 详情页页面元素结构
    adjustJavbusDetailLayout()
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

<style lang="scss" scoped>

</style>
