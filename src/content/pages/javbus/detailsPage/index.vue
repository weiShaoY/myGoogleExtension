<!------  2025-08-12---16:47---星期二  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { useFolderStore } from '@/stores'

import { getFileTagIconArray } from '@/utils'

const folderStore = useFolderStore()

/**
 *  页面视频名称
 */
const pageVideoName = ref<string>('')

/**
 *  是否视频存在中文磁链
 */
const isVideoHaveChineseTorrent = ref(false)

/**
 *  是否显示 提示更新中文磁链按钮
 */
const isShowPendingUpdateChineseButton = ref(false)

/**
 *  是否显示 emby按钮
 */
const isShowEmbyButton = ref(false)

/**
 *  emby已入库列表
 */
const embyCatalogedList = ref<FolderConfigType.File[]>([])

/**
 *  是否显示在线播放组件
 */
const isShowOnlinePlay = ref(false)

/**
 *  是否显示自定义磁链列表
 */
const isShowTorrentList = ref(false)

/**
 *  磁链列表
 */
const torrentList = ref<TorrentType[]>([])

/**
 * 获取详情页视频名称
 * @returns 视频标题文本
 */
function getPageVideoName(): string {
  const strongElements = document.querySelectorAll('.video-detail strong')

  if (strongElements.length > 0) {
    const titleText = strongElements[0].textContent
      ?.trim()
      .toLowerCase()
      .replace(/\s+/g, '')

    return titleText || ''
  }

  return ''
}

/**
 * 获取页面中的磁链列表
 */
/**
 * 获取种子列表
 */
function getTorrentList() {
  const magnetsContent = document.getElementById('magnets-content')

  // 使用 ! 简化非空判断
  if (!magnetsContent || magnetsContent.children.length === 0) {
    console.warn('未找到 magnetsContent 元素或其子元素为空')
    return
  }

  const items = Array.from(magnetsContent.querySelectorAll('.columns'))

  items.forEach((itemElement) => {
    // 类型断言，确保 item 是 HTMLElement 类型
    const item = itemElement as HTMLElement

    const url = (item.querySelector('.copy-to-clipboard') as HTMLElement)?.dataset?.clipboardText || '' // 类型断言

    const name = item.querySelector('.name')?.textContent?.trim() || ''

    const sizeText = item.querySelector('.meta')?.textContent?.trim() || ''

    // 使用更简洁的正则表达式匹配，忽略大小写
    const sizeMatch = sizeText.match(/(\d+(\.\d+)?)\s*(GB|MB)/i)

    let size = 0

    if (sizeMatch) {
      const value = Number.parseFloat(sizeMatch[1])

      const unit = sizeMatch[3]?.toUpperCase() // 获取单位并转换为大写

      // 使用三元运算符简化大小转换
      size = unit === 'MB' ? value / 1024 : value

      // 保留两位小数
      size = Math.round(size * 100) / 100
    }

    const time = item.querySelector('.time')?.textContent?.trim() || ''

    //  获取 tagArray 的方法，需要自己实现
    const tagArray = getFileTagIconArray(name)

    // 判断是否存在 中文磁链
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

  //  添加挂载点

  const targetElement = document.querySelector('.no-bottom')

  if (targetElement) {
    targetElement.insertAdjacentHTML('afterend', '<div id="TorrentList"></div>')
    targetElement.insertAdjacentHTML('afterend', '<div id="OnlinePlay"></div>')

    isShowOnlinePlay.value = true
    isShowTorrentList.value = true
  }
}

function main() {
  if (!folderStore.folderFileList.length) {
    return
  }

  // 获取视频名称 (小写，去除空格)
  pageVideoName.value = getPageVideoName()

  if (!pageVideoName.value) {
    return
  }

  // 当前视频名称已入库的视频列表
  const matchedVideoList = folderStore.folderFileList.filter(item =>

    item.cleanName.includes(pageVideoName.value),
  )

  /**
   *  emby中是否有中文磁链
   */
  const isEmbyHaveChineseTorrent = matchedVideoList.some(item => item.hasChineseSubtitles)

  const highlightElement = document.querySelector('.video-meta-panel')

  if (matchedVideoList.length) {
    highlightElement?.classList.add('is-highlight')

    embyCatalogedList.value.push(...matchedVideoList)

    isShowEmbyButton.value = true
  }

  // 如果当前视频有中文磁链可用并且 Emby 中已经存在的视频没有中文磁链，则添加提示更新中文磁链按钮
  if (
    isVideoHaveChineseTorrent.value
    && !isEmbyHaveChineseTorrent
    && matchedVideoList.length
  ) {
    isShowPendingUpdateChineseButton.value = true
  }
}

onMounted(() => {
  getTorrentList()

  main()
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
