<!------  2026-03-24---13:58---星期二  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { onMounted } from 'vue'

onMounted(() => {
  const a = isHostnameMatch('emby') ? 'emby' : '不是 emby'

  window.$message({
    message: a,
    duration: 113000,
    type: 'success',
  })
})

</script>

<template>
  <div
    class="bottom-10 right-10 bg-red !fixed"
  >
    emby
  </div>

</template>

<style lang="scss" scoped>

</style>
