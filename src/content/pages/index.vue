<!------  2026-03-24---13:58---星期二  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { onMounted } from 'vue'

import Emby from './emby/index.vue'

import Javbus from './javbus/index.vue'

import Javdb from './javdb/index.vue'

onMounted(() => {
  console.log('[index.vue] window.$message:', window.$message)
  console.log('[index.vue] document.body:', document.body)

  window.$message({
    message: '测试页',
    duration: 113000,
    type: 'success',
  })

  // const a = isHostnameMatch('google') ? 'google' : '不是google'

  // window.$message({
  //   message: a,
  //   duration: 113000,
  //   type: 'success',
  // })
})

</script>

<template>
  <!-- <div
    class="bottom-10 right-10 bg-primary !fixed"
  >
    测试112
  </div> -->

  <Emby
    v-if="isHostnameMatch('emby')"
  />

  <Javdb
    v-else-if="isHostnameMatch('javdb')"
  />

  <Javbus
    v-else-if="isHostnameMatch('javbus')"
  />
</template>

<style lang="scss" scoped>

</style>
