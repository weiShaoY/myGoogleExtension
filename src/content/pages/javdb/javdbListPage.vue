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

    /**
     *  目标元素
     */
    const boxElement = asHTMLElement(item.querySelector('.box'))

    /**
     *  匹配已入库视频
     */
    const matchedList = folderStore.matchVideos(cleanName)

    if (matchedList.length) {
      boxElement?.classList.add('.test')

      // @////////////

      boxElement?.classList.add('is-highlight')

      // 添加 Emby 打开按钮
      addClassAndPush(
        boxElement,
        `emby_btn_${cleanName}`,
        embyBtnList.value,
        cleanName,
      )

      const hasChineseTag = !!item.querySelector('.is-warning')

      matchedList.forEach((video) => {
        // 已入库按钮
        addClassAndPush(
          boxElement,
          `added_to_emby_btn_${video.nameWithTags}`,
          addedToInventoryBtnList.value,
          video,
        )

        // 需要更新中文
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

  <Teleport
    to=".test"
  >

    <div
      class=""
    >
      2
      2
      2
      2
      2

    </div>
  </Teleport>
</template>

<style lang="scss" scoped></style>
