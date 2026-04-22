<!------  2026-04-03---15:23---星期五  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
function refresh() {
  window.location.reload()
}
</script>

<template>
  <div
    class="fixed bottom-0 left-0 flex justify-center"
  >
    <BaseButton
      icon="option-menu-refresh"
      tooltip-content="刷新"
      tooltip-placement="right"
      @click="refresh"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
