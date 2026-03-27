<script setup lang="ts">

import DetailsPage from './detailsPage/index.vue'

import ListPage from './listPage/index.vue'

const isListPage = !!$('#waterfall')

console.log('🚀 ~ file: index.vue:8 ~ isListPage:', isListPage)

const bodyClass = isListPage ? 'javbus-list-page' : 'javbus-details-page'

document.body.classList.add('javbus', bodyClass)
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
