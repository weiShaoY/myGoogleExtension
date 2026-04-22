<!------------------------------------  图表组件  ------------------------------------------------->
<script setup lang="ts">
import type { EChartsOption } from 'echarts'

import type { CSSProperties } from 'vue'

import { registerMap } from 'echarts/core'

import VCharts from 'vue-echarts'

import { parseSize } from '@/utils/size'

type ChartPropsType = {

  /**
   * ECharts 配置
   */
  option: EChartsOption

  /**
   * 是否自动调整大小
   */
  isAutoResize?: boolean

  /**
   * 是否显示 loading
   */
  isLoading?: boolean

  /**
   * 宽度
   */
  width?: string | number

  /**
   * 高度
   */
  height?: string | number

  /**
   * 是否深色主题
   */
  isDark?: boolean
} & (
  | {

    /**
       * 地图数据
       */
    mapJson?: any

    /**
       * 地图名称
       */
    mapName: string
  }
  | {

    /**
     * 地图数据
     */
    mapJson?: null

    /**
     * 地图名称
     */
    mapName?: never
  }
)

const props = withDefaults(defineProps<ChartPropsType>(), {
  isAutoResize: true,
  width: '100%',
  height: '100%',
  isDark: false,
})

const emit = defineEmits<{
  (e: 'click', payload: any): void
}>()

/**
 * loading 配置
 */
const loadingOptions = {
  fontSize: 20,
  fontFamily: 'shouJinTi',
}

/**
 * 容器样式
 * 👉 width / height 统一走 parseSize
 */
const computedStyle = computed<CSSProperties>(() => ({
  width: parseSize(props.width),
  height: parseSize(props.height),
}))

/**
 * loading 状态
 */
const loading = computed(() => Boolean(props.isLoading))

/**
 * 地图注册（安全触发）
 */
watchEffect(() => {
  if (props.mapJson && props.mapName) {
    registerMap(props.mapName, props.mapJson)
    return
  }

  if (props.mapJson && !props.mapName) {
    window.$notification?.error?.('提供地图文件时需要同时提供地图名称')
  }
})
</script>

<template>
  <VCharts
    :theme="isDark ? 'dark' : ''"
    :option="option"
    :autoresize="isAutoResize"
    :style="computedStyle"
    :loading="loading"
    :loading-options="loadingOptions"
    :manual-update="false"
    @click="emit('click', $event)"
  />
</template>

<style scoped>
</style>
