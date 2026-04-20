<script setup lang="ts">
import { computed, onMounted } from 'vue'

import { useRoute } from 'vue-router'

const route = useRoute()

const router = useRouter()

/**
 *  监听 route.meta.externalUrl 的变化
 */
const externalUrl = computed(() => route.meta.externalUrl as string)

onMounted(() => {
  if (!externalUrl.value) {
    window.$notification.error('externalUrl 未找到，请确保 meta 中包含 externalUrl')
    return
  }

  try {
    // 使用 _blank 而不是 _black（拼写错误）
    window.open(externalUrl.value, '_blank')

    // 延迟返回，避免路由冲突
    setTimeout(() => {
      router.back()
    }, 100)
  }
  catch {
    window.$notification.error('打开外部链接失败')
  }
})
</script>

<template>
  <div
    class=""
  />
</template>

<style scoped>

</style>
