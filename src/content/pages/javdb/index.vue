<script setup lang="ts">

import DetailsPage from './javdbDetailsPage.vue'

import ListPage from './javdbListPage.vue'

const isListPage = !!$('.movie-list')

const bodyClass = isListPage ? 'javdb-list-page' : 'javdb-details-page'

alert(1)

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
