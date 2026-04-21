<!------  2026-04-21---00:41---星期二  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import JsonEditorVue from 'json-editor-vue'

const adultStore = useAdultStore()

const json = computed(() => adultStore.embyFolder)

const options = {

}

</script>

<template>
  <div
    class=""
  >
    <JsonEditorVue
      v-model="json"
      :options="options"
      class="overflow-auto p-3 !h-full !w-full"
    />
  </div>
</template>

<style lang="scss" scoped>

</style>
