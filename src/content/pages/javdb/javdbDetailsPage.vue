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
 * 单个视频匹配结果项接口
 */
type FileMatchItemType = {

  /** 清理后的文件名（用于标识） */
  cleanName: string

  /** 本地匹配到的视频文件数组 */
  localMatchedFileList: FolderConfigType.File[]

  /** 是否显示更新中文字幕按钮 */
  isShowUpdateChinese: boolean

}

/**
   * 详情页
   */
const detailsPageMatchResult = ref<FileMatchItemType>({
  cleanName: '',
  localMatchedFileList: [],
  isShowUpdateChinese: false,
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

  const localMatchedFileList = folderStore.matchVideos(cleanName)

  detailsPageMatchResult.value.localMatchedFileList = localMatchedFileList

  if (localMatchedFileList.length === 0) {
    return
  }

  const highlightElement = $('.video-meta-panel')

  highlightElement?.classList.add('is-highlight')

  const needsChineseUpdate = localMatchedFileList.some(
    file => !file.hasChineseSubtitles && isVideoHaveChineseTorrent.value,
  )

  detailsPageMatchResult.value.isShowUpdateChinese = needsChineseUpdate
}

onMounted(() => {
  getTorrentList()
  delayRun(main)
})
</script>

<template>

  <!-- 在线播放 -->
  <OnlinePlay
    v-if="isShowOnlinePlay"
    to="#OnlinePlay"
    :video-name="detailsPageMatchResult.cleanName"
  />
  <!-- 自定义磁链列表 -->
  <TorrentList
    v-if="isShowTorrentList"
    to="#TorrentList"
    scroll-target=".video-panel"
    :torrent-list="torrentList"
  />

  <!-- 到右侧 -->
  <div
    v-if="detailsPageMatchResult.localMatchedFileList.length > 0 "
    class="fixed left-2 top-60 !w-70"
  >
    <div
      class="grid grid-cols-2 grid-rows-2 w-full gap-2 text-white font-bold"
    >
      <AdultInventory
        v-for="file in detailsPageMatchResult.localMatchedFileList"
        :key="file.id"
        :file="file"
      />

      <AdultChinese
        v-if="detailsPageMatchResult.isShowUpdateChinese"
      />

      <AdultEmby
        v-model:clean-name="detailsPageMatchResult.cleanName"
      />
    </div>

  </div>
</template>

<style lang="scss" scoped>

</style>
