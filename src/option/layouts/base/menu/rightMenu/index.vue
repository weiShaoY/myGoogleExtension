<script lang="ts" setup>
import { useRoute } from 'vue-router'

import SubMenu from './sub-menu.vue'

const { menuList } = defineProps<Props>()

const route = useRoute()

type Props = {

  /**
   *  菜单
   */
  menuList: RouterType.Route[]
}

/**
 * 获取所有需要展开的菜单 key
 */
function getOpenKeys(list: RouterType.Route[]): string[] {
  const result: string[] = []

  function traverse(menu: RouterType.Route[]) {
    menu.forEach((item) => {
      if (item.children && item.children.length) {
        result.push(item.path) // 只展开有子菜单的

        traverse(item.children)
      }
    })
  }

  traverse(list)

  return result
}

/**
 * 打开的菜单
 */
const openKeys = computed(() => getOpenKeys(menuList))
</script>

<template>
  <div
    class="border-r-2 border-solid !border-[#eeeeee]"
  >
    <div
      class="h-15 flex items-center justify-center"
    >
      <SvgIcon
        icon="weiShaoY"
        :size="120"
      />
    </div>

    <el-scrollbar
      :style="{
        height: `calc(100% - 60px)`,
      }"
    >
      <el-menu
        :default-active="route.path"
        :default-openeds="openKeys"
        :style="{
          width: '260px',
        }"
      >
        <SubMenu
          :menu-list="menuList"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style>
.el-menu {
  border: none !important;
}
</style>
