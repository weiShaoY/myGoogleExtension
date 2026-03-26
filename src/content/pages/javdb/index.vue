<!------  2025-08-12---16:47---星期二  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import ListPage from './listPage/index.vue'

// import DetailsPage from './detailsPage/index.vue'

import './index.scss'

/**
 * 判断是列表页还是详情页
 */
const isListPage = ref(false)

console.log('🚀 ~ file: index.vue:15 ~ isListPage:', isListPage)

const waterfallElement = document.querySelector('.movie-list')

const bodyElement = document.querySelector('body')

// 检查 waterfallElement 是否有元素
if (waterfallElement) {
  isListPage.value = true
  bodyElement?.classList.add('javdb', 'javdb-list-page')
}
else {
  isListPage.value = false
  bodyElement?.classList.add('javdb', 'javdb-details-page')
}

</script>

<template>

  <ListPage />

  <!-- <DetailsPage
    v-else
  /> -->

</template>

<style lang="scss" scoped>
</style>
