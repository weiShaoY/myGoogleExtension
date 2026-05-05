<!-- 导出 Excel 文件 -->
<script setup lang="ts">
import type { ButtonType } from 'element-plus'

import { useThrottleFn } from '@vueuse/core'

import FileSaver from 'file-saver'

import {
  computed,
  nextTick,
  ref,
} from 'vue'

import * as XLSX from 'xlsx'

defineOptions({
  name: 'ArtExcelExport',
})

const props = withDefaults(defineProps<ExportOptions>(), {
  filename: () => `export_${new Date()
    .toISOString()
    .slice(0, 10)}`,
  sheetName: 'Sheet1',
  type: 'primary',
  size: 'default',
  disabled: false,
  buttonText: '导出 Excel',
  loadingText: '导出中...',
  autoIndex: false,
  indexColumnTitle: '序号',
  columns: () => ({
  }),
  headers: () => ({
  }),
  maxRows: 100000,
  showSuccessMessage: true,
  showErrorMessage: true,
  workbookOptions: () => ({
  }),
})

const emit = defineEmits<{
  'before-export': [data: ExportData[]]
  'export-success': [filename: string, rowCount: number]
  'export-error': [error: ExportError]
  'export-progress': [progress: number]
}>()

/** 导出数据类型 */
type ExportValue = string | number | boolean | null | undefined | Date

type ExportData = {
  [key: string]: ExportValue
}

/** 列配置 */
type ColumnConfig = {

  /** 列标题 */
  title: string

  /** 列宽度 */
  width?: number

  /** 数据格式化函数 */
  formatter?: (value: ExportValue, row: ExportData, index: number) => string
}

/** 单个工作表配置 */
type SheetConfig = {

  /** 工作表名称 */
  name: string

  /** 数据源 */
  data: ExportData[]

  /** 列配置映射 */
  columns?: Record<string, ColumnConfig>

  /** 表头映射（简化版本） */
  headers?: Record<string, string>
}

/** 导出配置选项 */
type ExportOptions = {

  /** 数据源（单工作表模式） */
  data?: ExportData[]

  /** 工作表配置（多工作表模式，优先级高于 data） */
  sheets?: SheetConfig[]

  /** 文件名（不含扩展名） */
  filename?: string

  /** 工作表名称（单工作表模式） */
  sheetName?: string

  /** 按钮类型 */
  type?: ButtonType

  /** 按钮尺寸 */
  size?: 'large' | 'default' | 'small'

  /** 是否禁用 */
  disabled?: boolean

  /** 按钮文本 */
  buttonText?: string

  /** 加载中文本 */
  loadingText?: string

  /** 是否自动添加序号列 */
  autoIndex?: boolean

  /** 序号列标题 */
  indexColumnTitle?: string

  /** 列配置映射（单工作表模式） */
  columns?: Record<string, ColumnConfig>

  /** 表头映射（简化版本，向后兼容，单工作表模式） */
  headers?: Record<string, string>

  /** 最大导出行数 */
  maxRows?: number

  /** 是否显示成功消息 */
  showSuccessMessage?: boolean

  /** 是否显示错误消息 */
  showErrorMessage?: boolean

  /** 工作簿配置 */
  workbookOptions?: {

    /** 创建者 */
    creator?: string

    /** 最后修改者 */
    lastModifiedBy?: string

    /** 创建时间 */
    created?: Date

    /** 修改时间 */
    modified?: Date
  }
}

/** 导出错误类型 */
class ExportError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any,
  ) {
    super(message)
    this.name = 'ExportError'
  }
}

const isExporting = ref(false)

/** 验证导出数据 */
function validateData(data: ExportData[]): void {
  if (!Array.isArray(data)) {
    throw new ExportError('数据必须是数组格式', 'INVALID_DATA_TYPE')
  }

  if (data.length === 0) {
    throw new ExportError('没有可导出的数据', 'NO_DATA')
  }

  if (data.length > props.maxRows) {
    throw new ExportError(`数据行数超过限制（${props.maxRows}行）`, 'EXCEED_MAX_ROWS', {
      currentRows: data.length,
      maxRows: props.maxRows,
    })
  }
}

