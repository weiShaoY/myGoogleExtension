<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import type { CSSProperties } from 'vue'

import { useEmbyStore } from '@/stores'

type PropsType = {

  /**
   *   视频名称
   */
  videoName: string

  /**
   *  emby搜索名称
   */
  embySearchName: string

  /**
   *   按钮宽度
   */
  width?: string | number

  /**
   *   按钮高度
   */
  height?: string | number

  /**
   *   圆角
   */
  radius?: string | number

  /**
   *   按钮类名
   */
  class?: string

  /**
   *   按钮样式
   */
  style?: CSSProperties
}

const props = withDefaults(defineProps<PropsType>(), {
  radius: 10,
  class: '',
})

const embyStore = useEmbyStore()

function embyBtnHandler(event: MouseEvent) {
  event.preventDefault()

  embyStore.embySearch(props.embySearchName)
}
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
      class="h-full w-full flex translate-x-0 cursor-pointer cursor-pointer items-center items-center justify-between justify-between overflow-hidden border-3 border-solid bg-transparent p-x-1 text-lg font-bold before:absolute before:left-0 before:top-0 before:z-[-1] before:h-full before:w-full before:translate-x-[-100%] !border-[#52B54B] !bg-white before:bg-[#52B54B] !text-[#52B54B] before:transition-all-600 before:content-[''] hover:before:translate-x-0 !hover:text-white"
      @click="embyBtnHandler"
    >
      <span>
        {{ videoName }}
      </span>

      <div
        class="m-x-5"
      >
        <SvgIcon
          icon="emby"
          :size="30"
          class="group-hover:hidden"
        />

        <SvgIcon
          icon="embyHover"
          :size="30"
          class="hidden group-hover:block"
        />

      </div>
    </button>

  </div>

</template>

<style lang="scss" scoped></style>
