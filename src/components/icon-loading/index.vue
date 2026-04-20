<script setup lang="ts">

type props = {

  /**
   *  加载图标的大小
   */
  size?: number
}

withDefaults(defineProps<props>(), {
  size: 24,
})

</script>

<template>
  <div
    class="h-full flex items-center justify-center"
  >
    <!-- 这里是加载动画的具体内容 -->
    <SvgIcon
      icon="loading"
      :size="size"
      class="animate-spin"
    />
  </div>
</template>

<style scoped>

</style>
