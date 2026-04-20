<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'

import { routes } from '@/option/router/routes'

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
  <div
    class="h-[100vh] w-[100vw] flex"
  >
    <!-- 左侧菜单 -->
    <div
      class="h-full flex select-none border-r-1 border-[#EAECF1] bg-[rgb(227,180,203)] pt-20"
    >
      <el-scrollbar
        class="h-full"
      >
        <div
          v-for="r in routes"
          :key="r.path"
          class="mb-3 box-border flex items-center justify-center"
        >
          <el-tooltip
            class="box-item"
            effect="dark"
            :content="r.meta.title"
            placement="right"
            :offset="25"
            :hide-after="0"
          >
            <div
              class="aspect-square flex flex-col cursor-pointer items-center justify-center rounded-2 text-center transition-all duration-300"
              :class="[
                isActive(r.path) ? 'bg-[#F3B03D] color-white' : '',
              ]"
              @click="navigateTo(r.path)"
            >
              <SvgIcon
                v-if="r.meta.icon"
                :icon="r.meta.icon"
                class="scale-130"
              />
            </div>
          </el-tooltip>
        </div>
      </el-scrollbar>
    </div>

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
</template>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
