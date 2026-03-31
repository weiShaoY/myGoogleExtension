<script lang="ts" setup>

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
 * 是否显示 提示更新中文磁链按钮
 */
const isShowPendingUpdateChineseButton = ref<boolean>(false)

/**
 * 是否显示 emby按钮
 */
const isShowEmbyButton = ref<boolean>(false)

/**
 * emby已入库列表
 */
const embyCatalogedList = ref<AdultType.VideoFile[]>([])

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
 * 获取详情页视频名称
 */
function getPageVideoName(): string {
  const url = window.location.href

  return url.substring(url.lastIndexOf('/') + 1)
    .trim()
    .toLowerCase() || ''
}

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

    const size = Number.parseFloat(tdList[1].children[0]?.textContent?.trim().match(/(\d+(\.\d+)?)GB/)?.[1] || '0')

    const time = tdList[2].children[0]?.textContent?.trim()

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
  const name = getPageVideoName()

  if (!name) {
    return
  }

  pageVideoName.value = name

  const matchedList = adultStore.matchVideos(name)

  if (!matchedList.length) {
    return
  }

  const highlightElement = $('.movie')

  highlightElement?.classList.add('is-highlight')

  embyCatalogedList.value = matchedList

  isShowEmbyButton.value = true

  const embyHasChinese = matchedList.some(item => item.hasChineseSubtitle)

  // 页面上有中文磁链但你Emby库里没有中文
  if (
    isVideoHaveChineseTorrent.value && !embyHasChinese
  ) {
    isShowPendingUpdateChineseButton.value = true
  }
}

/**
 * Javbus 详情页 元素顺序修改
 */
function javbusDetailElementsModifier() {
  // 调整 预览图的顺序

  const sampleWaterfall = $('#sample-waterfall')

  const torrentList = $('#TorrentList')

  // 将 sampleWaterfall 元素剪切并插入到 TorrentList 之前
  if (sampleWaterfall && torrentList) {
    sampleWaterfall.style.margin = '24px auto'

    torrentList.parentNode?.insertBefore(sampleWaterfall, torrentList)
  }

  // 移除  磁力連結投稿
  $('#mag-submit-show')?.remove()
}

onMounted(() => {
  delayRun(() => {
    getTorrentList()
    main()

    // Javbus 详情页元素顺序修改
    javbusDetailElementsModifier()
  })
})
</script>

<template>
  <!-- 挂载到右侧 -->
  <div
    class="sm-50 fixed left-2 top-60 w-30 lg:w-70 md:w-50"
  >
    <!-- 提示更新中文磁链按钮 -->
    <PendingUpdateChineseButton
      v-if="isShowPendingUpdateChineseButton"
      class="w-full"
    />

    <!-- emby播放按钮 -->
    <EmbyPlayButton
      v-if="isShowEmbyButton"
      :video-name="pageVideoName"
      :emby-search-name="pageVideoName"
    />

    <!-- emby已入库列表 -->
    <div
      v-if="embyCatalogedList.length"
      class="w-full rounded-2 bg-[#FF8400] p-2"
    >
      <EmbyCatalogedList
        v-for="(item, index) in embyCatalogedList"
        :key="index"
        :video="item"
      />
    </div>
  </div>

  <!-- 在线播放 -->
  <OnlinePlay
    v-if="isShowOnlinePlay"
    to="#OnlinePlay"
    :video-name="pageVideoName"
  />
  <!-- 自定义磁链列表 -->
  <TorrentList
    v-if="isShowTorrentList"
    to="#TorrentList"
    scroll-target=".video-panel"
    :torrent-list="torrentList"
  />
</template>

<style lang="scss" scoped>

</style>
