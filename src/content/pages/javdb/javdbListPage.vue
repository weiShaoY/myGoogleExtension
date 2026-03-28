<!------------------------------------    ------------------------------------------------->
<script setup lang="ts">

const embyBtnList = ref<string[]>([])

const updateChineseBtnList = ref<string[]>([])

const addedToInventoryBtnList = ref<FolderConfigType.File[]>([])

const folderStore = useFolderStore()

function main() {
  $$('.movie-list .item').forEach((item) => {
    const name = item.querySelector('strong')?.textContent

    const cleanName = cleanVideoName(name)

    if (!cleanName) {
      return
    }

    const boxElement = asHTMLElement(item.querySelector('.box'))

    const matchedList = folderStore.matchVideos(cleanName)

    if (matchedList.length) {
      boxElement?.classList.add('is-highlight')

      addClassAndPush(
        boxElement,
        `emby_btn_${cleanName}`,
        embyBtnList.value,
        cleanName,
      )

      const hasChineseTag = !!item.querySelector('.is-warning')

      matchedList.forEach((video) => {
        addClassAndPush(
          boxElement,
          `added_to_emby_btn_${video.nameWithTags}`,
          addedToInventoryBtnList.value,
          video,
        )

        if (!video.hasChineseSubtitles && hasChineseTag) {
          addClassAndPush(
            boxElement,
            `update_chinese_btn_${cleanName}`,
            updateChineseBtnList.value,
            cleanName,
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
        :emby-search-name="videoName"
        :video-name="videoName"
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
      :to="`.added_to_emby_btn_${item.nameWithTags}`"
    >
      <EmbyCatalogedList
        :video="item"
      />
    </Teleport>
  </template>
</template>

<style lang="scss" scoped></style>
