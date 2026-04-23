<!------  2025-04-16---15:03---星期三  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { computed } from 'vue'

import { useRouter } from 'vue-router'

import MenuItem from './menu-item.vue'

defineOptions({
  name: 'Submenu',
})

const props = withDefaults(defineProps<Props>(), {
  menuList: () => [],
  level: 0,
})

const router = useRouter()

type Props = {

  /**
   *  菜单
   */
  menuList?: RouterType.Route[]

  /**
   *  菜单等级
   */
  level?: number
}

// 判断是否有子菜单
function hasChildren(item: any): boolean {
  console.log('🚀 ~ file: sub-menu.vue:31 ~ item:', item)
  return Boolean(item.children?.length)
}

/**
 * 过滤菜单路由
 */
function filterRoutes(
  items: any[],
): any[] {
  return items
    .filter(item => !item.meta.isHideInMenu)
    .map(item => ({
      ...item,
      children: item.children ? filterRoutes(item.children) : undefined,
    }))
}

// 计算属性
const filteredMenuItems = computed(() => filterRoutes(props.menuList))

console.log('🚀 ~ file: sub-menu.vue:50 ~ filteredMenuItems:', filteredMenuItems)

/**
 *  跳转页面
 */
function goPage(item: any) {
  menuJump(item)
}

/**
 * 菜单跳转
 */
function menuJump(menu: any) {
  if (menu.children && menu.children.length > 0) {
    router.push(menu.children[0].path)
  }
  else {
    router.push(menu.path)
  }
}

</script>

<template>
  <template
    v-for="item in filteredMenuItems"
    :key="item.path"
  >
    <!-- 包含子菜单的项目 -->
    <el-sub-menu
      v-if="hasChildren(item)"
      :index="item.path"
      :level="level"
    >

      <template
        #title
      >
        <MenuItem
          :menu="item"
        />
      </template>

      <Submenu
        :menu-list="item.children"
        :level="level + 1"
      />
    </el-sub-menu>

    <!-- 普通菜单项 -->
    <el-menu-item
      v-else
      :index="item.path"
      :level-item="level + 1"
      class="m-x-auto mb-2 w-[calc(100%-16px)] rounded-3"
      @click="goPage(item)"
    >
      <template
        #title
      >
        <MenuItem
          :menu="item"
        />
      </template>
    </el-menu-item>
  </template>
</template>

<style lang="scss">

.el-sub-menu__title {
  margin: 0 auto !important;
  margin-bottom: 8px !important;
  width: calc(100% - 16px) !important;
  border-radius: 12px !important;
}
.el-sub-menu__icon-arrow {
  right: 20px;
  width: 15px !important;
  font-weight: bold;
}

.el-menu-item.is-active {
  color: var(--el-color-primary) !important;
  background-color: var(--el-color-primary-light-9);
  background-image: var(--el-color-primary-custom-14);
}
</style>
