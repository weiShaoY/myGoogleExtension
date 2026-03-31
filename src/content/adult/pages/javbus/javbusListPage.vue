<script setup lang="ts">

const adultStore = useAdultStore()

const embyBtnList = ref<string[]>([])

const updateChineseBtnList = ref<string[]>([])

const addedToInventoryBtnList = ref<AdultType.VideoFile[]>([])

function main() {
  $$('#waterfall .movie-box').forEach((item) => {
    const name = item
      .getAttribute('href')
      ?.split('/')
      .pop() ?? ''

    const cleanName = cleanVideoName(name)

    if (!cleanName) {
      return
    }

    const box = item

    const matchedList = adultStore.matchVideos(cleanName)

    if (matchedList.length) {
      box?.classList.add('is-highlight')

      addClassAndPush(box, `emby_btn_${cleanName}`, embyBtnList.value, cleanName)

      const hasChineseTag = !!item.querySelector('.btn-warning')

      matchedList.forEach((video) => {
        addClassAndPush(
          box,
          `added_to_emby_btn_${video.baseName}`,
          addedToInventoryBtnList.value,
          video,
        )

        if (!video.hasChineseSubtitle && hasChineseTag) {
          addClassAndPush(
            box,
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
      :to="`.added_to_emby_btn_${item.cleanName}`"
    >
      <EmbyCatalogedList
        :video="item"
      />
    </Teleport>
  </template>
</template>

<style lang="scss" scoped></style>