/** 是否有数据可导出 */
const hasData = computed(() => {
  // 多工作表模式
  if (props.sheets && props.sheets.length > 0) {
    return props.sheets.some(sheet => Array.isArray(sheet.data) && sheet.data.length > 0)
  }

  // 单工作表模式（向后兼容）
  return Array.isArray(props.data) && props.data.length > 0
})

/** 格式化单元格值 */
function formatCellValue(
  value: ExportValue,
  key: string,
  row: ExportData,
  index: number,
  columns?: Record<string, ColumnConfig>,
): string {
  // 使用传入的列配置或 props 的列配置
  const column = columns?.[key] || props.columns[key]

  if (column?.formatter) {
    return column.formatter(value, row, index)
  }

  // 处理特殊值
  if (value === null || value === undefined) {
    return ''
  }

  if (value instanceof Date) {
    return value.toLocaleDateString('zh-CN')
  }

  if (typeof value === 'boolean') {
    return value ? '是' : '否'
  }

  return String(value)
}

/** 处理数据 */
function processData(
  data: ExportData[],
  options?: {
    columns?: Record<string, ColumnConfig>
    headers?: Record<string, string>
    autoIndex?: boolean
    indexColumnTitle?: string
  },
): Record<string, string>[] {
  const {
    columns = props.columns,
    headers = props.headers,
    autoIndex = props.autoIndex,
    indexColumnTitle = props.indexColumnTitle,
  } = options || {
  }

  // 获取列顺序：优先使用 columns 的键顺序，其次使用 headers 的键顺序
  const getColumnOrder = (): string[] => {
    if (Object.keys(columns).length > 0) {
      return Object.keys(columns)
    }

    if (Object.keys(headers).length > 0) {
      return Object.keys(headers)
    }

    // 如果没有配置，使用第一个数据项的键顺序
    if (data.length > 0) {
      return Object.keys(data[0])
    }

    return []
  }

  const columnOrder = getColumnOrder()

  const processedData = data.map((item, index) => {
    const processedItem: Record<string, string> = {
    }

    // 添加序号列（放在最前面）
    if (autoIndex) {
      processedItem[indexColumnTitle] = String(index + 1)
    }

    // 按照配置的列顺序处理数据列
    columnOrder.forEach((key) => {
      const value = item[key]

      if (value === undefined) {
        return
      }

      // 获取列标题
      let columnTitle = key

      if (columns[key]?.title) {
        columnTitle = columns[key].title
      }
      else if (headers[key]) {
        columnTitle = headers[key]
      }

      // 格式化值
      processedItem[columnTitle] = formatCellValue(value, key, item, index, columns)
    })

    return processedItem
  })

  return processedData
}

/** 计算列宽度 */
function calculateColumnWidths(
  data: Record<string, string>[],
  options?: {
    columns?: Record<string, ColumnConfig>
  },
): XLSX.ColInfo[] {
  if (data.length === 0) {
    return []
  }

  const { columns = props.columns } = options || {
  }

  const sampleSize = Math.min(data.length, 100) // 只取前100行计算列宽

  const dataColumns = Object.keys(data[0])

  return dataColumns.map((column) => {
    // 使用配置的列宽度
    const configWidth = Object.values(columns).find(col => col.title === column)?.width

    if (configWidth) {
      return {
        wch: configWidth,
      }
    }

    // 自动计算列宽度
    const maxLength = Math.max(
      column.length, // 标题长度
      ...data.slice(0, sampleSize).map(row => String(row[column] || '').length),
    )

    // 限制最小和最大宽度
    const width = Math.min(Math.max(maxLength + 2, 8), 50)

    return {
      wch: width,
    }
  })
}

