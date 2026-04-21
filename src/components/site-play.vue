<!------  2026-04-21---14:35---星期二  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import type { CSSProperties } from 'vue'

import { embySearch } from '@/apis'

import { AdultConfig } from '@/configs'

type PropsType = {

  /**
   * 视频名称
   */
  videoName: string

  /**
   * 站点名称
   */
  site: string

  /** 图标的大小 */
  size?: string | number

  /** 图标大小 */
  iconSize?: string | number

  /** 额外的 CSS 类名 */
  class?: string | Record<string, boolean> | Array<string | Record<string, boolean>>

  /** 行内样式 */
  style?: CSSProperties
}

/**
 * 组件属性默认值
 */
const props = withDefaults(defineProps<PropsType>(), {
  size: 40,
  iconSize: 30,
  class: '!aspect-square !p-2',

})

/**
 * 计算 SVG 的行内样式
 */
const computedStyle = computed(() => ({
  verticalAlign: 'middle',
  width: props.size ? `${props.size}px` : '24px',
  height: props.size ? `${props.size}px` : '24px',
  ...props.style,
}))

// 根据传入的站点 在 AdultConfig 中查找对应的配置 转换为小写
const siteConfig = AdultConfig.siteList.find(item => item.name.toLowerCase() === props.site.toLowerCase())

/**
   *  识别为emby
   */
const isEmby = computed(() => props.site.toLowerCase() === 'emby')

/**
   *  播放
   */
function sitePlay() {
  if (siteConfig?.name) {
    const url = `https://${siteConfig?.hostname}${siteConfig?.searchUrl.replace('{{code}}', props.videoName)}`

    openLink(url)
  }
  else if (isEmby.value) {
    embySearch(props.videoName)
  }
}

</script>

<template>

  <el-button
    :class="props.class"
    :style="computedStyle"
    @click="sitePlay"
  >
    <SvgIcon
      v-if="siteConfig"
      :icon="siteConfig.icon"
      :size="props.iconSize || '24px'"
    />

    <SvgIcon
      v-else-if="isEmby"
      icon="adult-site-emby"
      :size="props.iconSize || '24px'"
    />
  </el-button>

</template>

<style lang="scss" scoped>

</style>
