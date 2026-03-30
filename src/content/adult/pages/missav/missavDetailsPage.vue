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
 * 是否显示提示更新中文磁链按钮
 */
const isShowPendingUpdateChineseButton = ref<boolean>(false)

/**
 * 是否显示 emby 按钮
 */
const isShowEmbyButton = ref<boolean>(false)

/**
 * emby 已入库列表
 */
const embyCatalogedList = ref<AdultConfigType.VideoFile[]>([])

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
  const el = $('h1.text-base.lg\\:text-lg.text-nord6')

  const text = el?.textContent || ''

  return text.trim().split(' ')[0]?.toLowerCase() || ''
}

/**
 * 获取页面中的磁链列表
 */
function getTorrentList() {
  const table = $('div[x-show="currentTab === \'magnets\'"] table')

  if (!table) {
    console.warn('未找到磁力表格')
    return
  }

  const rows = table.querySelectorAll('tbody tr')

  rows.forEach((row) => {
    const cells = row.querySelectorAll('td')

    if (cells.length < 3) {
      return
    }

    const firstCell = cells[0]

    const link = firstCell.querySelector('a')

    const url = link?.href || ''

    const name = link?.textContent?.trim() || ''

    const sizeText = cells[1]?.textContent?.trim() || ''

    const time = cells[2]?.textContent?.trim() || ''

    // 解析大小
    let size = 0

    const sizeMatch = sizeText.match(/(\d+(\.\d+)?)\s*(GB|MB)/i)

    if (sizeMatch) {
      const val = Number.parseFloat(sizeMatch[1])

      const unit = sizeMatch[3]?.toUpperCase()

      size = unit === 'MB' ? val / 1024 : val
      size = Math.round(size * 100) / 100
    }

    const tagArray = getFileTagIconArray(name)

    let hasChineseSubtitle = false

    // 判断中文字幕
    cells[0].querySelectorAll('span').forEach((span) => {
      if (span.textContent?.trim() === '字幕') {
        hasChineseSubtitle = true
        if (!tagArray.includes('tag-ziMu')) {
          tagArray.push('tag-ziMu')
        }
      }
    })

    if (hasChineseSubtitle) {
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

  // 插入挂载点
  const targetElement = $(
    '.grid.grid-cols-2.md\\:grid-cols-3.xl\\:grid-cols-4.gap-5',
  )

  if (targetElement) {
    targetElement.insertAdjacentHTML('afterend', '<div id="TorrentList"></div>')
    targetElement.insertAdjacentHTML('afterend', '<div id="OnlinePlay"></div>')
    isShowTorrentList.value = true
    isShowOnlinePlay.value = true
  }
}

/**
 * 主逻辑
 */
function main() {
  const fileList = adultStore.embyFolder?.folderVideoFileList ?? []

  if (!fileList.length) {
    return
  }

  const name = getPageVideoName()

  if (!name) {
    return
  }

  pageVideoName.value = name

  // 匹配已入库视频
  const matchedVideoList = fileList.filter(item =>
    item.cleanName.includes(name),
  )

  if (!matchedVideoList.length) {
    return
  }

  // 高亮
  const highlightElement = $(
    '.relative.-mx-4.sm\\:m-0.-mt-6',
  )

  const parent = asHTMLElement(highlightElement?.parentNode as HTMLElement)

  parent?.classList.add('is-highlight')

  embyCatalogedList.value = matchedVideoList
  isShowEmbyButton.value = true

  // 判断中文
  const embyHasChinese = matchedVideoList.some(i => i.hasChineseSubtitle)

  // 页面上有中文磁链但你Emby库里没有中文
  if (
    isVideoHaveChineseTorrent.value && !embyHasChinese
  ) {
    isShowPendingUpdateChineseButton.value = true
  }
}

onMounted(() => {
  getTorrentList()
  delayRun(main)
})
</script>

<template>
  <!-- 右侧悬浮 -->
  <div
    class="sm-50 fixed left-2 top-60 w-30 lg:w-70 md:w-50"
  >
    <EmbyPlayButton
      v-if="isShowEmbyButton"
      :video-name="pageVideoName"
      :emby-search-name="pageVideoName"
    />

    <PendingUpdateChineseButton
      v-if="isShowPendingUpdateChineseButton"
      class="w-full"
    />

    <div
      v-if="embyCatalogedList.length"
      class="w-full rounded-2 bg-[#FF8400] p-2"
    >
      <EmbyCatalogedList
        v-for="(item, idx) in embyCatalogedList"
        :key="idx"
        :video="item"
      />
    </div>
  </div>

  <OnlinePlay
    v-if="isShowOnlinePlay"
    to="#OnlinePlay"
    :video-name="pageVideoName"
  />

  <TorrentList
    v-if="isShowTorrentList"
    to="#TorrentList"
    scroll-target=".video-panel"
    :torrent-list="torrentList"
  />
</template>

<style lang="scss" scoped></style>
