<!------  2026-04-21---00:41---星期二  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import VueJsonPretty from 'vue-json-pretty'

import 'vue-json-pretty/lib/styles.css'

const adultStore = useAdultStore()

const json = computed(() => adultStore.embyFolder)
</script>

<template>
  <div
    class=""
  >
    <VueJsonPretty
      :data="json"
      show-line
      show-length
      show-line-number
      :collapsed-on-click-bracket="true"
      :editable="true"
      class="overflow-auto p-3 !h-full !w-full"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
