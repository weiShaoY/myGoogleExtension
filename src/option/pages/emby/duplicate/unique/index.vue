<script lang="ts" setup>
const adultStore = useAdultStore()

/**
 * 表格数据（强类型）
 */
const tableData = computed<string[]>(() => {
  return adultStore.embyFolder.folderUniqueDuplicateVideoNames
})

/**
 * 点击文件名
 */
function handleClickCopyFileName(row: string) {
  copyToClipboard((row), {
    title: '视频文件名 已复制到剪切板',
    message: row,
  })
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
        label="视频文件名"
        sortable
      >

        <template
          #default="{ row }: { row: string }"
        >
          <el-link
            type="primary"
            @click="handleClickCopyFileName(row)"
          >
            {{ row }}
          </el-link>
        </template>
      </el-table-column>

      <el-table-column
        label="视频缩略图"
        prop="baseName"
        sortable
      >
        <template
          #default="{ row }: { row: string }"
        >
          <AdultThumbnail
            :video-name="row"
          />
        </template>
      </el-table-column>

      <!-- 播放 -->
      <el-table-column
        label="播放"
        width="260"
      >
        <template
          #default="{ row }: { row: string }"
        >
          <div
            class="flex items-center gap-2"
          >
            <SitePlay
              site="javdb"
              :video-name="row"
              :size="40"
              :icon-size="30"
            />

            <SitePlay
              site="javBus"
              :video-name="row"
              :size="40"
              :icon-size="30"
            />

            <SitePlay
              site="missAv"
              :video-name="row"
              :size="40"
              :icon-size="30"
            />

            <SitePlay
              site="emby"
              :video-name="row"
              :size="40"
              :icon-size="30"
            />
          </div>
        </template>
      </el-table-column>

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
