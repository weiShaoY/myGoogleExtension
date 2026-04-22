<script lang="ts" setup>

type IconLinkPropsType = {

  /**
   * 图标名称
   */
  icon: string

  /**
   * 图标大小
   */
  size?: number | string

  /**
   * 图标颜色
   */
  color?: string

  /**
   * 跳转链接
   */
  url: string
}

const props = withDefaults(defineProps<IconLinkPropsType>(), {
  size: 34,
  color: 'white',
})

/**
 * 计算图标尺寸
 */
const computedSize = computed(() => parseSize(props.size))

function handleClick(event: MouseEvent) {
  // 中键点击交给浏览器
  if (event.button === 1) {
    return
  }

  event.preventDefault()
  window.open(props.url, '_blank', 'noopener noreferrer')
}
</script>

<template>
  <a
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    class="block cursor-pointer"
    @click="handleClick"
  >
    <SvgIcon
      class="transform transition-transform duration-500 hover:-translate-y-1"
      :icon="icon"
      :size="computedSize"
      :style="{ color }"
    />
  </a>
</template>
