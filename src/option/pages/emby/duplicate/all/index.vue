<script lang="ts" setup>

const adultStore = useAdultStore()

/**
 * 表格数据（强类型）
 */
const tableData = computed<AdultType.VideoFile[]>(() => {
  return adultStore.embyFolder.folderAllDuplicateVideoFiles
})

/**
 * 点击文件名
 */
function handleClickCopyFileName(row: AdultType.VideoFile) {
  copyToClipboard((row.baseName), {
    title: '文件名 已复制到剪切板',
    message: row.baseName,
  })
}

/**
 * 点击路径
 */
function handleClickCopyPath(row: AdultType.VideoFile) {
  const fullDirPath = `${AdultConfig.folder.dirPath}${row.path}`

  copyToClipboard((fullDirPath), {
    title: '视频文件名 已复制到剪切板',
    message: fullDirPath,
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
        prop="baseName"
        sortable
      >
        <template
          #default="{ row }: { row: AdultType.VideoFile }"
        >
          <el-link
            type="primary"
            @click="handleClickCopyFileName(row)"
          >
            {{ row.baseName }}
          </el-link>
        </template>
      </el-table-column>

      <el-table-column
        label="视频缩略图"
        prop="baseName"
        sortable
      >
        <template
          #default="{ row }: { row: AdultType.VideoFile }"
        >
          <AdultThumbnail
            :video-name="row.cleanName"
          />
        </template>
      </el-table-column>

      <!-- 视频大小 -->
      <el-table-column
        label="视频大小"
        prop="size"
        width="120"
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
            <SitePlayButton
              site="javdb"
              :video-name="row.cleanName"
              :size="40"
              :icon-size="30"
            />

            <SitePlayButton
              site="javBus"
              :video-name="row.cleanName"
              :size="40"
              :icon-size="30"
            />

            <SitePlayButton
              site="missAv"
              :video-name="row.cleanName"
              :size="40"
              :icon-size="30"
            />

            <SitePlayButton
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
      >
        <template
          #default="{ row }: { row: AdultType.VideoFile }"
        >
          <el-link
            type="primary"
            @click="handleClickCopyPath(row)"
          >
            {{ row.path }}
          </el-link>
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
