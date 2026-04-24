<script setup lang="ts">
defineProps<{

  /**
   * 视频详情页匹配结果
   */
  detailsPageMatchResult: AdultType.DetailsPageMatchResult

  /**
    * 磁链列表
    */
  torrentList: AdultType.TorrentItem[]
}>()

</script>

<template>
  <!-- 侧边栏 -->
  <div
    class="fixed left-2 top-60 box-border !w-90"
  >
    <div
      class="h-auto w-full flex flex-col items-center border border-gray-200 rounded-lg bg-white p-3 space-y-4"
    >
      <div
        class="w-full flex items-center justify-start gap-2"
      >

        <SitePlayButton
          :video-name="detailsPageMatchResult.cleanName"
          site="javdb"
          :size="60"
        />

        <SitePlayButton
          :video-name="detailsPageMatchResult.cleanName"
          site="javBus"
          :size="60"
        />

        <SitePlayButton
          :video-name="detailsPageMatchResult.cleanName"
          site="missAV"
          :size="60"
        />

        <SitePlayButton
          v-if="detailsPageMatchResult.folderMatchedVideos.length"
          :video-name="detailsPageMatchResult.cleanName"
          site="emby"
          :size="60"
        />

        <AdultThumbnail
          :video-name="detailsPageMatchResult.cleanName"
          :size="60"
        />
      </div>

      <AdultChinese
        v-if="detailsPageMatchResult.isShowUpdateChinese"
      />

      <AdultInventory
        v-for="file in detailsPageMatchResult.folderMatchedVideos"
        :key="file.id"
        :file="file"
      />
    </div>
  </div>

  <!-- 自定义磁链列表 -->
  <AdultTorrent
    v-if="torrentList.length"
    to="#TorrentList"
    :torrent-list="torrentList"
  />
</template>

<style scoped>
.teleport-wrapper {
  pointer-events: auto;
}
</style>
