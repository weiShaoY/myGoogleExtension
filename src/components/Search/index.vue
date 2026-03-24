<!------  2026-03-24---15:58---星期二  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { SearchConfig } from '@/configs'

import Main from './main.vue'

// 循环 SearchConfig.sites 数组，判断当前页面是否是搜索引擎页面
const isShowSearch = computed(() => {
  return SearchConfig.displayOnPaths.some(site => isUrlMatch(site))
})

onMounted(() => {
  console.log('🚀 ~ file: index.vue:16 ~ isShowSearch.value:', isShowSearch.value)
  window.$message({
    message: isShowSearch.value ? '显示搜索框' : '不显示搜索框',
    duration: 113000,
    type: 'success',
  })
})
</script>

<template>
  <Main
    v-if="isShowSearch"
  />
</template>

<style lang="scss" scoped>

</style>
