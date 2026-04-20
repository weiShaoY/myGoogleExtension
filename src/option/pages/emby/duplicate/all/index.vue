<script lang="ts" setup>
const adultStore = useAdultStore()

/**
 * 首页
 */
</script>

<template>

  <div
    class="box-border h-full flex items-center justify-center p-20"
  >

    <el-scrollbar
      v-if="adultStore.embyFolder.folderAllDuplicateVideoFiles.length"
      always
      class="w-full"
      view-class="p-15 box-border"
    >
      <!-- 所有重复 AllDuplicate -->
      <AdultEmby
        v-for="(item, index) in adultStore.embyFolder
          .folderAllDuplicateVideoFiles"
        :key="index"
        :video-name="item.cleanName"
        :is-from-setting-dialog="true"
        class="mb-3 !h-15"
      />
    </el-scrollbar>

    <div
      v-else
      class="text-20"
    >
      暂无重复视频
    </div>

  </div>

</template>
