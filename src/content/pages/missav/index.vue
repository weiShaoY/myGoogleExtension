<!------  2025-08-12---16:47---星期二  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import DetailsPage from './detailsPage/index.vue'

import ListPage from './listPage/index.vue'

const isListPage = !$('#sprite-plyr')

console.log('🚀 ~ file: index.vue:9 ~ isListPage:', isListPage)

console.log('🚀 ~ file: index.vue:9 ~ isListPage:', isListPage)

const bodyClass = isListPage ? 'missav-details-page' : 'missav-list-page'

document.body.classList.add('missav', bodyClass)

</script>

<template>

  <ListPage
    v-if="isListPage"
  />

  <DetailsPage
    v-else
  />

</template>

<style lang="scss">
@use './index.scss';
</style>
