<!------  2026-04-21---14:35---星期二 ------>
<!------------------------------------ ----------------------------------------->

<script setup lang="ts">
import type { CSSProperties } from 'vue'

import { embySearch } from '@/apis'

import { AdultConfig } from '@/configs'

const props = withDefaults(defineProps<Props>(), {
  size: 40,
  class: '!aspect-square !p-2',
})

/**
 * 组件属性类型
 */
type Props = {

  /** 视频名称 */
  videoName: string

  /** 站点名称 */
  site: string

  /** 容器尺寸 */
  size?: string | number

  /** 图标尺寸（不传默认 size - 5） */
  iconSize?: string | number

  /** 容器 class */
  class?: string | Record<string, boolean> | Array<string | Record<string, boolean>>

  /** 图标 class */
  iconClass?: string | Record<string, boolean> | Array<string | Record<string, boolean>>

  /** 行内样式 */
  style?: CSSProperties
}

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

  <BaseButton
    v-if="siteConfig"
    :icon="siteConfig.icon"
    :size="props.size"
    :icon-size="props.iconSize"
    :class="props.class"
    :icon-class="props.iconClass"
    :style="props.style"
    @click="sitePlay"
  />

  <BaseButton
    v-else-if="isEmby"
    icon="adult-site-emby"
    :size="props.size"
    :icon-size="props.iconSize"
    :class="props.class"
    :icon-class="props.iconClass"
    :style="props.style"
    @click="embySearch(props.videoName)"
  />

</template>

<style scoped lang="scss">
</style>
