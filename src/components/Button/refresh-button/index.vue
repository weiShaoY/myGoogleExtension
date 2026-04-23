<!------------------------------------  刷新按钮  ------------------------------------------------->
<script lang="ts" setup>

type Props = {

  /** 刷新按钮尺寸 */
  size?: string | number

  /** 容器 class */
  class?: string | Record<string, boolean> | Array<string | Record<string, boolean>>
}

const props = withDefaults(defineProps<Props>(), {
  size: 40,
})

function refresh() {
  window.location.reload()
}
</script>

<template>
  <BaseButton
    icon="option-menu-refresh"
    :size="props.size"
    :class="props.class"
    tooltip-content="刷新"
    tooltip-placement="right"
    @click="refresh"
  />
</template>

<style lang="scss" scoped>

</style>
