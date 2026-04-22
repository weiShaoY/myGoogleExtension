<!------  2026-04-21---14:35---星期二 ------>
<!------------------------------------ ----------------------------------------->

<script setup lang="ts">
import type { CSSProperties } from 'vue'

import { embySearch } from '@/apis'

import { AdultConfig } from '@/configs'

import { parseSize, subtractSize } from '@/utils/size'

const props = withDefaults(defineProps<Props>(), {
  size: 40,
  class: '!aspect-square !p-2',
})

/**
 * 图标默认偏移量
 * 👉 iconSize 未传时使用 size - 5
 */
const ICON_SIZE_OFFSET = 5

type Props = {

  /**
   * 视频名称
   */
  videoName: string

  /**
   * 站点名称
   */
  site: string

  /**
   * 容器尺寸
   */
  size?: string | number

  /**
   * 图标尺寸（不传默认 size - 5）
   */
  iconSize?: string | number

  /**
   * 容器 class
   */
  class?: string | Record<string, boolean> | Array<string | Record<string, boolean>>

  /**
   * 图标 class
   */
  iconClass?: string | Record<string, boolean> | Array<string | Record<string, boolean>>

  /**
   * 行内样式
   */
  style?: CSSProperties
}

/**
 * class 处理工具
 */
function stringifyClass(
  input?: string | Record<string, boolean> | Array<string | Record<string, boolean>>,
): string {
  if (!input) {
    return ''
  }

  if (typeof input === 'string') {
    return input
  }

  if (Array.isArray(input)) {
    return input.map(stringifyClass)
      .filter(Boolean)
      .join(' ')
  }

  return Object.entries(input)
    .filter(([_, v]) => v)
    .map(([k]) => k)
    .join(' ')
}

/**
 * 容器尺寸
 */
const computedSize = computed(() => parseSize(props.size))

/**
 * 图标尺寸
 */
const computedIconSize = computed(() => {
  return props.iconSize !== undefined
    ? parseSize(props.iconSize)
    : subtractSize(props.size, ICON_SIZE_OFFSET)
})

/**
 * 容器样式
 */
const computedStyle = computed<CSSProperties>(() => ({
  verticalAlign: 'middle',
  width: computedSize.value,
  height: computedSize.value,
  ...props.style,
}))

/**
 * 站点 key
 */
const siteKey = computed(() => props.site.toLowerCase())

/**
 * 站点配置
 */
const siteConfig = computed(() =>
  AdultConfig.siteList.find(
    item => item.name.toLowerCase() === siteKey.value,
  ),
)

/**
 * 是否 emby
 */
const isEmby = computed(() => siteKey.value === 'emby')

/**
 * 打开站点
 */
function sitePlay() {
  const config = siteConfig.value

  if (config?.name) {
    const url = `https://${config.hostname}${config.searchUrl.replace(
      '{{code}}',
      props.videoName,
    )}`

    openLink(url)
    return
  }

  if (isEmby.value) {
    embySearch(props.videoName)
  }
}
</script>

<template>
  <el-button
    :class="stringifyClass(props.class)"
    :style="computedStyle"
    @click="sitePlay"
  >
    <SvgIcon
      v-if="siteConfig"
      :icon="siteConfig.icon"
      :size="computedIconSize"
      :class="stringifyClass(props.iconClass)"
    />

    <SvgIcon
      v-else-if="isEmby"
      icon="adult-site-emby"
      :size="computedIconSize"
      :class="stringifyClass(props.iconClass)"
    />
  </el-button>
</template>

<style scoped lang="scss">
</style>
