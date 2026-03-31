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
  const magnetsContent = $('#magnet-table')

  if (!magnetsContent || magnetsContent.children.length === 0) {
    console.warn('未找到 magnetsContent 元素或其子元素为空')
    return
  }

  const items = Array.from(magnetsContent.querySelectorAll('tr'))

  items.forEach((itemElement) => {
    const item = asHTMLElement(itemElement)

    if (!item) {
      return
    }

    const tdList = item.children

    const url = (tdList[0]?.querySelector('a') as HTMLAnchorElement)?.href ?? ''

    const name = tdList[0].children[0]?.textContent?.trim() as string

    console.log('🚀 ~ file: javbusDetailsPage.vue:68 ~ name:', name)

    if (name === 'START-538-中文字幕') {
      const aaa = AdultConfig.videoFileMatch.getVideoTagsFromName(name)

      console.log('🚀 ~ file: javbusDetailsPage.vue:73 ~ aaa:', aaa)
    }

    const size = Number.parseFloat(tdList[1].children[0]?.textContent?.trim().match(/(\d+(\.\d+)?)GB/)?.[1] || '0')

    const time = tdList[2].children[0]?.textContent?.trim()

    const tags = AdultConfig.videoFileMatch.getVideoTagsFromName(name)

    const isMatched = AdultConfig.videoFileMatch.videoFileTags[0].names.some(tag =>
      name.toLowerCase().includes(tag.toLowerCase()),
    )

    // 如果匹配就执行后续逻辑
    if (isMatched && !hasChineseTag.value) {
    // 这里放你的后续逻辑代码
      console.log('名称包含中文或字幕标签')

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
  console.log('🚀 ~ file: javbusDetailsPage.vue:94 ~ torrentList.value:', torrentList.value)

  const targetElement = $('.container #magneturlpost')

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
  <TorrentList
    v-if="isShowTorrentList"
    to="#TorrentList"
    scroll-target=".video-panel"
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
