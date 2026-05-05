<!------  2026-04-21---00:41---星期二  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import JsonEditorVue from 'json-editor-vue'

const adultStore = useAdultStore()

const json = computed(() => adultStore.embyFolder)

const options = {
}

/**
 * 表格数据（转换 tags 数组为字符串）
 */
const tableData = computed(() => {
  return adultStore.embyFolder.folderVideoFiles.map(file => ({
    ...file,
    tags: file.tags.map(t => t.label).join(', '),
  }))
})

/**
 * 表头映射配置
 */
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

/**
 * 列配置
 */
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
    formatter: (value: unknown) => {
    // 判断是不是数组
      if (Array.isArray(value)) {
      // 提取所有 label → 组成字符串数组
        return value.map(item => item.label || '')
          .filter(Boolean)
          .join(', ')
      }

      return value ? String(value) : ''
    },
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
    width: 40,
    formatter: (value: unknown) => (value ? String(value) : '未知'),
  },
}
</script>

<template>
  <div
    class="h-full flex flex-col"
  >
    <div
      class="flex items-center justify-end gap-4 p-4"
    >
      <excel-export
        :data="tableData"
        :filename="`emby-视频文件列表-[${adultStore.embyFolder.folderName}]`"
        sheet-name="视频列表"
        type="success"
        :headers="headers"
        auto-index
        :columns="columnConfig"
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
