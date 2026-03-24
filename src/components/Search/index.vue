<!------  2026-03-24---15:58---星期二  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { SearchConfig } from '@/configs'

import Main from './main.vue'

// 循环 SearchConfig.sites 数组，判断当前页面是否是搜索引擎页面
const isShowSearch = computed(() => {
  return SearchConfig.displayOnPaths.some(site => isHostnameMatch(site))
})
</script>

<template>
  <Main
    v-if="isShowSearch"
  />
</template>

<style lang="scss" scoped>

</style>
