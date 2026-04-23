<script lang="ts" setup>
import { computed } from 'vue'

// 导入组件
import Emby from './pages/emby/index.vue'

import Javbus from './pages/javbus/index.vue'

import Javdb from './pages/javdb/index.vue'

import Missav from './pages/missav/index.vue'

// import Setting from './setting/index.vue'

// 1. 定义映射配置
const componentMap: Record<string, any> = {
  emby: Emby,
  javdb: Javdb,
  javbus: Javbus,
  missav: Missav,
}

//  2. 获取当前激活的类型 (假设 isUrlMatch 是全局或已注入的方法)
const activeType = computed(() => {
  return Object.keys(componentMap).find(key => isUrlMatch(key))
})

// 3. 判断是否显示设置页
// const showSetting = computed(() => !!activeType.value)
</script>

<template>
  <!-- 如果需要设置页，始终挂载 -->
  <!-- <Setting
    v-if="showSetting"
  /> -->

  <!-- 动态组件：根据当前匹配到的类型自动渲染对应的组件 -->
  <component
    :is="componentMap[activeType]"
    v-if="activeType"
  />
</template>
