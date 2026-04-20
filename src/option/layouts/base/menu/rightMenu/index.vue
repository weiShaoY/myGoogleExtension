<script lang="ts" setup>
import { useRoute } from 'vue-router'

import { OptionConfig } from '@/configs'

import SubMenu from './sub-menu.vue'

const { menuList } = defineProps<Props>()

const route = useRoute()

type Props = {

  /**
   *  菜单
   */
  menuList: RouterType.Route[]
}
const rightMenuWidth = `${OptionConfig.layoutStyle.rightMenuWidth}px`

</script>

<template>
  <div
    class=""
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
        :style="{
          width: rightMenuWidth,
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
