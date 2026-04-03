<!------  2026-03-24---13:14---星期二  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>

// import { AppConfig } from '@/configs'

import Adult from './adult/index.vue'

import Refresh from './refresh/index.vue'

import Search from './search/index.vue'

import Test from './test.vue'

onMounted(() => {
  // window.$message({
  //   message: '显示搜索框',
  //   duration: 113000,
  //   type: 'success',
  // })

})
</script>

<template>

  <AppProvider>

    <Adult />

    <Search />

    <Test
      v-if="AppConfig.isShowTest"
    />

    <Refresh />

  </AppProvider>

</template>

<style lang="scss" scoped>

</style>
