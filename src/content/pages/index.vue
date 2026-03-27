<!------  2026-03-24---13:58---星期二  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>

import { onMounted } from 'vue'

import Emby from './emby/index.vue'

import Javbus from './javbus/index.vue'

import Javdb from './javdb/index.vue'

// const folderStore = useFolderStore()

onMounted(() => {
  // console.log('[index.vue] window.$message:', window.$message)
  // console.log('[index.vue] document.body:', document.body)
  // window.$message({
  //   message: '测试页',
  //   duration: 113000,
  //   type: 'success',
  // })
})

</script>

<template>

  <Setting
    v-if="isUrlMatch('emby') || isUrlMatch('javdb') || isUrlMatch('javbus')"
  />

  <!-- <template
    v-if="folderStore.embyFolder.folderFileList"
  >
    <Emby
      v-if="isUrlMatch('emby')"
    />

    <Javdb
      v-else-if="isUrlMatch('javdb')"
    />

    <Javbus
      v-else-if="isUrlMatch('javbus')"
    />
  </template> -->

  <Emby
    v-if="isUrlMatch('emby')"
  />

  <Javdb
    v-else-if="isUrlMatch('javdb')"
  />

  <Javbus
    v-else-if="isUrlMatch('javbus')"
  />

</template>

<style lang="scss" scoped>

</style>
