<!------  2026-03-24---13:58---星期二  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log('[index.vue] window.$notification:', window.$notification)
  window.$message({
    message: '测试',
    duration: 113000,
  })
})
</script>

<template>
  <div
    class="bottom-10 right-10 bg-primary !fixed"
  >
    测试112
  </div>
</template>

<style lang="scss" scoped>

</style>
