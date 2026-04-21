<script lang="ts" setup>
import AppProvider from '@/components/AppProvider/index.vue'

</script>

<template>

  <AppProvider>

    <div
      class=""
    >
      <PageLoading />
    </div>

    <RouterView />

  </AppProvider>

</template>

<style lang="scss">
body {
  margin: 0;
}
</style>
