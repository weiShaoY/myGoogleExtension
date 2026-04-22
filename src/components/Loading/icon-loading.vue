<script setup lang="ts">

type Props = {

  /**
   * 加载图标的大小
   */
  size?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
})

/**
 * 计算图标尺寸
 */
const computedSize = computed(() => parseSize(props.size))
</script>

<template>
  <div
    class="h-full flex items-center justify-center"
  >
    <!-- 加载动画 -->
    <SvgIcon
      icon="loading"
      :size="computedSize"
      class="animate-spin"
    />
  </div>
</template>

<style scoped>
</style>
