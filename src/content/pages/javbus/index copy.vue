<!------  2026-03-24---13:58---星期二  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { onMounted } from 'vue'

onMounted(() => {
  const a = isHostnameMatch('javbus') ? 'javbus' : '不是 javbus'

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
    javbus
  </div>

</template>

<style lang="scss" scoped>

</style>
