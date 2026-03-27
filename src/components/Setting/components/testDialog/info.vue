<!------  2026-03-27---01:40---星期五  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>

const folderStore = useFolderStore()
</script>

<template>
  <el-timeline
    mode="alternate-reverse"
    class="!w-full"
  >
    <el-timeline-item>
      <div
        class="flex items-center justify-end"
      >
        <span>
          总共
        </span>

        <span
          class="m-x-2 text-6 color-primary font-bold"
        >
          {{ folderStore.embyFolder.folderFileList.length }}
        </span>

        <span>
          部
        </span>

      </div>

    </el-timeline-item>

    <el-timeline-item>
      <div
        class="flex items-center"
      >
        <span>
          文件夹
        </span>

        <span
          class="m-x-2 text-6 color-primary font-bold"
        >
          {{ folderStore.embyFolder.folderName }}
        </span>

      </div>

    </el-timeline-item>

    <el-timeline-item>
      <div
        class="flex items-center justify-end"
      >
        <span>
          距上次扫描
        </span>

        <span
          class="m-x-2 text-6 color-primary font-bold"
        >
          {{ getFolderReadTimeoutText }}
        </span>
      </div>
    </el-timeline-item>

    <el-timeline-item>
      <div
        class="flex items-center"
      >
        <span>
          最后扫描时间
        </span>

        <span
          class="m-x-2 text-6 color-primary font-bold"
        >
          {{ formatTimestampToChineseDate(folderStore.embyFolder.folderReadTime) }}        </span>

      </div>
    </el-timeline-item>

    <el-timeline-item>
      <div
        class="flex items-center justify-end"
      >
        <span>
          已重复
        </span>

        <span
          class="m-x-2 text-6 color-primary font-bold"
        >
          {{ folderStore.embyFolder.folderDuplicateNameFileList.length }}
        </span>

        <span>
          部
        </span>
      </div>
    </el-timeline-item>

    <el-timeline-item>
      <div
        class="flex items-center"
      >
        <span>
          去重后
        </span>

        <span
          class="m-x-2 text-6 color-primary font-bold"
        >
          {{ folderStore.embyFolder.folderUniqueFileNameFileList.length }}
        </span>

        <span>
          部
        </span>
      </div>
    </el-timeline-item>
  </el-timeline>
</template>

<style lang="scss" scoped>

</style>
