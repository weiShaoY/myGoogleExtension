<script lang="ts" setup>

import { onMounted, ref } from 'vue'

import { useJavdbMatch } from '@/composables/useJavdbMatch'

/**
 * 文件夹存储
 */
const adultStore = useAdultStore()

/**
 * 页面上匹配到的视频结果列表
 */
const listPageMatchResults = ref<AdultType.ListPageMatchResultList>([])

/**
 * 导入共享逻辑
 */
const { cleanVideoName, createMatchResult } = useJavdbMatch()

function main() {
  // 获取所有视频项
  $$('div.thumbnail.group').forEach((item) => {
    const videoName = $(item, '.text-secondary.group-hover\\:text-primary')?.textContent.trim().split(' ')[0] ?? ''

    const cleanName = cleanVideoName(videoName)

    const folderMatchedVideos = adultStore.getFolderMatchedVideoList(cleanName)

    if (folderMatchedVideos.length === 0) {
      return
    }

    const teleportTarget = `${cleanName}_${getRandomNumber()}`

    const targetElement = item

    // 添加样式类
    if (isElementExists(targetElement)) {
      targetElement.classList.add('is-highlight')
      targetElement.classList.add(teleportTarget)
    }

    // 检查是否有中文字幕标签
    const hasChineseTag = !!$<HTMLAnchorElement>(item, 'a.text-secondary')?.href?.includes('chinese-subtitle')

    // 创建匹配结果项
    const matchResultItem = createMatchResult(
      cleanName,
      folderMatchedVideos,
      hasChineseTag,
      teleportTarget,
    )

    listPageMatchResults.value.push(matchResultItem)
    console.log('🚀 ~ file: missavListPage.vue:60 ~ listPageMatchResults.value:', listPageMatchResults.value)
  })
}

onMounted(() => delayRun(main))

</script>

<template>

  <template
    v-for="matchResult in listPageMatchResults"
    :key="matchResult.teleportTarget"
  >
    <Teleport
      v-if="matchResult.folderMatchedVideos.length "
      :to="`.${matchResult.teleportTarget}`"
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
          class="h-auto w-full flex flex-col items-center border border-gray-200 rounded-lg bg-white p-3 space-y-4"
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

<style lang="scss" scoped>
</style>
