<script lang="ts" setup>
import SettingsLayout from './components/SettingsLayout.vue'

import Menu from './layout/menu/index.vue'
/**
 * 设置布局组件
 * 包含侧边栏菜单和主内容区域
 * 使用 vue-router 实现
 */

const route = useRoute()

const router = useRouter()

/**
 * 获取当前路由的标题
 */
const currentTitle = computed(() => {
  return (route.meta.title as string) || '设置中心'
})

/**
 * 检查路由是否激活
 */
function isActive(path: string) {
  return route.path === path
}

/**
 * 导航到指定路径
 */
function navigateTo(path: string) {
  router.push(path)
}
</script>

<template>

  <AppProvider>

    <!-- <SettingsLayout /> -->

    <div
      class="h-[100vh] w-[100vw] flex"
    >
      <Menu />

      <!-- 主内容区域 -->
      <main
        class="flex-1 overflow-auto bg-white"
      >
        <div
          class="p-6"
        >
          <h1
            class="mb-4 text-2xl font-bold"
          >
            {{ currentTitle }}
          </h1>

          <router-view
            v-slot="{ Component }"
          >
            <transition
              name="fade"
              mode="out-in"
            >
              <component
                :is="Component"
              />
            </transition>
          </router-view>
        </div>
      </main>
    </div>

  </AppProvider>

</template>

<style lang="scss">
body {
  margin: 0;
}
</style>
