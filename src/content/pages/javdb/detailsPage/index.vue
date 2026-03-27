<script lang="ts" setup>

const folderStore = useFolderStore()

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
const embyCatalogedList = ref<FolderConfigType.File[]>([])

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
  const el = $('.video-detail strong')

  return cleanVideoName(el?.textContent)
}

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
      name.toLowerCase().includes('-c')
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
  const name = getPageVideoName()

  if (!name) {
    return
  }

  pageVideoName.value = name

  const matchedList = folderStore.matchVideos(name)

  if (!matchedList.length) {
    return
  }

  const highlightElement = $('.video-meta-panel')

  highlightElement?.classList.add('is-highlight')

  embyCatalogedList.value = matchedList

  isShowEmbyButton.value = true

  const embyHasChinese = matchedList.some(item => item.hasChineseSubtitles)

  if (
    isVideoHaveChineseTorrent.value
    && !embyHasChinese
  ) {
    isShowPendingUpdateChineseButton.value = true
  }
}

onMounted(() => {
  getTorrentList()
  delayRun(() => {
    main()
  }, 800)
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
