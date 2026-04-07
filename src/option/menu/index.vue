<!------  2026-04-05---02:13---星期天  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>

import LeftMenu from './leftMenu/index.vue'

import RightMenu from './rightMenu/index.vue'

const currentIndex = ref('1')

const menuList = [
  {
    index: '1',
    title: 'Emby',
    icon: 'option-menu-emby',
  },
  {
    index: '2',
    title: '设置',
    icon: 'option-menu-emby',

  },
]

</script>

<template>
  <div
    class="h-full flex select-none border-r-1 border-[#EAECF1] bg-[rgb(227,180,203)] pt-20"
  >

    <!-- 左侧菜单 -->
    <LeftMenu
      :current-index="currentIndex"
      :menu-list="menuList"
    />

    <!-- 右侧菜单 -->
    <!-- <RightMenu /> -->

  </div>
</template>

<style lang="scss" scoped>
:deep(.el-scrollbar__bar.is-vertical) {
  display: none;
}
</style>