/** 导出到 Excel */
async function exportToExcel(): Promise<void> {
  try {
    emit('export-progress', 10)

    // 创建工作簿
    const workbook = XLSX.utils.book_new()

    // 设置工作簿属性
    if (props.workbookOptions) {
      workbook.Props = {
        Title: props.filename,
        Subject: '数据导出',
        Author: props.workbookOptions.creator || 'Art Design Pro',
        Manager: props.workbookOptions.lastModifiedBy || '',
        Company: '系统导出',
        Category: '数据',
        Keywords: 'excel,export,data',
        Comments: '由系统自动生成',
        CreatedDate: props.workbookOptions.created || new Date(),
        ModifiedDate: props.workbookOptions.modified || new Date(),
      }
    }

    emit('export-progress', 20)

    // 判断是多工作表模式还是单工作表模式
    if (props.sheets && props.sheets.length > 0) {
      // 多工作表模式
      const progressStep = 70 / props.sheets.length

      for (let i = 0; i < props.sheets.length; i++) {
        const sheet = props.sheets[i]

        const processedData = processData(sheet.data, {
          columns: sheet.columns,
          headers: sheet.headers,
          autoIndex: props.autoIndex,
          indexColumnTitle: props.indexColumnTitle,
        })

        const worksheet = XLSX.utils.json_to_sheet(processedData)

        worksheet['!cols'] = calculateColumnWidths(processedData, {
          columns: sheet.columns,
        })

        XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name)
        emit('export-progress', 20 + (i + 1) * progressStep)
      }
    }
    else if (props.data) {
      // 单工作表模式（向后兼容）
      const processedData = processData(props.data)

      const worksheet = XLSX.utils.json_to_sheet(processedData)

      worksheet['!cols'] = calculateColumnWidths(processedData)
      XLSX.utils.book_append_sheet(workbook, worksheet, props.sheetName)
      emit('export-progress', 90)
    }
    else {
      throw new ExportError('没有可导出的数据', 'NO_DATA')
    }

    emit('export-progress', 90)

    // 生成 Excel 文件
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
      compression: true,
    })

    // 创建 Blob 并下载
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    emit('export-progress', 95)

    // 使用时间戳确保文件名唯一
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, '-')

    const finalFilename = `${props.filename}_${timestamp}.xlsx`

    FileSaver.saveAs(blob, finalFilename)

    emit('export-progress', 100)

    // 等待下载开始
    await nextTick()

    return Promise.resolve()
  }
  catch (error) {
    throw new ExportError(`Excel 导出失败: ${(error as Error).message}`, 'EXPORT_FAILED', error)
  }
}

/** 处理导出 */
const handleExport = useThrottleFn(async () => {
  if (isExporting.value) {
    return
  }

  isExporting.value = true

  try {
    // 判断是多工作表模式还是单工作表模式
    if (props.sheets && props.sheets.length > 0) {
      // 多工作表模式：验证所有工作表数据
      for (const sheet of props.sheets) {
        validateData(sheet.data)
      }

      // 触发导出前事件
      const allData = props.sheets.flatMap(sheet => sheet.data)

      emit('before-export', allData)

      // 执行导出
      await exportToExcel()

      // 触发成功事件
      const totalCount = props.sheets.reduce((sum, sheet) => sum + sheet.data.length, 0)

      emit('export-success', props.filename, totalCount)

      // 显示成功消息
      if (props.showSuccessMessage) {
        window.$message.success({
          message: `成功导出 ${totalCount} 条数据（${props.sheets.length} 个工作表）`,
          duration: 3000,
        })
      }
    }
    else if (props.data) {
      // 单工作表模式（向后兼容）
      validateData(props.data)
      emit('before-export', props.data)
      await exportToExcel()
      emit('export-success', props.filename, props.data.length)

      if (props.showSuccessMessage) {
        window.$message.success({
          message: `成功导出 ${props.data.length} 条数据`,
          duration: 3000,
        })
      }
    }
    else {
      throw new ExportError('没有可导出的数据', 'NO_DATA')
    }
  }
  catch (error) {
    const exportError
      = error instanceof ExportError
        ? error
        : new ExportError(`导出失败: ${(error as Error).message}`, 'UNKNOWN_ERROR', error)

    // 触发错误事件
    emit('export-error', exportError)

    // 显示错误消息
    if (props.showErrorMessage) {
      window.$message.error(exportError.message)
    }

    console.error('Excel 导出错误:', exportError)
  }
  finally {
    isExporting.value = false
    emit('export-progress', 0)
  }
}, 1000)

// 暴露方法供父组件调用
defineExpose({
  exportData: handleExport,
  isExporting: readonly(isExporting),
  hasData,
})
</script>

<template>
  <ElButton
    v-ripple
    :type="type"
    :size="size"
    :loading="isExporting"
    :disabled="disabled || !hasData"
    @click="handleExport"
  >
    <template
      #loading
    >
      <IconLoading />

      {{ loadingText }}
    </template>

    <slot>
      {{ buttonText }}
    </slot>
  </ElButton>
</template>

<style scoped>

</style>
