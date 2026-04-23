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

async function goOptionPage() {
  try {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage()
    }
    else {
      chrome.runtime.sendMessage({
        type: 'OPEN_OPTIONS',
      })
    }
  }
  catch (error) {
    console.error('跳转选项页失败:', error)
  }
}
</script>

<template>
  <BaseButton
    icon="option"
    :size="props.size"
    :class="props.class"
    tooltip-content="跳转到插件选项页"
    tooltip-placement="right"
    @click="goOptionPage"
  />
</template>

<style lang="scss" scoped>

</style>
