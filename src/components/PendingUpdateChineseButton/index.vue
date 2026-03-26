<!------------------------------------  待更新中文按钮  ------------------------------------------------->
<script lang="ts" setup>
import type { CSSProperties } from 'vue'

type PropsType = {

  /**
   *  按钮宽度
   */
  width?: number | string

  /**
   *  按钮高度
   */
  height?: number | string

  /**
   *  圆角
   */
  radius?: number | string

  /**
   *  按钮类名
   */
  class?: string

  /**
   *  按钮样式
   */
  style?: CSSProperties
}

const props = withDefaults(defineProps<PropsType>(), {
  // width: 0,
  // height: 0,
  radius: 10,
  class: '',
  style: () => ({
  }),
})

</script>

<template>
  <div
    class="z-1000 m-x-auto m-y-5 w-[95%]"
    :class="props.class"
    :style="{
      borderRadius: `${radius}px`,
      height: typeof height === 'number' ? `${height}px` : `${height}`,
      width: typeof width === 'number' ? `${width}px` : `${width}`,
      ...style,
    }"
  >

    <button
      class="w-full cursor-pointer border-2 border-yellow-500 rounded-md from-yellow-400 to-yellow-600 bg-gradient-to-r px-5 py-2 text-white font-semibold transition duration-300 ease-in-out hover:border-yellow-600 hover:from-yellow-500 hover:to-yellow-700 focus:shadow-yellow-400 hover:shadow-xl hover:shadow-yellow-500 hover:ring-2 focus:ring-yellow-300 hover:ring-yellow-600"
    >
      可更新中文
    </button>

  </div>
</template>

<style lang="less" scoped>

</style>
