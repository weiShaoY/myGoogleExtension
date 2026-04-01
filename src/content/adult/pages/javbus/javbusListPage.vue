<script setup lang="ts">
import { onMounted, ref } from 'vue'

const { cleanVideoName, createMatchResult } = useJavdbMatch()

/**
 * 文件夹存储
 */
const adultStore = useAdultStore()

/**
 * 页面上匹配到的视频结果列表
 */
const listPageMatchResults = ref<AdultType.ListPageMatchResultList>([])

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

    const targetElement = item

    const folderMatchedVideos = adultStore.getFolderMatchedVideoList(cleanName)

    if (folderMatchedVideos.length === 0) {
      return
    }

    // 添加样式类
    if (isElementExists(targetElement)) {
      targetElement.classList.add(cleanName)
      targetElement.classList.add('is-highlight')
    }

    // 检查是否有中文字幕标签
    const hasChineseTag = !!item.querySelector('.btn-warning')

    console.log('🚀 ~ file: javbusListPage.vue:45 ~ item:', item)

    console.log('🚀 ~ file: javbusListPage.vue:45 ~ hasChineseTag:', hasChineseTag)

    // 创建匹配结果项
    const matchResultItem = createMatchResult(
      cleanName,
      folderMatchedVideos,
      hasChineseTag,
    )

    listPageMatchResults.value.push(matchResultItem)
  })
}

onMounted(() => delayRun(main))
</script>

<template>
  <template
    v-for="matchResult in listPageMatchResults"
    :key="matchResult.cleanName"
  >
    <Teleport
      v-if="matchResult.folderMatchedVideos.length"
      :to="`.${matchResult.cleanName}`"
    >
      <!-- 事件处理包装器 -->
      <div
        class="teleport-wrapper"
        style="pointer-events: auto;"
        @click="preventEvent"
        @mousedown="preventEvent"
        @mouseup="preventEvent"
        @pointerdown="preventEvent"
        @pointerup="preventEvent"
      >
        <div
          class="h-auto w-full flex flex-col items-center border border-gray-200 rounded-lg bg-[rgb(255,255,255)] p-3 space-y-4"
        >
          <section
            class="w-full space-y-2"
          >
            <AdultInventory
              v-for="file in matchResult.folderMatchedVideos"
              :key="file.id"
              :file="file"
            />
          </section>

          <section
            class="grid grid-cols-2 h-15 w-full gap-2 [&>*:last-child:nth-child(1)]:col-span-2"
          >
            <AdultChinese
              v-if="matchResult.isShowUpdateChinese"
            />

            <AdultEmby
              :video-name="matchResult.cleanName"
            />

          </section>
        </div>

      </div>
    </Teleport>
  </template>
</template>

<style lang="scss" scoped></style>
