<script lang="ts" setup>

const embyBtnList = ref<string[]>([])

const updateChineseBtnList = ref<string[]>([])

const addedToInventoryBtnList = ref<AdultType.VideoFile[]>([])

const adultStore = useAdultStore()

function main() {
  const fileList = adultStore.embyFolder.folderVideoFileList ?? []

  console.log('🚀 ~ file: index.vue:24 ~ fileList:', fileList)

  if (!fileList.length) {
    return
  }

  // 获取所有视频项
  $$('div.thumbnail.group').forEach((item) => {
    const linkEl = item.querySelector('a.text-secondary') as HTMLElement | null

    // 去除行首空格
    if (linkEl) {
      linkEl.textContent = (linkEl.textContent || '').trimStart()
    }

    // 获取视频名称（清洗）
    const rawName = linkEl?.textContent || ''

    console.log('🚀 ~ file: index.vue:40 ~ rawName:', rawName)

    const itemVideoName = rawName.trim().split(' ')[0]?.toLowerCase() || ''

    if (!itemVideoName) {
      return
    }

    // 类型安全转换
    const boxElement = asHTMLElement(item)

    // 匹配已入库视频
    const matchedVideoList = fileList.filter(sub =>
      sub.cleanName.includes(itemVideoName),
    )

    if (matchedVideoList.length) {
      boxElement?.classList.add('is-highlight')

      // 添加 Emby 打开按钮
      addClassAndPush(
        boxElement,
        `emby_btn_${itemVideoName}`,
        embyBtnList.value,
        itemVideoName,
      )

      // 判断页面是否有中文标记
      const hasChineseTag = Boolean(
        item.querySelector('span')?.textContent?.includes('中文字幕'),
      )

      console.log('🚀 ~ file: index.vue:61 ~ item:', item)

      matchedVideoList.forEach((video) => {
        // 已入库按钮
        addClassAndPush(
          boxElement,
          `added_to_emby_btn_${video.baseName}`,
          addedToInventoryBtnList.value,
          video,
        )

        // 需要更新中文
        if (!video.hasChineseSubtitle && hasChineseTag) {
          addClassAndPush(
            boxElement,
            `update_chinese_btn_${itemVideoName}`,
            updateChineseBtnList.value,
            itemVideoName,
          )
        }
      })
    }
  })
}

onMounted(() => delayRun(main))

</script>

<template>
  <!-- 在Emby打开按钮 -->
  <template
    v-for="videoName in embyBtnList"
    :key="videoName"
  >
    <Teleport
      :to="`.emby_btn_${videoName}`"
    >
      <EmbyPlayButton
        :video-name="videoName"
        :emby-search-name="videoName"
      />
    </Teleport>
  </template>

  <!-- 可更新中文磁链按钮 -->
  <template
    v-for="videoName in updateChineseBtnList"
    :key="videoName"
  >
    <Teleport
      :to="`.update_chinese_btn_${videoName}`"
    >
      <PendingUpdateChineseButton
        :radius="0"
      />
    </Teleport>
  </template>

  <!-- 已入库的视频 -->
  <template
    v-for="item in addedToInventoryBtnList"
    :key="item.originalName"
  >
    <Teleport
      :to="`.added_to_emby_btn_${item.baseName}`"
    >
      <EmbyCatalogedList
        :video="item"
      />
    </Teleport>
  </template>
</template>

<style lang="scss" scoped></style>
