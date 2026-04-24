<script setup lang="ts">
defineProps<{

  /**
   * 视频列表
   */
  list: AdultType.ListPageMatchResultList
}>()

/**
 * 阻止事件
 */
function preventEvent(e: Event) {
  e.stopPropagation()
  e.preventDefault()
}
</script>

<template>
  <template
    v-for="item in list"
    :key="item.teleportTarget"
  >
    <Teleport
      :to="`.${item.teleportTarget}`"
    >
      <div
        class="teleport-wrapper"
        style="pointer-events: auto"
        @click="preventEvent"
        @mousedown="preventEvent"
        @mouseup="preventEvent"
        @pointerdown="preventEvent"
        @pointerup="preventEvent"
      >
        <!-- 卡片主体（完全固定，不用 slot） -->
        <div
          class="h-auto w-full flex flex-col items-center border border-gray-200 rounded-lg bg-white p-3 space-y-4"
        >
          <!-- 操作区 -->
          <div
            class="w-full flex items-center justify-start gap-2"
          >
            <SitePlayButton
              :video-name="item.cleanName"
              site="javdb"
              :size="40"
            />

            <SitePlayButton
              :video-name="item.cleanName"
              site="javBus"
              :size="40"
            />

            <SitePlayButton
              :video-name="item.cleanName"
              site="missAV"
              :size="40"
            />

            <SitePlayButton
              v-if="item.folderMatchedVideos.length"
              :video-name="item.cleanName"
              site="emby"
              :size="40"
            />

            <AdultThumbnail
              :video-name="item.cleanName"
              :size="40"
            />
          </div>

          <!-- 文件信息 -->
          <template
            v-if="item.folderMatchedVideos.length"
          >
            <AdultChinese
              v-if="item.isShowUpdateChinese"
            />

            <AdultInventory
              v-for="file in item.folderMatchedVideos"
              :key="file.id"
              :file="file"
            />
          </template>
        </div>
      </div>
    </Teleport>
  </template>
</template>

<style scoped>
.teleport-wrapper {
  pointer-events: auto;
}
</style>
