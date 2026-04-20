<!-- 内容布局 -->
<script setup lang="ts">

</script>

<template>
  <div
    class="layout-content m-auto h-full w-full"
  >
    <!-- 路由切换动画 -->
    <Suspense>
      <template
        #default
      >
        <router-view
          v-slot="{ Component }"
        >
          <Transition
            name="slide-left"
            mode="out-in"
            appear
          >
            <component
              :is="Component"
            />
          </Transition>
        </router-view>
      </template>

      <template
        #fallback
      >
        <IconLoading />
      </template>
    </Suspense>

  </div>
</template>

<style scoped lang="scss">

</style>
