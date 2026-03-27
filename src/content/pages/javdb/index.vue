<script setup lang="ts">

import DetailsPage from './detailsPage/index.vue'

import ListPage from './listPage/index.vue'

const isListPage = !!$('.movie-list')

const bodyClass = isListPage ? 'javdb-list-page' : 'javdb-details-page'

document.body.classList.add('javdb', bodyClass)
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
