<script setup lang="ts">

import DetailsPage from './javbusDetailsPage.vue'

import ListPage from './javbusListPage.vue'

const isListPage = !!$('#waterfall')

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
