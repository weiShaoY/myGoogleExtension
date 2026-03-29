<!------  2025-08-12---16:47---星期二  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import DetailsPage from './missavDetailsPage.vue'

import ListPage from './missavListPage.vue'

const isListPage = !$('#sprite-plyr')

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
