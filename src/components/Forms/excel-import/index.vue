<!-- 导入 Excel 文件 -->
<script setup lang="ts">
import type { UploadFile } from 'element-plus'

import * as XLSX from 'xlsx'

defineOptions({
  name: 'ExcelImport',
})

// 定义 emits
const emit = defineEmits<{
  'import-success': [data: Array<Record<string, unknown>>]
  'import-error': [error: Error]
}>()

/**
   * 导入 Excel 文件
   */
async function importExcel(file: File): Promise<Array<Record<string, unknown>>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result

        const workbook = XLSX.read(data, {
          type: 'array',
        })

        const firstSheetName = workbook.SheetNames[0]

        const worksheet = workbook.Sheets[firstSheetName]

        const results = XLSX.utils.sheet_to_json(worksheet)

        resolve(results as Array<Record<string, unknown>>)
      }
      catch (error) {
        reject(error)
      }
    }

    reader.onerror = error => reject(error)
    reader.readAsArrayBuffer(file)
  })
}

// 处理文件导入
async function handleFileChange(uploadFile: UploadFile) {
  try {
    if (!uploadFile.raw) {
      return
    }

    const results = await importExcel(uploadFile.raw)

    emit('import-success', results)
  }
  catch (error) {
    emit('import-error', error as Error)
  }
}
</script>

<template>
  <div
    class="inline-block"
  >
    <ElUpload
      :auto-upload="false"
      accept=".xlsx, .xls"
      :show-file-list="false"
      @change="handleFileChange"
    >
      <ElButton
        v-ripple
        type="primary"
      >
        <slot>
          导入 Excel
        </slot>
      </ElButton>
    </ElUpload>
  </div>
</template>
