<script setup lang="ts">

import { onMounted, ref } from 'vue'

import { useRoute } from 'vue-router'

const route = useRoute()

/**
 * 加载状态
 */
const isLoading = ref(false)

/**
 * iframe 地址
 */
const iframeUrl = ref('')

/**
 * 处理 iframe 加载完成
 */
function handleIframeLoad(): void {
  isLoading.value = false
}

/**
 * 初始化 iframe
 */
function initIframe(): void {
  const url = route.meta.iframeUrl as string | undefined

  if (!url) {
    window.$notification.error('iframeUrl 未找到，请确保 meta 中包含 iframeUrl')
    console.error('iframeUrl 未找到，请确保 meta 中包含 iframeUrl')
    return
  }

  iframeUrl.value = url
  isLoading.value = true
}

onMounted(initIframe)
</script>

<template>
  <div
    v-loading="isLoading"
    class="h-full flex"
  >
    <iframe
      v-if="iframeUrl"
      :src="iframeUrl"
      frameborder="0"
      class="w-full flex-1 border-none"
      @load="handleIframeLoad"
    />
  </div>
</template>
