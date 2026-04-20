<!------  2026-04-20---17:31---星期一  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { OptionConfig } from '@/configs'

import Content from './content/index.vue'

import Menu from './menu/index.vue'

const layoutStyle = computed(() => ({
  paddingLeft: `calc(${OptionConfig.layoutStyle.leftMenuWidth}px + ${OptionConfig.layoutStyle.rightMenuWidth}px)`,
}))

</script>

<template>
  <div
    class="h-[100vh] w-[100vw] flex overflow-hidden bg-[#fafbfc] transition-all duration-300"
  >
    <Menu />

    <Content />
  </div>
</template>

<style lang="scss" scoped>

</style>
