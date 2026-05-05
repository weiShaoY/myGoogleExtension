<script setup lang="ts">

import DetailsPage from './embyDetailsPage.vue'

const isListPage = !!$('#waterfall')

const bodyClass = isListPage ? 'javbus-list-page' : 'javbus-details-page'

document.body.classList.add('javbus', bodyClass)
</script>

<template>

  <DetailsPage />
</template>

<style lang="scss">
</style>
