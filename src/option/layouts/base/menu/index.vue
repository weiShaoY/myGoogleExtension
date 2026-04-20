<!------  2026-04-05---02:13---星期天  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { routes } from '@/option/router/routes'

import LeftMenu from './leftMenu/index.vue'

import RightMenu from './rightMenu/index.vue'

const router = useRouter()

// 获取 当前路由数组
const allRoutes = router.getRoutes()

console.log('🚀 ~ file: index.vue:29 ~ allRoutes:', allRoutes)
const withPath = recursiveNormalizeRoutesPath(routes)

const sorted = recursiveSortRoutesByOrder(withPath)

const menuList = recursiveHandleIframeRoutes(sorted)

console.log('🚀 ~ file: index.vue:20 ~ menuList:', menuList)

const route = useRoute()

const rightMenuList = computed(() => {
  // 获取当前路由的顶级路径，如 '/admin/detail' => '/admin'

  const target = findTopRouteByPath(route.path, menuList)

  if (target) {
  // 返回该菜单的子项，如果存在
    if (target?.children?.length) {
      return target.children
    }
    else {
      return [target]
    }
  }
  else {
    return []
  }
})

</script>

<template>
  <div
    class="h-full flex select-none border-r-1 border-r-[#eeeeee] bg-white"
  >

    <!-- 左侧菜单 -->
    <LeftMenu
      :menu-list="menuList"
      @menu-jump="menuJump"
    />

    <!-- 右侧菜单 -->
    <RightMenu
      :menu-list="rightMenuList"
    />

  </div>
</template>

<style lang="scss" scoped>

</style>
