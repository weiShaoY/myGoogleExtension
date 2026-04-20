<!-- 内容布局 -->
<script setup lang="ts">

// 过渡动画配置
const transitionProps = {
  name: 'slide-bottom',
  mode: 'out-in',
  appear: true,
} as const

</script>

<template>
  <div
    class="layout-content h-full flex-1 overflow-auto p-5"
  >

    <RouterView
      v-slot="{ Component, route }"
      class="w-full"
    >
      <Transition
        v-bind="transitionProps"
      >
        <component
          :is="Component"
          :key="route.path"
        />
      </Transition>
    </RouterView>
  </div>
</template>

<style scoped>
.layout-content {
  transition: max-width 0.3s ease-in-out;
}
</style>
