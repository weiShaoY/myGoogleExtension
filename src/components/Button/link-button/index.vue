<script lang="ts" setup>
type IconLinkPropsType = {

  /**
   * 图标名称
   */
  icon: string

  /**
   * 图标大小
   */
  size?: number

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

function handleClick(event: MouseEvent) {
  // 如果是中键点击，让浏览器默认行为处理
  if (event.button === 1) {
    return
  }

  // 其他点击行为使用自定义处理
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
      :size="size"
      :style="{ color }"
    />
  </a>
</template>
