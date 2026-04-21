<script lang="ts" setup>

const adultStore = useAdultStore()

/**
 * 表格数据（强类型）
 */
const tableData = computed<AdultType.VideoFile[]>(() => {
  return adultStore.embyFolder.folderAllDuplicateVideoFiles
})

/**
 * 点击路径
 */
function handleClickPath(row: AdultType.VideoFile) {
  window.open(row.path)
}
</script>

<template>
  <div
    class="box-border h-full flex items-center justify-center p-20"
  >
    <el-table
      :data="tableData"
      class="h-full w-full"
      size="large"
      stripe
    >
      <!-- 视频名称 -->
      <el-table-column
        label="视频名称"
        prop="originalName"
        sortable
      />

      <!-- 视频大小 -->
      <el-table-column
        label="视频大小"
        prop="size"
        width="120"
        sortable
      />

      <!-- 视频时长 -->
      <el-table-column
        label="视频时长"
        prop="duration"
        width="120"
        sortable
      />

      <!-- 分辨率 -->
      <el-table-column
        label="视频分辨率"
        prop="resolution"
        width="140"
        sortable
      />

      <!-- 标签 -->
      <el-table-column
        label="视频标签"
        width="160"
      >
        <template
          #default="{ row }: { row: AdultType.VideoFile }"
        >
          <div
            class="flex items-center gap-2"
          >
            <SvgIcon
              v-for="tag in row.tags"
              :key="tag"
              :icon="tag"
              :size="30"
            />
          </div>
        </template>
      </el-table-column>

      <!-- 播放 -->
      <el-table-column
        label="播放"
        width="260"
      >
        <template
          #default="{ row }: { row: AdultType.VideoFile }"
        >
          <div
            class="flex items-center gap-2"
          >
            <SitePlay
              site="javdb"
              :video-name="row.cleanName"
              :size="40"
              :icon-size="30"
            />

            <SitePlay
              site="javBus"
              :video-name="row.cleanName"
              :size="40"
              :icon-size="30"
            />

            <SitePlay
              site="missAv"
              :video-name="row.cleanName"
              :size="40"
              :icon-size="30"
            />

            <SitePlay
              site="emby"
              :video-name="row.cleanName"
              :size="40"
              :icon-size="30"
            />
          </div>
        </template>
      </el-table-column>

      <!-- 路径 -->
      <el-table-column
        label="视频路径"
        prop="path"
        sortable
        @click="handleClickPath"
      />

      <template
        #empty
      >

        <div
          class="flex flex-col items-center justify-center text-14"
        >

          <SvgIcon
            icon="empty"
            :size="200"
          />

          <div
            class="mt-3"
          >

            暂无重复视频

          </div>

        </div>

      </template>
    </el-table>
  </div>
</template>
