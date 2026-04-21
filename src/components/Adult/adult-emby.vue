<!------  2026-03-29---02:21---星期天  ------>
<!------------------------------------    ------------------------------------------------->
<script lang="ts" setup>
import { embySearch } from '@/apis'

type PropsType = {

  /**
   * 视频名称
   */
  videoName: string

  /**
   *  是否设置弹窗使用
   */
  isFromSettingDialog?: boolean
}

const props = defineProps<PropsType>()

function embyBtnHandler() {
  if (!props.videoName) {
    return
  }

  embySearch(props.videoName)
}
</script>

<template>
  <div
    class="group relative box-border h-full w-full cursor-pointer overflow-hidden border-3 border-emby rounded-2 border-solid bg-white p-x-1"
    @click="embyBtnHandler"
  >
    <!-- 滑动背景 -->
    <div
      class="absolute inset-0 z-0 bg-emby transition-all duration-1000 -translate-x-full group-hover:translate-x-0"
    />

    <div
      class="grid grid-cols-2 h-full w-full w-full gap-2 [&>*:last-child:nth-child(1)]:col-span-2"
    >
      <!-- 文字 -->
      <div
        v-if="isFromSettingDialog"
        class="relative flex items-center pl-[20%] text-6 text-emby font-bold transition-colors duration-1000 group-hover:text-white"
      >
        {{ videoName }}
      </div>

      <!-- 图标：淡入淡出平滑切换 -->
      <div
        class="relative h-full flex items-center justify-center"
      >
        <!-- 默认图标 → 慢慢隐藏 -->
        <SvgIcon
          icon="content-adult-setting-emby"
          :size="30"
          class="absolute opacity-100 transition-opacity duration-1000 group-hover:opacity-0"
        />
        <!-- 悬浮图标 → 慢慢显示 -->
        <SvgIcon
          icon="content-adult-setting-embyHover"
          :size="30"
          class="absolute text-white opacity-0 transition-opacity duration-1000 group-hover:opacity-100"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
