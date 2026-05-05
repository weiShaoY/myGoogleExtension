<!------  2026-04-21---00:41---星期二  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>

import JsonEditorVue from 'json-editor-vue'

const adultStore = useAdultStore()

const json = computed(() => adultStore.embyFolder)

const options = {
}

/** 转换 tags 数组为字符串 */
function processVideoData(file: any) {
  return {
    ...file,
    tags: file.tags.map((t: any) => t.label).join(', '),
  }
}

/** 表格数据（转换 tags 数组为字符串） */
const folderVideoFiles = computed(() => {
  return adultStore.embyFolder.folderVideoFiles.map(processVideoData)
})

const uniqueVideoFiles = computed(() => {
  return adultStore.embyFolder.folderAllDuplicateVideoFiles.map(processVideoData)
})

/** 表头映射配置 */
const headers = {
  baseName: '文件名',
  cleanName: '清洗后名称',
  extension: '扩展名',
  size: '大小',
  tags: '标签',
  hasChineseSubtitle: '中文字幕',
  id: 'ID',
  path: '完整路径',
}

/** 列配置 */
const columnConfig = {
  baseName: {
    title: '文件名',
    width: 30,
    formatter: (value: unknown) => (value ? String(value) : '未知'),
  },
  cleanName: {
    title: '清洗后名称',
    width: 30,
    formatter: (value: unknown) => (value ? String(value) : '未知'),
  },
  extension: {
    title: '扩展名',
    width: 10,
    formatter: (value: unknown) => (value ? String(value) : '未知'),
  },
  size: {
    title: '大小',
    width: 12,
    formatter: (value: unknown) => (value ? String(value) : '未知'),
  },
  tags: {
    title: '标签',
    width: 20,
    formatter: (value: unknown) => (value ? String(value) : ''),
  },
  hasChineseSubtitle: {
    title: '中文字幕',
    width: 10,
    formatter: (value: unknown) => (value ? '是' : ''),
  },
  id: {
    title: 'ID',
    width: 40,
    formatter: (value: unknown) => (value ? String(value) : '未知'),
  },
  path: {
    title: '完整路径',
    width: 50,
    formatter: (value: unknown) => (value ? String(value) : '未知'),
  },
}

/** 多工作表配置 */
const sheets = computed(() => {
  return [
    {
      name: '全部视频',
      data: folderVideoFiles.value,
      headers,
      columns: columnConfig,
    },
    {
      name: '中文字幕',
      data: folderVideoFiles.value.filter(file => file.hasChineseSubtitle),
      headers,
      columns: columnConfig,
    },
    {
      name: '重复视频',
      data: uniqueVideoFiles.value,
      headers,
      columns: columnConfig,
    },
  ]
})
</script>

<template>
  <div
    class="h-full flex flex-col"
  >
    <div
      class="flex items-center justify-end gap-4 p-4"
    >
      <ExcelExport
        :sheets="sheets"
        :filename="`emby-视频文件列表-[${adultStore.embyFolder.folderName}]`"
        type="success"
        auto-index
      />
    </div>

    <JsonEditorVue
      v-model="json"
      :options="options"
      class="overflow-auto p-3 !w-full !flex-1"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
