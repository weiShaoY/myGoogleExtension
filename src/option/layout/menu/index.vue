<!------  2026-04-05---02:13---星期天  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>

import LeftMenu from './leftMenu/index.vue'

import RightMenu from './rightMenu/index.vue'

const router = useRouter()

// 获取 当前路由数组
const allRoutes = router.getRoutes()

console.log('🚀 ~ file: index.vue:29 ~ allRoutes:', allRoutes)

const menuList = computed(() => router.getRoutes()) as any

function handleMenuJump(menu: RouterType.Route) {
  router.push(menu.path)
}

</script>

<template>
  <div
    class="h-full flex select-none border-r-1 border-[#EAECF1]"
  >

    <!-- 左侧菜单 -->
    <LeftMenu
      :menu-list="menuList"
      @menu-jump="handleMenuJump"
    />

    <!-- 右侧菜单 -->
    <RightMenu />

  </div>
</template>

<style lang="scss" scoped>

</style>
